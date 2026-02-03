import { Link } from 'react-router-dom';
import { Car, MessageCircle, ArrowRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold">Manual Veicular</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 px-4">
        <div className="container max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Seu assistente inteligente para{' '}
            <span className="text-primary">cuidar do seu veículo</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tire dúvidas sobre manutenção, gere checklists personalizados antes de viagens 
            e mantenha seu carro sempre em dia com ajuda de inteligência artificial.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Chat Feature */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Chat com o Manual</CardTitle>
                <CardDescription>
                  Faça perguntas sobre manutenção, funcionamento e especificações 
                  do seu veículo e receba respostas com citações do manual.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/chat">
                  <Button className="w-full group-hover:bg-primary/90">
                    Iniciar conversa
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Travel Checklist Feature */}
            <Card className="group hover:shadow-lg transition-shadow border-primary/30">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl">Checklist de Pré-Viagem</CardTitle>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    Novo
                  </span>
                </div>
                <CardDescription>
                  Informe os dados da sua viagem e veículo para receber um checklist 
                  personalizado com verificações de segurança prioritárias.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/checklist-viagem">
                  <Button className="w-full group-hover:bg-primary/90">
                    Gerar checklist
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Inteligência Artificial</h3>
                <p className="text-sm text-muted-foreground">
                  Respostas personalizadas adaptadas ao seu nível de conhecimento
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Viaje com Segurança</h3>
                <p className="text-sm text-muted-foreground">
                  Alertas de riscos e recomendações profissionais antes de pegar a estrada
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Fácil de Usar</h3>
                <p className="text-sm text-muted-foreground">
                  Interface simples para iniciantes e opções avançadas para entusiastas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
