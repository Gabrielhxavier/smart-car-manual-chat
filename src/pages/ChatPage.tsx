import { useState, useCallback } from 'react';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { SuggestionChips } from '@/components/chat/SuggestionChips';
import type { Message, ChatResponse } from '@/types/chat';

const OUT_OF_SCOPE_MESSAGE = 
  "Desculpe, esta pergunta parece estar fora do escopo do manual do veículo. " +
  "Posso ajudar com dúvidas sobre manutenção, funcionamento e especificações do seu carro.";

const ERROR_MESSAGE = "Desculpe, ocorreu um erro ao processar sua mensagem.";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Mock function - will be replaced with real API call
async function sendMessageToAPI(
  message: string, 
  threadId: string | null
): Promise<ChatResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock responses for demonstration
  const mockResponses: Record<string, ChatResponse> = {
    'óleo': {
      answer: "Para trocar o óleo do motor, siga estes passos:\n\n1. Aqueça o motor por 5 minutos\n2. Desligue e aguarde 2 minutos\n3. Posicione o recipiente sob o cárter\n4. Remova o bujão de drenagem\n5. Substitua o filtro de óleo\n6. Recoloque o bujão e adicione o óleo novo",
      citations: [
        {
          source: "manual_proprietario.pdf",
          page: 142,
          section: "Manutenção do Motor",
          excerpt: "A troca de óleo deve ser realizada a cada 10.000 km ou 12 meses, o que ocorrer primeiro."
        },
        {
          source: "manual_proprietario.pdf",
          page: 143,
          section: "Especificações de Lubrificantes",
          excerpt: "Utilize óleo sintético 5W-30 API SN ou superior. Capacidade total: 4,5 litros."
        }
      ],
      out_of_scope: false,
      threadId: threadId || generateId()
    },
    'pneus': {
      answer: "A pressão recomendada para os pneus varia conforme a carga do veículo:\n\n• Dianteiros: 32 psi (com carga normal)\n• Traseiros: 30 psi (com carga normal)\n• Com carga máxima: adicionar 4 psi",
      citations: [
        {
          source: "manual_proprietario.pdf",
          page: 221,
          section: "Pneus e Rodas",
          excerpt: "Verifique a pressão dos pneus semanalmente, sempre com os pneus frios."
        }
      ],
      out_of_scope: false,
      threadId: threadId || generateId()
    }
  };

  // Check for keywords in the message
  const lowerMessage = message.toLowerCase();
  for (const [keyword, response] of Object.entries(mockResponses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }

  // Default mock response
  return {
    answer: "Baseado no manual do proprietário, aqui estão as informações relevantes para sua pergunta.",
    citations: [
      {
        source: "manual_proprietario.pdf",
        page: 15,
        section: "Informações Gerais",
        excerpt: "Consulte sempre o manual para informações específicas do seu modelo."
      }
    ],
    out_of_scope: false,
    threadId: threadId || generateId()
  };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  const handleSend = useCallback(async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: trimmedInput
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendMessageToAPI(trimmedInput, threadId);
      
      setThreadId(response.threadId);

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.out_of_scope ? OUT_OF_SCOPE_MESSAGE : response.answer,
        citations: response.citations,
        outOfScope: response.out_of_scope
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: ERROR_MESSAGE
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
        />
      </main>
    </div>
  );
}
