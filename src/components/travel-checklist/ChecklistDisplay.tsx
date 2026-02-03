import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  AlertTriangle, 
  AlertOctagon, 
  Clock, 
  Sparkles, 
  ChevronDown,
  CheckCircle2,
  Circle,
  Star
} from 'lucide-react';
import { useState } from 'react';
import type { ChecklistResponse, ChecklistItem } from '@/types/travelChecklist';

interface ChecklistDisplayProps {
  data: ChecklistResponse;
}

const priorityConfig = {
  essential: { label: 'Essencial', variant: 'destructive' as const, icon: Star },
  recommended: { label: 'Recomendado', variant: 'default' as const, icon: CheckCircle2 },
  optional: { label: 'Opcional', variant: 'secondary' as const, icon: Circle },
};

function ChecklistItemRow({ item, checked, onToggle }: { 
  item: ChecklistItem; 
  checked: boolean;
  onToggle: () => void;
}) {
  const config = priorityConfig[item.priority];
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
      checked ? 'bg-muted/50' : 'hover:bg-muted/30'
    }`}>
      <Checkbox 
        checked={checked} 
        onCheckedChange={onToggle}
        className="mt-1"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-medium ${checked ? 'line-through text-muted-foreground' : ''}`}>
            {item.item}
          </span>
          <Badge variant={config.variant} className="text-xs">
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.estimatedTime}min
          </span>
        </div>
        {item.explanation && (
          <p className="text-sm text-muted-foreground mt-1">
            {item.explanation}
          </p>
        )}
      </div>
    </div>
  );
}

export function ChecklistDisplay({ data }: ChecklistDisplayProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (item: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  };

  // Group checklist by category
  const groupedChecklist = data.checklist.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const categories = Object.keys(groupedChecklist);
  const totalItems = data.checklist.length;
  const checkedCount = checkedItems.size;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* AI Attribution */}
      <Alert className="border-primary/30 bg-primary/5">
        <Sparkles className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Gerado por IA</AlertTitle>
        <AlertDescription>
          Este checklist foi gerado por inteligência artificial com base nas informações fornecidas.
          Tempo total estimado: {data.total_estimated_time} minutos.
        </AlertDescription>
      </Alert>

      {/* Red Flags */}
      {data.red_flags && data.red_flags.length > 0 && (
        <div className="space-y-3">
          {data.red_flags.map((flag, index) => (
            <Alert 
              key={index} 
              variant={flag.severity === 'critical' ? 'destructive' : 'default'}
              className={flag.severity === 'critical' ? '' : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'}
            >
              {flag.severity === 'critical' ? (
                <AlertOctagon className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
              <AlertTitle>{flag.issue}</AlertTitle>
              <AlertDescription>{flag.recommendation}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Questions to User */}
      {data.questions_to_user && data.questions_to_user.length > 0 && (
        <Alert>
          <AlertTitle>Precisamos de mais informações</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {data.questions_to_user.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{data.summary}</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium">
              {checkedCount}/{totalItems} ({progress}%)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Essential Items */}
      {data.essential_items && data.essential_items.length > 0 && (
        <Card className="border-primary/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Essencial Antes de Sair
            </CardTitle>
            <CardDescription>
              Verifique estes itens mesmo se tiver pouco tempo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {data.essential_items.map((item, index) => (
              <ChecklistItemRow
                key={`essential-${index}`}
                item={item}
                checked={checkedItems.has(`essential-${index}`)}
                onToggle={() => toggleItem(`essential-${index}`)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Full Checklist by Category */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Checklist Completo</CardTitle>
          <CardDescription>
            Organizado por categorias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => (
            <Collapsible key={category} defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <span className="font-medium">{category}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {groupedChecklist[category].length} itens
                  </Badge>
                  <ChevronDown className="w-4 h-4 transition-transform data-[state=open]:rotate-180" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 space-y-1">
                {groupedChecklist[category].map((item, index) => (
                  <ChecklistItemRow
                    key={`${category}-${index}`}
                    item={item}
                    checked={checkedItems.has(`${category}-${index}`)}
                    onToggle={() => toggleItem(`${category}-${index}`)}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
