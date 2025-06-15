
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Timeline from "@/components/Timeline";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Movimentacao = {
  data: string;
  evento: string;
  local: string;
  tipo: "Recebimento" | "Transporte" | "Venda" | "Processamento";
  responsavel: string;
  observacao?: string;
};

const MOCK_DATA = [
  {
    codigoLote: "LOTE-20240615-001",
    insumo: "Herbicida XZ100",
    fabricante: "Química Verde S.A.",
    dataFabricacao: "2024-05-10",
    dataValidade: "2026-05-10",
    movimentacoes: [
      {
        data: "2024-05-12",
        evento: "Recebido na Indústria",
        local: "Química Verde S.A.",
        tipo: "Recebimento",
        responsavel: "Funcionário: Maria Souza",
        observacao: "Lote inspecionado e aprovado.",
      },
      {
        data: "2024-05-16",
        evento: "Transporte para Revenda AgroMax",
        local: "AgroMax",
        tipo: "Transporte",
        responsavel: "Motorista: Pedro Dias",
        observacao: "Transportado sob temperatura controlada.",
      },
      {
        data: "2024-06-02",
        evento: "Venda para Produtor João Silva",
        local: "Fazenda Santa Luzia",
        tipo: "Venda",
        responsavel: "Representante: Ana Paula",
        observacao: "Entrega realizada com sucesso.",
      },
    ] as Movimentacao[],
  },
  {
    codigoLote: "LOTE-20240614-002",
    insumo: "Fungicida ZYX90",
    fabricante: "AgroLab S/A",
    dataFabricacao: "2024-04-28",
    dataValidade: "2026-04-28",
    movimentacoes: [
      {
        data: "2024-05-05",
        evento: "Recebido na Indústria",
        local: "AgroLab S/A",
        tipo: "Recebimento",
        responsavel: "Funcionário: Lucas Moraes",
        observacao: "Sem não conformidades.",
      },
      {
        data: "2024-05-08",
        evento: "Transporte para Revenda RuralMais",
        local: "RuralMais",
        tipo: "Transporte",
        responsavel: "Motorista: Fábio Gomes",
      },
    ] as Movimentacao[],
  },
];

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
  const [lotes] = useState(MOCK_DATA);

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
              <p><strong>Data de fabricação:</strong> {lote.dataFabricacao}</p>
              <p><strong>Validade:</strong> {lote.dataValidade}</p>
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
        <div className="text-muted-foreground mt-8">
          Nenhum lote encontrado para o filtro informado.
        </div>
      )}
    </div>
  );
};

export default DashboardRastreabilidade;
