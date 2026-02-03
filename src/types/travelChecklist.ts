export interface TravelInput {
  distance: number;
  routeType: 'highway' | 'urban' | 'mixed' | 'offroad';
  vehicleType: string;
  vehicleYear: number;
  vehicleBrand: string;
  vehicleModel: string;
  lastMaintenanceKm?: number;
  currentMileage?: number;
  warningLights?: string[];
  symptoms?: string[];
  availableTime: number;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  travelDuration?: number;
  passengers?: number;
  cargo?: 'light' | 'medium' | 'heavy';
}

export interface ChecklistItem {
  category: string;
  item: string;
  priority: 'essential' | 'recommended' | 'optional';
  explanation?: string;
  estimatedTime: number;
}

export interface RedFlag {
  issue: string;
  severity: 'warning' | 'critical';
  recommendation: string;
}

export interface ChecklistResponse {
  generated_by_ai: boolean;
  checklist: ChecklistItem[];
  essential_items: ChecklistItem[];
  red_flags: RedFlag[];
  questions_to_user?: string[];
  total_estimated_time: number;
  summary: string;
}

export const ROUTE_TYPES = [
  { value: 'highway', label: 'Rodovia' },
  { value: 'urban', label: 'Urbano' },
  { value: 'mixed', label: 'Misto' },
  { value: 'offroad', label: 'Estrada de terra' },
] as const;

export const USER_LEVELS = [
  { value: 'beginner', label: 'Iniciante', description: 'Pouco conhecimento técnico' },
  { value: 'intermediate', label: 'Intermediário', description: 'Conhecimento básico de mecânica' },
  { value: 'advanced', label: 'Avançado', description: 'Experiência técnica em veículos' },
] as const;

export const CARGO_TYPES = [
  { value: 'light', label: 'Leve' },
  { value: 'medium', label: 'Média' },
  { value: 'heavy', label: 'Pesada' },
] as const;

export const COMMON_WARNING_LIGHTS = [
  'Check Engine',
  'Óleo',
  'Bateria',
  'Freio',
  'ABS',
  'Airbag',
  'Temperatura',
  'Combustível baixo',
  'Pressão dos pneus',
  'Direção elétrica',
] as const;

export const COMMON_SYMPTOMS = [
  'Ruído ao frear',
  'Vibração no volante',
  'Dificuldade para ligar',
  'Consumo elevado',
  'Fumaça no escapamento',
  'Vazamento de fluido',
  'Direção pesada',
  'Ruído no motor',
  'Superaquecimento',
  'Marcha arranhando',
] as const;
