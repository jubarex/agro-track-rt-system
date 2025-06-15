
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FullART, MOCK_ARTS } from "@/types";
import { Search, CheckCircle, XCircle, FileText, User, Building, Package, Calendar, Beaker, Wheat } from "lucide-react";

const DashboardResale = () => {
  const [artNumber, setArtNumber] = useState("");
  const [validatedArt, setValidatedArt] = useState<FullART | null | undefined>(undefined); // undefined: initial, null: not found

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artNumber.trim()) {
      setValidatedArt(undefined);
      return;
    }
    const foundArt = MOCK_ARTS.find(art => art.artNumber === artNumber.trim());
    setValidatedArt(foundArt || null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Validação de Receituário (ART)</CardTitle>
          <CardDescription>
            Digite o número da ART para validar e visualizar os detalhes antes de efetuar a venda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleValidate} className="flex flex-col sm:flex-row items-center gap-2">
            <Input
              type="text"
              placeholder="Digite o número da ART..."
              value={artNumber}
              onChange={(e) => setArtNumber(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" /> Validar
            </Button>
          </form>
        </CardContent>
      </Card>

      {validatedArt === null && (
        <Card className="border-destructive">
          <CardHeader className="flex flex-row items-center gap-3">
            <XCircle className="h-6 w-6 text-destructive flex-shrink-0" />
            <div className="flex-grow">
              <CardTitle className="text-destructive">ART Inválida ou Não Encontrada</CardTitle>
              <CardDescription>
                O número de ART "{artNumber}" não foi encontrado. Verifique e tente novamente.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}

      {validatedArt && (
        <Card className="border-primary">
          <CardHeader className="flex flex-row items-center gap-3">
            <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
            <div className="flex-grow">
                <CardTitle className="text-primary">ART Válida!</CardTitle>
                <CardDescription>
                    Receituário verificado com sucesso. Prossiga com a venda.
                </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Nº da ART</p>
                  <p className="font-semibold">{validatedArt.artNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Responsável Técnico</p>
                  <p className="font-semibold">{validatedArt.responsible}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Propriedade</p>
                  <p className="font-semibold">{validatedArt.propertyName}</p>
                </div>
              </div>
               <div className="flex items-start gap-3">
                <Wheat className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Cultura</p>
                  <p className="font-semibold">{validatedArt.culture}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Produto Prescrito</p>
                  <p className="font-semibold">{validatedArt.applicationProduct}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Beaker className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Dose Autorizada</p>
                  <p className="font-semibold">{validatedArt.dose}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Data de Emissão</p>
                  <p className="font-semibold">{new Date(validatedArt.issueDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Data da Aplicação</p>
                  <p className="font-semibold">{new Date(validatedArt.applicationDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardResale;
