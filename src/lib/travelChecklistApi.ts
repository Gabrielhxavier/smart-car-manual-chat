import type { TravelInput, ChecklistResponse } from '@/types/travelChecklist';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export async function generateTravelChecklist(input: TravelInput): Promise<ChecklistResponse> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/travel-checklist`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(input),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 429) {
      throw new Error('Limite de requisições excedido. Tente novamente em alguns minutos.');
    }
    if (response.status === 402) {
      throw new Error('Créditos insuficientes para gerar o checklist.');
    }
    
    throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
  }

  return response.json();
}
