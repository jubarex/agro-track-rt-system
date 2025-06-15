
import { Button } from "@/components/ui/button";
import { Tractor, Users, Factory, Store, UserCheck, ShieldCheck } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <a href="#" className="flex items-center justify-center">
          <Tractor className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold text-foreground">AgroRT</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost">Login</Button>
          <Button>Cadastre-se</Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground">
                    Sistema Nacional de Rastreabilidade Técnica de Insumos Agrícolas
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Acompanhe cada insumo desde a fabricação até a aplicação em campo, garantindo segurança e conformidade com a Anotação de Responsabilidade Técnica (ART).
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg">Comece Agora</Button>
                  <Button size="lg" variant="outline">Saiba Mais</Button>
                </div>
              </div>
              <img
                src="/placeholder.svg"
                width="550"
                height="550"
                alt="Herói"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-contain sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Features/User Types Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground font-medium">Nossos Perfis</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Uma plataforma para todo o ecossistema agrícola</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Conectamos todos os elos da cadeia produtiva, desde a indústria até o produtor rural, sob a supervisão de responsáveis técnicos qualificados.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <div className="grid gap-2 text-center p-4 rounded-lg hover:bg-secondary/50 transition-colors">
                <Factory className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold">Indústrias</h3>
                <p className="text-sm text-muted-foreground">Cadastre lotes e garanta a origem dos seus produtos.</p>
              </div>
              <div className="grid gap-2 text-center p-4 rounded-lg hover:bg-secondary/50 transition-colors">
                <Store className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold">Revendas</h3>
                <p className="text-sm text-muted-foreground">Gerencie vendas e distribuições de forma segura e rastreável.</p>
              </div>
              <div className="grid gap-2 text-center p-4 rounded-lg hover:bg-secondary/50 transition-colors">
                <UserCheck className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold">Responsáveis Técnicos</h3>
                <p className="text-sm text-muted-foreground">Emita receituários, registre aplicações e vincule sua ART.</p>
              </div>
              <div className="grid gap-2 text-center p-4 rounded-lg hover:bg-secondary/50 transition-colors">
                 <Users className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold">Produtores Rurais</h3>
                <p className="text-sm text-muted-foreground">Tenha acesso ao histórico completo de insumos da sua propriedade.</p>
              </div>
              <div className="grid gap-2 text-center p-4 rounded-lg hover:bg-secondary/50 transition-colors col-span-1 sm:col-span-2 lg:col-span-1 lg:col-start-2">
                <ShieldCheck className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold">Fiscais (CREA/MAPA)</h3>
                <p className="text-sm text-muted-foreground">Acesse dashboards de conformidade e rastreabilidade em tempo real.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2025 AgroRT. Todos os direitos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a href="#" className="text-xs hover:underline underline-offset-4">Termos de Serviço</a>
          <a href="#" className="text-xs hover:underline underline-offset-4">Política de Privacidade</a>
        </nav>
      </footer>
    </div>
  );
};

export default Index;
