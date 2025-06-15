
import { Activity, Map, Clock, Users } from "lucide-react";
import { Movimentacao } from "@/types";

const corPorTipo: Record<Movimentacao['tipo'], string> = {
  Recebimento: "bg-green-500",
  Transporte: "bg-blue-500",
  Venda: "bg-orange-500",
  Processamento: "bg-purple-500",
  Fabricação: "bg-indigo-500",
  Aplicação: "bg-teal-500",
};

const Timeline = ({ movimentacoes }: { movimentacoes: Movimentacao[] }) => (
  <ol className="relative border-l-2 border-primary">
    {movimentacoes.map((mov, idx) => (
      <li key={idx} className="mb-8 ml-6">
        <span className={`absolute flex items-center justify-center w-8 h-8 ${corPorTipo[mov.tipo] || "bg-primary"} rounded-full -left-4 ring-4 ring-background`}>
          <Activity className="w-5 h-5 text-background" />
        </span>
        <div className="flex flex-wrap items-center gap-3 text-sm mb-1">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{new Date(mov.data).toLocaleDateString()}</span>
          <span className="inline-block bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground ml-2">{mov.tipo}</span>
        </div>
        <p className="text-base font-semibold">{mov.evento}</p>
        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
          <Map className="w-4 h-4" />
          <span>{mov.local}</span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{mov.responsavel}</span>
        </div>
        {mov.observacao && (
          <div className="mt-2 text-xs text-muted-foreground italic border-l-2 pl-3 border-muted">
            Observação: {mov.observacao}
          </div>
        )}
      </li>
    ))}
  </ol>
);

export default Timeline;
