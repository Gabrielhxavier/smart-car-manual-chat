import { memo } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Car, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onClear: () => void;
  hasMessages: boolean;
}

export const ChatHeader = memo(function ChatHeader({ 
  onClear, 
  hasMessages 
}: ChatHeaderProps) {
  return (
    <header className="bg-header text-header-foreground px-4 py-3 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <Car className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Manual Inteligente</h1>
            <p className="text-xs text-header-foreground/70">
              Assistente RAG • Respostas baseadas no manual oficial
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasMessages && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-header-foreground/80 hover:text-header-foreground 
                         hover:bg-white/10 gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Limpar conversa</span>
            </Button>
          )}
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-header-foreground/80 hover:text-header-foreground 
                         hover:bg-white/10 gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Início</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
});
