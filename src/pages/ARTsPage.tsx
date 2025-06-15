
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ART, MOCK_PROPERTIES, MOCK_ARTS, FullART } from "@/types";
import ARTSheet from "@/components/ARTSheet"; 
import { FilePlus, Eye, Trash2, UserCheck, Download, Wheat } from "lucide-react";
import { Input } from "@/components/ui/input";

const ARTsPage = () => {
  const [arts, setArts] = useState<FullART[]>(MOCK_ARTS);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
      culture: application?.culture || 'N/A',
    };
    setArts(prev => [...prev, newArt]);
  };

  const filteredArts = arts.filter(art => {
    const search = searchTerm.toLowerCase();
    return (
      art.artNumber.toLowerCase().includes(search) ||
      art.propertyName.toLowerCase().includes(search) ||
      art.responsible.toLowerCase().includes(search) ||
      art.applicationProduct.toLowerCase().includes(search) ||
      art.culture.toLowerCase().includes(search)
    );
  });

  const handleExportCSV = () => {
    const headers = ["Nº da ART", "Propriedade", "Responsável Técnico", "Cultura", "Produto Aplicado", "Data de Emissão", "Data da Aplicação"];
    
    const escapeCsvCell = (cell: string | number | null | undefined) => {
      if (cell === null || cell === undefined) {
        return '';
      }
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    };

    const rows = filteredArts.map(art =>
      [
        art.artNumber,
        art.propertyName,
        art.responsible,
        art.culture,
        art.applicationProduct,
        art.issueDate,
        art.applicationDate,
      ].map(escapeCsvCell).join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "historico_arts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de ARTs</h1>
          <p className="text-muted-foreground">Crie, visualize e gerencie as Anotações de Responsabilidade Técnica.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={handleExportCSV} variant="outline" disabled={filteredArts.length === 0}>
                <Download />
                Exportar (CSV)
            </Button>
            <Button onClick={() => setIsSheetOpen(true)}>
                <FilePlus/>
                Adicionar ART
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ARTs Registradas</CardTitle>
          <CardDescription>Lista de todas as ARTs vinculadas às suas atividades.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Filtrar por nº ART, propriedade, responsável, produto ou cultura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº da ART</TableHead>
                <TableHead>Propriedade</TableHead>
                <TableHead>Responsável Técnico</TableHead>
                <TableHead>Cultura</TableHead>
                <TableHead>Aplicação (Produto)</TableHead>
                <TableHead>Data de Emissão</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArts.length > 0 ? filteredArts.map((art) => (
                <TableRow key={art.id}>
                  <TableCell className="font-medium">{art.artNumber}</TableCell>
                  <TableCell>{art.propertyName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserCheck />
                      {art.responsible}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Wheat />
                      {art.culture}
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
                  <TableCell colSpan={7} className="text-center h-24">Nenhuma ART encontrada.</TableCell>
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
