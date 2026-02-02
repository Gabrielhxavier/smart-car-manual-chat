import { memo } from 'react';
import { FileText, BookOpen } from 'lucide-react';
import type { Citation } from '@/types/chat';

interface CitationCardProps {
  citation: Citation;
  index: number;
}

export const CitationCard = memo(function CitationCard({ 
  citation, 
  index 
}: CitationCardProps) {
  return (
    <div className="bg-citation border border-citation-border rounded-lg p-3 space-y-2">
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-xs font-semibold text-accent-foreground">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate font-medium">{citation.source}</span>
          </div>
          {(citation.page || citation.section) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <BookOpen className="w-3 h-3 flex-shrink-0" />
              <span>
                {citation.page && `Página ${citation.page}`}
                {citation.page && citation.section && ' • '}
                {citation.section && `Seção: ${citation.section}`}
              </span>
            </div>
          )}
        </div>
      </div>
      <blockquote className="pl-3 border-l-2 border-citation-accent text-sm text-foreground/80 italic">
        "{citation.excerpt}"
      </blockquote>
    </div>
  );
});
