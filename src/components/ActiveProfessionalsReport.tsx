
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FullART, RegisteredRT } from "@/types";
import { Users } from "lucide-react";
import { useMemo } from "react";

type Props = {
    arts: FullART[];
    registeredRTs: RegisteredRT[];
};

const ActiveProfessionalsReport = ({ arts, registeredRTs }: Props) => {
    const analysis = useMemo(() => {
        const activeRTs = new Set(arts.map(art => art.responsible.toLowerCase()));
        
        const totalRegistered = registeredRTs.length;
        
        const activeProfessionals = registeredRTs.filter(rt => {
            const normalizedName = rt.name.toLowerCase();
            return activeRTs.has(`${normalizedName} (${rt.crea})`.toLowerCase()) || activeRTs.has(normalizedName);
        });
        const totalActive = activeProfessionals.length;

        const activityPercentage = totalRegistered > 0 ? (totalActive / totalRegistered) * 100 : 0;

        const byState = registeredRTs.reduce((acc, rt) => {
            if (!acc[rt.state]) {
                acc[rt.state] = { registered: 0, active: 0 };
            }
            acc[rt.state].registered++;
            const normalizedName = rt.name.toLowerCase();
            if (activeRTs.has(`${normalizedName} (${rt.crea})`.toLowerCase()) || activeRTs.has(normalizedName)) {
                acc[rt.state].active++;
            }
            return acc;
        }, {} as Record<string, { registered: number; active: number }>);

        return {
            totalRegistered,
            totalActive,
            activityPercentage,
            byState: Object.entries(byState).map(([state, data]) => ({ state, ...data }))
        };
    }, [arts, registeredRTs]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Análise de Profissionais Ativos (US016)
                </CardTitle>
                <CardDescription>
                    Percentual de profissionais cadastrados que emitiram ARTs, para identificar déficit de assistência técnica.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Atividade Geral</h3>
                        <span className="text-lg font-bold">{analysis.totalActive} / {analysis.totalRegistered}</span>
                    </div>
                    <Progress value={analysis.activityPercentage} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-1 text-right">{analysis.activityPercentage.toFixed(1)}% de profissionais ativos</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Atividade por Estado</h3>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Profissionais Ativos</TableHead>
                                    <TableHead>Total Cadastrado</TableHead>
                                    <TableHead className="text-right">Taxa de Atividade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analysis.byState.length > 0 ? (
                                    analysis.byState.map(item => (
                                        <TableRow key={item.state}>
                                            <TableCell className="font-medium">{item.state}</TableCell>
                                            <TableCell>{item.active}</TableCell>
                                            <TableCell>{item.registered}</TableCell>
                                            <TableCell className="text-right">
                                                {item.registered > 0 ? ((item.active / item.registered) * 100).toFixed(1) : '0.0'}%
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            Nenhum dado para exibir.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ActiveProfessionalsReport;
