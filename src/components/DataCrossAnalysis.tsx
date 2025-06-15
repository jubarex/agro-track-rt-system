
import { FullART, Lote, Property, Car } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface DataCrossAnalysisProps {
    arts: FullART[];
    properties: (Property & { car?: Car })[];
    lotes: Lote[];
}

type AnalysisResult = {
    art: FullART;
    property?: Property & { car?: Car };
    lote?: Lote;
    checks: {
        propertyFound: boolean;
        carFound: boolean;
        carStatusOk: boolean;
        loteFound: boolean;
        nfFound: boolean;
    }
}

const DataCrossAnalysis = ({ arts, properties, lotes }: DataCrossAnalysisProps) => {

    const analysisResults: AnalysisResult[] = arts.map(art => {
        const property = properties.find(p => p.id === art.propertyId);
        const lote = lotes.find(l => l.codigoLote === art.lotNumber);

        const checks = {
            propertyFound: !!property,
            carFound: !!property?.car,
            carStatusOk: property?.car?.status === 'Ativo',
            loteFound: !!lote,
            nfFound: !!art.nfNumber,
        };

        return { art, property, lote, checks };
    });

    const renderCheck = (check: boolean, textOk: string, textFail: string) => {
        return check ? (
            <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>{textOk}</span>
            </div>
        ) : (
            <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span>{textFail}</span>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cruzamento de Dados (CAR x NF x Receituário)</CardTitle>
                <CardDescription>
                    Análise automática de conformidade para cada ART emitida.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ART</TableHead>
                                <TableHead>Propriedade</TableHead>
                                <TableHead>Análise de Conformidade</TableHead>
                                <TableHead>Status Geral</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analysisResults.map(result => {
                                const isCompliant = Object.values(result.checks).every(Boolean);
                                const hasWarning = !isCompliant && result.checks.propertyFound;

                                return (
                                    <TableRow key={result.art.id}>
                                        <TableCell className="font-medium">
                                            <p>{result.art.artNumber}</p>
                                            <p className="text-xs text-muted-foreground">{result.art.applicationProduct}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{result.property?.name || "Não encontrada"}</p>
                                            <p className="text-xs text-muted-foreground">{result.property?.ownerCpfCnpj}</p>
                                        </TableCell>
                                        <TableCell>
                                            <ul className="space-y-1 text-xs">
                                                <li>{renderCheck(result.checks.propertyFound, "Propriedade vinculada", "Propriedade não encontrada")}</li>
                                                <li>{renderCheck(result.checks.carFound, `CAR ...${result.property?.car?.idImovel.slice(-10)} encontrado`, "CAR não vinculado")}</li>
                                                <li>{renderCheck(result.checks.carStatusOk, `Status do CAR: ${result.property?.car?.status}`, `Status do CAR: ${result.property?.car?.status || 'N/A'}`)}</li>
                                                <li>{renderCheck(result.checks.loteFound, `Lote ${result.lote?.codigoLote} rastreado`, "Lote de produto não encontrado")}</li>
                                                <li>{renderCheck(result.checks.nfFound, `NF ${result.art.nfNumber} associada`, "Nota Fiscal não encontrada")}</li>
                                            </ul>
                                        </TableCell>
                                        <TableCell>
                                            {isCompliant ? (
                                                <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                    Conforme
                                                </Badge>
                                            ) : hasWarning ? (
                                                <Badge variant="destructive">
                                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                                    Inconforme
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Erro de Dados
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default DataCrossAnalysis;
