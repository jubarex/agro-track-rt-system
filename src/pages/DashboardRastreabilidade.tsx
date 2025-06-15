
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Timeline from "@/components/Timeline";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Lote, Movimentacao, MOCK_LOTES } from "@/types";

function exportMovimentacoesToCSV(movimentacoes: Movimentacao[], arquivo: string) {
  const headers = ["Data", "Evento", "Local", "Tipo", "Responsável", "Observação"];
  const rows = movimentacoes.map(m =>
    [m.data, m.evento, m.local, m.tipo, m.responsavel, m.observacao || ""].join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = arquivo;
  a.click();
  URL.revokeObjectURL(url);
}

const DashboardRastreabilidade = () => {
  const [search, setSearch] = useState("");
  const [lotes] = useState<Lote[]>(MOCK_LOTES);

  // Busca pelo código do lote
  const lote = lotes.find(l =>
    l.codigoLote.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard de Rastreabilidade</h1>
      
      {/* Filtro de lote */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-6">
        <Input
          placeholder="Buscar por código do lote..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
        {lote && (
          <Button
            type="button"
            variant="outline"
            className="flex gap-2"
            onClick={() =>
              exportMovimentacoesToCSV(
                lote.movimentacoes,
                `${lote.codigoLote}-historico.csv`
              )
            }
          >
            <Download className="w-4 h-4" />
            Exportar histórico
          </Button>
        )}
      </div>

      {lote ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informações do lote</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Código do lote:</strong> {lote.codigoLote}</p>
              <p><strong>Insumo:</strong> {lote.insumo}</p>
              <p><strong>Fabricante:</strong> {lote.fabricante}</p>
              <p><strong>Data de fabricação:</strong> {new Date(lote.dataFabricacao).toLocaleDateString()}</p>
              <p><strong>Validade:</strong> {new Date(lote.dataValidade).toLocaleDateString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Movimentações</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline movimentacoes={lote.movimentacoes} />
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-muted-foreground mt-8 text-center py-10">
          <p>Digite um código de lote para ver sua rastreabilidade.</p>
          <p className="text-sm">Ex: LOTE-HVZ-2405-001</p>
        </div>
      )}
    </div>
  );
};

export default DashboardRastreabilidade;
