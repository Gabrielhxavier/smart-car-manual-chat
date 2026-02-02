import { memo } from 'react';
import { BookMarked } from 'lucide-react';
import { CitationCard } from './CitationCard';
import type { Citation } from '@/types/chat';

interface CitationListProps {
  citations: Citation[];
}

export const CitationList = memo(function CitationList({ citations }: CitationListProps) {
  return (
    <div className="mt-3 pt-3 border-t border-border/50">
      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
        <BookMarked className="w-4 h-4" />
        <span>Fontes do manual</span>
      </div>
      {citations.length > 0 ? (
        <div className="space-y-2">
          {citations.map((citation, index) => (
            <CitationCard 
              key={`${citation.source}-${citation.page}-${index}`} 
              citation={citation} 
              index={index}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          Sem citações disponíveis.
        </p>
      )}
    </div>
  );
});
