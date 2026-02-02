import { useState, useCallback, useEffect } from 'react';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { SuggestionChips } from '@/components/chat/SuggestionChips';
import { sendChatMessage, getPersistedThreadId, persistThreadId } from '@/lib/api';
import type { Message } from '@/types/chat';

const OUT_OF_SCOPE_MESSAGE = 
  "Desculpe, esta pergunta parece estar fora do escopo do manual do veículo. " +
  "Posso ajudar com dúvidas sobre manutenção, funcionamento e especificações do seu carro.";

const ERROR_MESSAGE = "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string | null>(() => getPersistedThreadId());
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Persist threadId whenever it changes
  useEffect(() => {
    persistThreadId(threadId);
  }, [threadId]);

  const handleSend = useCallback(async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    // Clear any previous error
    setError(null);

    const userMessageId = generateId();
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: trimmedInput,
      timestamp: new Date()
    };

    // Optimistic update: add user message before API call
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(trimmedInput, threadId);
      
      // Update threadId if it changed
      if (response.threadId && response.threadId !== threadId) {
        setThreadId(response.threadId);
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.out_of_scope ? OUT_OF_SCOPE_MESSAGE : response.response,
        citations: response.citations,
        outOfScope: response.out_of_scope,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGE;
      setError(errorMsg);
      
      // Add error message from assistant
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: ERROR_MESSAGE,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, threadId]);

  const handleClear = useCallback(() => {
    setMessages([]);
    setThreadId(null);
    setInput('');
    setError(null);
    persistThreadId(null);
  }, []);

  const handleSuggestionSelect = useCallback((question: string) => {
    setInput(question);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader onClear={handleClear} hasMessages={messages.length > 0} />
      
      <main className="flex-1 flex flex-col overflow-hidden max-w-4xl w-full mx-auto">
        <MessageList messages={messages} loading={loading} />
        
        {messages.length === 0 && (
          <SuggestionChips onSelect={handleSuggestionSelect} disabled={loading} />
        )}
        
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={loading}
          error={error}
        />
      </main>
    </div>
  );
}
