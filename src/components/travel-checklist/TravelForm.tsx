import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Car, Route, Clock, User, AlertTriangle, Package } from 'lucide-react';
import { 
  ROUTE_TYPES, 
  USER_LEVELS, 
  CARGO_TYPES, 
  COMMON_WARNING_LIGHTS, 
  COMMON_SYMPTOMS,
  type TravelInput 
} from '@/types/travelChecklist';

const formSchema = z.object({
  distance: z.coerce.number().min(1, 'Informe a distância'),
  routeType: z.enum(['highway', 'urban', 'mixed', 'offroad']),
  vehicleType: z.string().min(1, 'Informe o tipo do veículo'),
  vehicleYear: z.coerce.number().min(1950).max(new Date().getFullYear() + 1),
  vehicleBrand: z.string().min(1, 'Informe a marca'),
  vehicleModel: z.string().min(1, 'Informe o modelo'),
  lastMaintenanceKm: z.coerce.number().optional(),
  currentMileage: z.coerce.number().optional(),
  warningLights: z.array(z.string()).optional(),
  symptoms: z.array(z.string()).optional(),
  availableTime: z.coerce.number().min(5, 'Mínimo 5 minutos'),
  userLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  travelDuration: z.coerce.number().optional(),
  passengers: z.coerce.number().optional(),
  cargo: z.enum(['light', 'medium', 'heavy']).optional(),
});

interface TravelFormProps {
  onSubmit: (data: TravelInput) => void;
  isLoading: boolean;
}

export function TravelForm({ onSubmit, isLoading }: TravelFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<TravelInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      distance: undefined,
      routeType: 'highway',
      vehicleType: 'Carro',
      vehicleYear: new Date().getFullYear(),
      vehicleBrand: '',
      vehicleModel: '',
      availableTime: 30,
      userLevel: 'beginner',
      warningLights: [],
      symptoms: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Trip Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Route className="w-5 h-5 text-primary" />
              Dados da Viagem
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distância (km)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="routeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Trajeto</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROUTE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="travelDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração da viagem (dias)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passengers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de passageiros</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cargo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carga</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CARGO_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Car className="w-5 h-5 text-primary" />
              Dados do Veículo
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Carro">Carro</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Picape">Picape</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                      <SelectItem value="Moto">Moto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 2020" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleBrand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Volkswagen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Polo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentMileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quilometragem atual</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastMaintenanceKm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Última revisão (km)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 40000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* User Profile */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-primary" />
              Seu Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="userLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de conhecimento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {USER_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <span>{level.label}</span>
                          <span className="text-muted-foreground text-xs ml-2">
                            ({level.description})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Define a complexidade das explicações
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availableTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Tempo disponível (minutos)
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 30" {...field} />
                  </FormControl>
                  <FormDescription>
                    Prioriza itens que cabem no seu tempo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Warnings & Symptoms */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Alertas e Sintomas
            </CardTitle>
            <CardDescription>
              Informe se há algum problema aparente no veículo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="warningLights"
              render={() => (
                <FormItem>
                  <FormLabel>Luzes de advertência acesas</FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {COMMON_WARNING_LIGHTS.map((light) => (
                      <FormField
                        key={light}
                        control={form.control}
                        name="warningLights"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(light)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, light]);
                                  } else {
                                    field.onChange(current.filter((v) => v !== light));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {light}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symptoms"
              render={() => (
                <FormItem>
                  <FormLabel>Sintomas observados</FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {COMMON_SYMPTOMS.map((symptom) => (
                      <FormField
                        key={symptom}
                        control={form.control}
                        name="symptoms"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(symptom)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, symptom]);
                                  } else {
                                    field.onChange(current.filter((v) => v !== symptom));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {symptom}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? 'Gerando checklist...' : 'Gerar Checklist Inteligente'}
        </Button>
      </form>
    </Form>
  );
}
