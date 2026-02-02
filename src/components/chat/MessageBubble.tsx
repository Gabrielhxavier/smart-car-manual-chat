import { memo } from 'react';
import { User, Bot } from 'lucide-react';
import { CitationList } from './CitationList';
import type { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div 
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser 
            ? 'bg-user-bubble text-user-bubble-foreground' 
            : 'bg-accent/20 text-accent-foreground'
          }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div 
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3
          ${isUser 
            ? 'bg-user-bubble text-user-bubble-foreground rounded-br-md' 
            : 'bg-assistant-bubble text-assistant-bubble-foreground rounded-bl-md shadow-sm border border-border/50'
          }`}
      >
        <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>

        {/* Citations (only for assistant) */}
        {!isUser && message.citations && message.citations.length >= 0 && (
          <CitationList citations={message.citations} />
        )}
      </div>
    </div>
  );
});
