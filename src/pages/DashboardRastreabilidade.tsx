
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Timeline from "@/components/Timeline";
import { useState } from "react";

const mockData = {
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
    },
    {
      data: "2024-05-16",
      evento: "Transporte para Revenda AgroMax",
      local: "AgroMax",
    },
    {
      data: "2024-06-02",
      evento: "Venda para Produtor João Silva",
      local: "Fazenda Santa Luzia",
    },
  ],
};

const DashboardRastreabilidade = () => {
  const [lote] = useState(mockData);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard de Rastreabilidade</h1>
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
    </div>
  );
};

export default DashboardRastreabilidade;
