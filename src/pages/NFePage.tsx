
import { useState } from "react";
import NFeUpload from "@/components/NFeUpload";
import { NFeData } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadCloud, FileText } from "lucide-react";

const NFePage = () => {
    const [nfes, setNfes] = useState<NFeData[]>([]);

    const handleAddNfe = (nfe: NFeData) => {
        // Evita adicionar duplicados pelo nome do arquivo
        if (!nfes.some(existingNfe => existingNfe.fileName === nfe.fileName)) {
            setNfes(prev => [nfe, ...prev]);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Gerenciamento de Notas Fiscais (NF-e)</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-primary" />
                        Upload de NF-e (XML)
                    </CardTitle>
                    <CardDescription>
                        Carregue os arquivos XML das notas fiscais para análise e cruzamento de dados.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <NFeUpload onNFeParsed={handleAddNfe} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>NF-es Carregadas</CardTitle>
                    <CardDescription>
                        Lista de notas fiscais eletrônicas importadas para o sistema.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {nfes.length > 0 ? (
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Arquivo</TableHead>
                                        <TableHead>Número</TableHead>
                                        <TableHead>Data Emissão</TableHead>
                                        <TableHead>Emitente</TableHead>
                                        <TableHead>Destinatário</TableHead>
                                        <TableHead className="text-right">Valor Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {nfes.map((nfe, index) => (
                                        <TableRow key={`${nfe.numero}-${index}`}>
                                            <TableCell className="font-medium">{nfe.fileName}</TableCell>
                                            <TableCell>{nfe.numero}</TableCell>
                                            <TableCell>{nfe.dataEmissao ? new Date(nfe.dataEmissao).toLocaleDateString() : '-'}</TableCell>
                                            <TableCell>{nfe.emitente}</TableCell>
                                            <TableCell>{nfe.destinatario}</TableCell>
                                            <TableCell className="text-right">R$ {nfe.valorTotal}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-4">
                            <FileText className="w-8 h-8" />
                            <p>Nenhuma NF-e foi carregada ainda.</p>
                            <p className="text-sm">Use o botão acima para começar a importar os arquivos XML.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default NFePage;
