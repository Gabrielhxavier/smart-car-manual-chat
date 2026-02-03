import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Car, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TravelForm } from '@/components/travel-checklist/TravelForm';
import { ChecklistDisplay } from '@/components/travel-checklist/ChecklistDisplay';
import { generateTravelChecklist } from '@/lib/travelChecklistApi';
import { useToast } from '@/hooks/use-toast';
import type { TravelInput, ChecklistResponse } from '@/types/travelChecklist';

export default function TravelChecklistPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistResponse | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: TravelInput) => {
    setIsLoading(true);
    try {
      const result = await generateTravelChecklist(data);
      setChecklist(result);
      toast({
        title: 'Checklist gerado com sucesso!',
        description: `${result.checklist.length} itens para verificar.`,
      });
    } catch (error) {
      console.error('Error generating checklist:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar checklist',
        description: error instanceof Error ? error.message : 'Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setChecklist(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Car className="w-6 h-6 text-primary" />
              <h1 className="text-lg font-semibold">Checklist de Pré-Viagem</h1>
            </div>
          </div>
          {checklist && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Nova consulta
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {!checklist ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Prepare-se para sua viagem</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Preencha as informações abaixo e nossa IA irá gerar um checklist 
                personalizado para garantir uma viagem segura.
              </p>
            </div>
            <TravelForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <ChecklistDisplay data={checklist} />
        )}
      </main>
    </div>
  );
}
