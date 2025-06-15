import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import Timeline from "@/components/Timeline";
import DataCrossAnalysis from "@/components/DataCrossAnalysis";
import ApplicationsMap from "@/components/ApplicationsMap";
import { Lote, FullART, MOCK_LOTES, MOCK_ARTS, MOCK_PROPERTIES, Property, Application, Car } from "@/types";
import { Search, FileText } from "lucide-react";

const DashboardFiscal = () => {
  const [loteSearch, setLoteSearch] = useState("");
  const [rtSearch, setRtSearch] = useState("");

  const [lotes] = useState<Lote[]>(MOCK_LOTES);
  const [arts] = useState<FullART[]>(MOCK_ARTS);
  const [properties] = useState<(Property & { applications: Application[]; car?: Car | undefined; })[]>(MOCK_PROPERTIES);

  const foundLote = loteSearch.trim()
    ? lotes.find((l) =>
        l.codigoLote.toLowerCase().includes(loteSearch.trim().toLowerCase())
      )
    : null;

  const foundArts = rtSearch.trim()
    ? arts.filter((art) =>
        art.responsible.toLowerCase().includes(rtSearch.trim().toLowerCase())
      )
    : arts;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Painel de Fiscalização</h1>
      <p className="text-muted-foreground">
        Ferramentas para auditoria e conformidade de insumos agrícolas.
      </p>

      {/* US011: Rastreabilidade de Lote */}
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Rastreabilidade Completa (US011)</CardTitle>
          <CardDescription>
            Consulte a trajetória completa de um lote de insumo, desde a fabricação até a aplicação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4 max-w-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código do lote... (Ex: LOTE-HVZ-2405-001)"
              value={loteSearch}
              onChange={(e) => setLoteSearch(e.target.value)}
            />
          </div>
          {loteSearch.trim() && foundLote ? (
            <div className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Lote</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
                  <p><strong>Código:</strong> {foundLote.codigoLote}</p>
                  <p><strong>Insumo:</strong> {foundLote.insumo}</p>
                  <p><strong>Fabricante:</strong> {foundLote.fabricante}</p>
                  <p><strong>Fabricação:</strong> {new Date(foundLote.dataFabricacao).toLocaleDateString()}</p>
                  <p><strong>Validade:</strong> {new Date(foundLote.dataValidade).toLocaleDateString()}</p>
                </CardContent>
              </Card>
              <Card>
                 <CardHeader>
                  <CardTitle>Histórico de Movimentações</CardTitle>
                </CardHeader>
                <CardContent>
                  <Timeline movimentacoes={foundLote.movimentacoes} />
                </CardContent>
              </Card>
            </div>
          ) : loteSearch.trim() ? (
            <div className="text-muted-foreground mt-4 text-center py-6">
              <p>Nenhum lote encontrado com o código "{loteSearch}".</p>
            </div>
          ) : (
             <div className="text-muted-foreground mt-4 text-center py-6">
              <p>Digite um código de lote para iniciar a busca.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* US012: Consulta por RT */}
      <Card>
        <CardHeader>
          <CardTitle>Consulta por Responsável Técnico (US012)</CardTitle>
          <CardDescription>
            Consulte ARTs e receituários emitidos por um profissional específico.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4 max-w-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome do Responsável Técnico..."
              value={rtSearch}
              onChange={(e) => setRtSearch(e.target.value)}
            />
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº ART</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Produto Aplicado</TableHead>
                  <TableHead>Propriedade</TableHead>
                  <TableHead>Data Emissão</TableHead>
                  <TableHead className="text-right">Arquivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foundArts.length > 0 ? (
                  foundArts.map((art) => (
                    <TableRow key={art.id}>
                      <TableCell className="font-medium">{art.artNumber}</TableCell>
                      <TableCell>{art.responsible}</TableCell>
                      <TableCell>{art.applicationProduct}</TableCell>
                      <TableCell>{art.propertyName}</TableCell>
                      <TableCell>{new Date(art.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {art.fileUrl && (
                          <a href={art.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:underline">
                            <FileText className="mr-1 h-4 w-4" />
                            Ver
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* US013: Cruzamento de Dados */}
      <DataCrossAnalysis arts={arts} properties={properties} lotes={lotes} />
      
      {/* US014: Mapa de Aplicações */}
      <Card>
         <CardHeader>
          <CardTitle>Mapa Interativo de Aplicações por Região (US014)</CardTitle>
          <CardDescription>
            Visualize as propriedades com aplicações de insumos registradas no mapa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationsMap properties={properties} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardFiscal;
