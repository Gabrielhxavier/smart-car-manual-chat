import { memo } from 'react';

interface SuggestionChipsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

const suggestions = [
  "Como trocar o óleo do motor?",
  "Qual a pressão correta dos pneus?",
  "Como resetar o computador de bordo?",
  "Onde fica o fusível dos faróis?",
  "Qual o intervalo de troca de correia?",
];

export const SuggestionChips = memo(function SuggestionChips({ 
  onSelect, 
  disabled 
}: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center px-4 py-3">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className="px-3 py-1.5 text-sm rounded-full bg-chip text-foreground/80 
                     hover:bg-chip-hover transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     border border-border/50 hover:border-border"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
});
