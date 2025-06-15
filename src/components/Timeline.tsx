
import { Timeline as TimelineIcon, Map, Clock } from "lucide-react";

type Movimentacao = {
  data: string;
  evento: string;
  local: string;
};

const Timeline = ({ movimentacoes }: { movimentacoes: Movimentacao[] }) => (
  <ol className="relative border-l-2 border-primary">
    {movimentacoes.map((mov, idx) => (
      <li key={idx} className="mb-8 ml-6">
        <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-background">
          <TimelineIcon className="w-5 h-5 text-background" />
        </span>
        <div className="flex items-center gap-2 text-sm mb-1">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{mov.data}</span>
        </div>
        <p className="text-base font-semibold">{mov.evento}</p>
        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
          <Map className="w-4 h-4" />
          <span>{mov.local}</span>
        </div>
      </li>
    ))}
  </ol>
);

export default Timeline;
