
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ART, MOCK_PROPERTIES } from "@/types";
import ARTSheet from "@/components/ARTSheet"; 
import { FilePlus, Eye, Trash2 } from "lucide-react";

type FullArt = ART & { propertyName: string, applicationProduct: string, applicationDate: string };

const MOCK_ARTS: FullArt[] = [
    {
        id: "art-1",
        artNumber: "2024123456",
        issueDate: "2024-06-12",
        propertyId: "prop-1",
        applicationId: "app-1",
        propertyName: "Fazenda Santa Luzia",
        applicationProduct: "Herbicida Z-MAX",
        applicationDate: "2024-06-10"
    }
];

const ARTsPage = () => {
  const [arts, setArts] = useState<FullArt[]>(MOCK_ARTS);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSaveArt = (art: ART) => {
    const property = MOCK_PROPERTIES.find(p => p.id === art.propertyId);
    const application = property?.applications.find(a => a.id === art.applicationId);

    const newArt: FullArt = {
      ...art,
      id: `art-${Date.now()}`,
      propertyName: property?.name || 'N/A',
      applicationProduct: application?.product || 'N/A',
      applicationDate: application?.date || 'N/A',
    };
    setArts(prev => [...prev, newArt]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de ARTs</h1>
          <p className="text-muted-foreground">Crie, visualize e gerencie as Anotações de Responsabilidade Técnica.</p>
        </div>
        <Button onClick={() => setIsSheetOpen(true)}>
            <FilePlus />
            Adicionar ART
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ARTs Registradas</CardTitle>
          <CardDescription>Lista de todas as ARTs vinculadas às suas atividades.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº da ART</TableHead>
                <TableHead>Propriedade</TableHead>
                <TableHead>Aplicação (Produto)</TableHead>
                <TableHead>Data de Emissão</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {arts.length > 0 ? arts.map((art) => (
                <TableRow key={art.id}>
                  <TableCell className="font-medium">{art.artNumber}</TableCell>
                  <TableCell>{art.propertyName}</TableCell>
                  <TableCell>{`${art.applicationProduct} em ${art.applicationDate}`}</TableCell>
                  <TableCell>{art.issueDate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="Visualizar PDF">
                      <Eye />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Excluir ART">
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Nenhuma ART registrada.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ARTSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSave={handleSaveArt}
      />
    </div>
  );
};

export default ARTsPage;
