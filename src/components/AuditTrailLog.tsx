
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuditTrail } from "@/hooks/useAuditTrail";
import { ShieldCheck } from "lucide-react";

const AuditTrailLog = () => {
    const { logs } = useAuditTrail();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Log de Auditoria (Audit Trail)
                </CardTitle>
                <CardDescription>
                    Registro de ações importantes realizadas no sistema para fins de auditoria.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {logs.length > 0 ? (
                    <div className="border rounded-md max-h-[400px] overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuário</TableHead>
                                    <TableHead>Ação</TableHead>
                                    <TableHead>Data e Hora</TableHead>
                                    <TableHead className="text-right">Detalhes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map(log => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium">{log.user}</TableCell>
                                        <TableCell>{log.action}</TableCell>
                                        <TableCell>{log.timestamp.toLocaleString('pt-BR')}</TableCell>
                                        <TableCell className="text-right text-xs font-mono max-w-xs">
                                            <pre className="whitespace-pre-wrap break-all bg-muted p-2 rounded-md text-left">
                                                {JSON.stringify(log.details, null, 2)}
                                            </pre>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-4">
                        <ShieldCheck className="w-8 h-8" />
                        <p>Nenhuma ação registrada ainda.</p>
                        <p className="text-sm">Cadastre uma propriedade ou ART para ver os logs aqui.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AuditTrailLog;
