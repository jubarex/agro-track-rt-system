
import { useParams, Link } from 'react-router-dom';
import { MOCK_ARTS, MOCK_PROPERTIES, Property } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Home, FileText, Beaker, User, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RTProfilePage = () => {
    const { rtId } = useParams<{ rtId: string }>();
    const responsibleName = rtId ? decodeURIComponent(rtId) : '';

    const artsByRT = MOCK_ARTS.filter(art => art.responsible.toLowerCase() === responsibleName.toLowerCase());

    const propertiesWorkedOn = artsByRT.reduce((acc, art) => {
        if (!acc.find(p => p.id === art.propertyId)) {
            const property = MOCK_PROPERTIES.find(p => p.id === art.propertyId);
            if (property) {
                acc.push(property);
            }
        }
        return acc;
    }, [] as Property[]);

    const recommendedProducts = [...new Set(artsByRT.map(art => art.applicationProduct))];

    if (!responsibleName || artsByRT.length === 0) {
        return (
            <div className="text-center py-10">
                <h1 className="text-2xl font-bold">Responsável Técnico não encontrado</h1>
                <p className="text-muted-foreground">Não foi possível encontrar ARTs para "{responsibleName}".</p>
                <Link to="/dashboard/fiscal" className="text-primary underline mt-4 inline-block">Voltar para a busca</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-full">
                    <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{responsibleName}</h1>
                    <p className="text-muted-foreground">Perfil do Responsável Técnico</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Home className="w-5 h-5 text-primary" />
                        Propriedades Atendidas ({propertiesWorkedOn.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {propertiesWorkedOn.length > 0 ? (
                            propertiesWorkedOn.map(prop => (
                                <Button variant="secondary" asChild key={prop.id}>
                                    <Link to={`/dashboard/propriedades/${prop.id}`}>
                                        {prop.name}
                                    </Link>
                                </Button>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">Nenhuma propriedade encontrada.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Beaker className="w-5 h-5 text-primary" />
                        Insumos Recomendados ({recommendedProducts.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {recommendedProducts.map(product => (
                            <Badge key={product} variant="outline" className="text-sm font-medium">
                                {product}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        ARTs e Receituários Emitidos ({artsByRT.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nº ART</TableHead>
                                <TableHead>Propriedade</TableHead>
                                <TableHead>Produto Aplicado</TableHead>
                                <TableHead>Data Emissão</TableHead>
                                <TableHead className="text-right">Receituário</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {artsByRT.map(art => (
                                <TableRow key={art.id}>
                                    <TableCell className="font-medium">{art.artNumber}</TableCell>
                                    <TableCell>
                                        <Link to={`/dashboard/propriedades/${art.propertyId}`} className="hover:underline text-primary">
                                            {art.propertyName}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{art.applicationProduct}</TableCell>
                                    <TableCell>{new Date(art.issueDate).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        {art.fileUrl && (
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={art.fileUrl} target="_blank" rel="noopener noreferrer">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Visualizar
                                                </a>
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default RTProfilePage;
