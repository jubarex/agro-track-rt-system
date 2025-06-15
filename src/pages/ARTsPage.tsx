
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ART, MOCK_PROPERTIES, MOCK_ARTS, FullART } from "@/types";
import ARTSheet from "@/components/ARTSheet"; 
import { FilePlus, Eye, Trash2, UserCheck } from "lucide-react";

const ARTsPage = () => {
  const [arts, setArts] = useState<FullART[]>(MOCK_ARTS);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSaveArt = (art: ART) => {
    const property = MOCK_PROPERTIES.find(p => p.id === art.propertyId);
    const application = property?.applications.find(a => a.id === art.applicationId);

    const newArt: FullART = {
      ...art,
      id: `art-${Date.now()}`,
      propertyName: property?.name || 'N/A',
      applicationProduct: application?.product || 'N/A',
      applicationDate: application?.date || 'N/A',
      responsible: application?.responsible || 'N/A',
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
            <FilePlus className="w-4 h-4 mr-2" />
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
                <TableHead>Responsável Técnico</TableHead>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-muted-foreground" />
                      {art.responsible}
                    </div>
                  </TableCell>
                  <TableCell>{`${art.applicationProduct} em ${art.applicationDate}`}</TableCell>
                  <TableCell>{art.issueDate}</TableCell>
                  <TableCell className="text-right">
                    {art.fileUrl && (
                      <Button variant="ghost" size="icon" title="Visualizar PDF" asChild>
                        <a href={art.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Eye />
                        </a>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Excluir ART">
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Nenhuma ART registrada.</TableCell>
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
