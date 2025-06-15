
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FullART, MOCK_ARTS } from "@/types";
import { Search, CheckCircle, XCircle, FileText, User, Building, Package, Calendar, Beaker, Wheat, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";

const DashboardResale = () => {
  const [artsData, setArtsData] = useState<FullART[]>(MOCK_ARTS);
  const [artNumber, setArtNumber] = useState("");
  const [validatedArt, setValidatedArt] = useState<FullART | null | undefined>(undefined); // undefined: initial, null: not found
  const [lotNumber, setLotNumber] = useState("");
  const [nfNumber, setNfNumber] = useState("");

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artNumber.trim()) {
      setValidatedArt(undefined);
      return;
    }
    const foundArt = artsData.find(art => art.artNumber === artNumber.trim());
    setValidatedArt(foundArt || null);
    setLotNumber("");
    setNfNumber("");
  };

  const handleRegisterSale = () => {
    if (!validatedArt || !lotNumber.trim() || !nfNumber.trim()) {
      toast.error("Erro ao registrar", {
        description: "Por favor, preencha o número do lote e da NF-e.",
      });
      return;
    }

    const updatedArts = artsData.map(art => {
      if (art.id === validatedArt.id) {
        return { ...art, lotNumber: lotNumber.trim(), nfNumber: nfNumber.trim() };
      }
      return art;
    });

    setArtsData(updatedArts);
    setValidatedArt(prevArt => prevArt ? { ...prevArt, lotNumber: lotNumber.trim(), nfNumber: nfNumber.trim() } : null);

    toast.success("Venda registrada com sucesso!", {
      description: `A venda para a ART ${validatedArt.artNumber} foi vinculada.`,
    });

    setLotNumber("");
    setNfNumber("");
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
                    Receituário verificado com sucesso. Prossiga com o registro da venda.
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

            {/* Seção de Registro de Venda */}
            <div className="mt-6 pt-6 border-t">
              {validatedArt.lotNumber && validatedArt.nfNumber ? (
                  <div className="p-4 rounded-md bg-secondary">
                      <div className="flex items-center gap-3">
                          <ClipboardCheck className="h-6 w-6 text-primary flex-shrink-0" />
                          <div>
                              <p className="font-semibold text-primary">Venda Registrada</p>
                              <p className="text-sm text-muted-foreground">
                                  Lote: <span className="font-medium text-foreground">{validatedArt.lotNumber}</span>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                  NF-e: <span className="font-medium text-foreground">{validatedArt.nfNumber}</span>
                              </p>
                          </div>
                      </div>
                  </div>
              ) : (
                  <div>
                      <h4 className="text-lg font-semibold mb-2">Registrar Venda e Lote</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                          Vincule a venda ao lote do produto e à Nota Fiscal.
                      </p>
                      <div className="space-y-4">
                           <div className="space-y-2">
                               <Label htmlFor="lotNumber">Número do Lote</Label>
                               <Input 
                                  id="lotNumber" 
                                  placeholder="Ex: LOTE2025-XYZ" 
                                  value={lotNumber}
                                  onChange={(e) => setLotNumber(e.target.value)}
                               />
                           </div>
                           <div className="space-y-2">
                               <Label htmlFor="nfNumber">Número da NF-e</Label>
                               <Input 
                                  id="nfNumber" 
                                  placeholder="Ex: 987654" 
                                  value={nfNumber}
                                  onChange={(e) => setNfNumber(e.target.value)}
                               />
                           </div>
                           <Button onClick={handleRegisterSale} className="w-full sm:w-auto">
                              <ClipboardCheck className="mr-2 h-4 w-4" />
                              Registrar Venda
                           </Button>
                      </div>
                  </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardResale;
