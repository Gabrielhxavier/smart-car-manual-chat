import { memo, useCallback, KeyboardEvent, ChangeEvent } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  error?: string | null;
}

export const ChatInput = memo(function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  error
}: ChatInputProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  }, [value, disabled, onSend]);

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-border bg-card p-4">
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm mb-3 max-w-4xl mx-auto">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <div className="flex gap-2 max-w-4xl mx-auto">
        <Textarea
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua pergunta sobre o manual..."
          disabled={disabled}
          className="min-h-[44px] max-h-32 resize-none bg-background border-border 
                     focus-visible:ring-1 focus-visible:ring-primary/50"
          rows={1}
        />
        <Button
          onClick={onSend}
          disabled={!canSend}
          size="icon"
          className="h-11 w-11 flex-shrink-0 bg-primary hover:bg-primary/90 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-4 h-4" />
          <span className="sr-only">Enviar</span>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Pressione Enter para enviar, Shift+Enter para nova linha
      </p>
    </div>
  );
});
