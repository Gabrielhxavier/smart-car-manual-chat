import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface TravelInput {
  distance: number; // km
  routeType: 'highway' | 'urban' | 'mixed' | 'offroad';
  vehicleType: string;
  vehicleYear: number;
  vehicleBrand: string;
  vehicleModel: string;
  lastMaintenanceKm?: number;
  currentMileage?: number;
  warningLights?: string[];
  symptoms?: string[];
  availableTime: number; // minutes
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  travelDuration?: number; // days
  passengers?: number;
  cargo?: 'light' | 'medium' | 'heavy';
}

interface ChecklistItem {
  category: string;
  item: string;
  priority: 'essential' | 'recommended' | 'optional';
  explanation?: string;
  estimatedTime: number; // minutes
}

interface ChecklistResponse {
  generated_by_ai: boolean;
  checklist: ChecklistItem[];
  essential_items: ChecklistItem[];
  red_flags: Array<{
    issue: string;
    severity: 'warning' | 'critical';
    recommendation: string;
  }>;
  questions_to_user?: string[];
  total_estimated_time: number;
  summary: string;
}

function buildSystemPrompt(input: TravelInput): string {
  const levelDescriptions = {
    beginner: 'Use linguagem simples, evite termos técnicos. Explique cada verificação de forma clara e acessível.',
    intermediate: 'Inclua explicações técnicas breves sobre o porquê de cada verificação. O usuário tem conhecimento básico.',
    advanced: 'Seja direto e técnico. O usuário entende terminologia automotiva.'
  };

  return `Você é um especialista em mecânica automotiva e segurança veicular. Sua função é gerar checklists personalizados de pré-viagem.

REGRAS IMPORTANTES:
1. Sempre retorne JSON válido no formato especificado
2. Adapte a linguagem ao nível do usuário: ${levelDescriptions[input.userLevel]}
3. Priorize itens com base no tempo disponível (${input.availableTime} minutos)
4. Se houver luzes de advertência ou sintomas relatados, SEMPRE inclua em red_flags
5. Considere o tipo de trajeto (${input.routeType}) nas recomendações
6. Para viagens longas (>500km), dê atenção extra a fluidos e pneus
7. Inclua documentos obrigatórios (CNH, CRLV, seguro)

FORMATO DE RESPOSTA (JSON):
{
  "checklist": [
    {
      "category": "string (ex: Pneus, Fluidos, Documentos, Iluminação, Segurança)",
      "item": "string (descrição da verificação)",
      "priority": "essential | recommended | optional",
      "explanation": "string (apenas se usuário não for advanced)",
      "estimatedTime": number (minutos)
    }
  ],
  "essential_items": [/* itens que DEVEM ser verificados antes de sair, mesmo com pouco tempo */],
  "red_flags": [
    {
      "issue": "string (problema identificado)",
      "severity": "warning | critical",
      "recommendation": "string (o que fazer)"
    }
  ],
  "questions_to_user": ["string (perguntas para refinar o checklist, se dados incompletos)"],
  "total_estimated_time": number (tempo total em minutos),
  "summary": "string (resumo breve da avaliação)"
}`;
}

function buildUserPrompt(input: TravelInput): string {
  let prompt = `Gere um checklist de pré-viagem personalizado com base nestas informações:

DADOS DA VIAGEM:
- Distância: ${input.distance} km
- Tipo de trajeto: ${input.routeType}
- Duração: ${input.travelDuration || 'Não informada'} dias
- Passageiros: ${input.passengers || 'Não informado'}
- Carga: ${input.cargo || 'Não informada'}

DADOS DO VEÍCULO:
- Tipo: ${input.vehicleType}
- Marca/Modelo: ${input.vehicleBrand} ${input.vehicleModel}
- Ano: ${input.vehicleYear}
- Quilometragem atual: ${input.currentMileage || 'Não informada'} km
- Última manutenção: ${input.lastMaintenanceKm || 'Não informada'} km`;

  if (input.warningLights && input.warningLights.length > 0) {
    prompt += `\n\nLUZES DE ADVERTÊNCIA ACESAS: ${input.warningLights.join(', ')}`;
  }

  if (input.symptoms && input.symptoms.length > 0) {
    prompt += `\n\nSINTOMAS RELATADOS: ${input.symptoms.join(', ')}`;
  }

  prompt += `\n\nPERFIL DO USUÁRIO:
- Nível de conhecimento: ${input.userLevel}
- Tempo disponível para verificações: ${input.availableTime} minutos`;

  prompt += `\n\nGere o checklist priorizando os itens essenciais que cabem no tempo disponível. Se houver riscos, destaque em red_flags.`;

  return prompt;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const input: TravelInput = await req.json();
    console.log('Received travel checklist request:', JSON.stringify(input));

    // Validate required fields
    if (!input.distance || !input.routeType || !input.vehicleType || !input.vehicleYear) {
      return new Response(
        JSON.stringify({ 
          error: 'Campos obrigatórios faltando',
          required: ['distance', 'routeType', 'vehicleType', 'vehicleYear', 'vehicleBrand', 'vehicleModel', 'availableTime', 'userLevel']
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = buildSystemPrompt(input);
    const userPrompt = buildUserPrompt(input);

    console.log('Calling Lovable AI Gateway with Gemini 3 Flash...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente em alguns minutos.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Adicione créditos ao seu workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('AI Gateway response received');

    const content = aiResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from AI');
    }

    // Parse JSON from response (handle markdown code blocks)
    let parsedContent: ChecklistResponse;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                       content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      parsedContent = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', content);
      throw new Error('Falha ao processar resposta da IA');
    }

    // Add the AI attribution flag
    const finalResponse: ChecklistResponse = {
      ...parsedContent,
      generated_by_ai: true,
    };

    console.log('Returning checklist with', finalResponse.checklist?.length || 0, 'items');

    return new Response(
      JSON.stringify(finalResponse),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in travel-checklist function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
