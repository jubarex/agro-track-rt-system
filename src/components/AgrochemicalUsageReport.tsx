
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FullART, Property } from "@/types";
import { FileText } from "lucide-react";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Props = {
    arts: FullART[];
    properties: (Property & { state?: string })[];
};

const AgrochemicalUsageReport = ({ arts, properties }: Props) => {
    const dataByCulture = useMemo(() => {
        const usage = arts.reduce((acc, art) => {
            const culture = art.culture || 'Não especificada';
            if (!acc[culture]) {
                acc[culture] = 0;
            }
            acc[culture]++;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(usage).map(([name, value]) => ({ name, 'Aplicações': value }));
    }, [arts]);

    const dataByState = useMemo(() => {
        const usage = arts.reduce((acc, art) => {
            const property = properties.find(p => p.id === art.propertyId);
            const state = property?.state || 'N/D';
            if (!acc[state]) {
                acc[state] = 0;
            }
            acc[state]++;
            return acc;
        }, {} as Record<string, number>);
        
        return Object.entries(usage).map(([name, value]) => ({ name, 'Aplicações': value }));
    }, [arts, properties]);


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Relatórios para Políticas Públicas (US017)
                </CardTitle>
                <CardDescription>
                    Análise de uso de agroquímicos por cultura e por estado para embasar políticas de incentivo.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Uso de Insumos por Cultura</h3>
                    {dataByCulture.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dataByCulture} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Aplicações" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-muted-foreground">Não há dados suficientes para gerar o relatório.</p>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Uso de Insumos por Estado</h3>
                    {dataByState.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dataByState} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false}/>
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Aplicações" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-muted-foreground">Não há dados suficientes para gerar o relatório.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default AgrochemicalUsageReport;
