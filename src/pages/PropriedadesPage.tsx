import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Application, MOCK_PROPERTIES, Property, Car, MOCK_ARTS, FullART } from "@/types";
import PropertySheet from "@/components/PropertySheet";
import { Download, MapPin, Tractor, Wheat, BookCheck, FileText, UserCheck, Eye } from "lucide-react";
import PropertyMap from "@/components/PropertyMap";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useParams, Link } from "react-router-dom";

type FullProperty = Property & { applications: Application[], car?: Car };

const PropertyReports = ({ property }: { property: FullProperty }) => {
  const exportToCSV = () => {
    const headers = ["Data", "Produto", "Dose", "Método", "Responsável", "Cultura"];
    const rows = property.applications.map(app =>
      [app.date, app.product, app.dose, app.method, app.responsible, app.culture].join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_aplicacoes_${property.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Relatórios da Propriedade</CardTitle>
            <CardDescription>Exporte os dados de aplicação de insumos.</CardDescription>
        </CardHeader>
        <CardContent>
             <Button onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Exportar Histórico (CSV)
            </Button>
        </CardContent>
    </Card>
  )
};


const ApplicationHistory = ({ applications }: { applications: Application[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Histórico de Aplicações de Insumos</CardTitle>
      <CardDescription>Veja todas as aplicações realizadas na propriedade.</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Dose</TableHead>
            <TableHead>Responsável</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length > 0 ? applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{app.date}</TableCell>
              <TableCell>{app.product}</TableCell>
              <TableCell>{app.dose}</TableCell>
              <TableCell>
                <Link to={`/dashboard/rt/${encodeURIComponent(app.responsible)}`} className="font-medium text-primary hover:underline">
                  {app.responsible}
                </Link>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">Nenhuma aplicação registrada.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const CarDetails = ({ car }: { car?: Car }) => {
    if (!car) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookCheck className="w-5 h-5 text-primary"/>
                        Cadastro Ambiental Rural (CAR)
                    </CardTitle>
                    <CardDescription>
                        Esta propriedade não possui um Cadastro Ambiental Rural (CAR) vinculado.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookCheck className="w-5 h-5 text-primary"/>
                    Cadastro Ambiental Rural (CAR)
                </CardTitle>
                <CardDescription>
                    Código do Imóvel: <span className="font-mono bg-muted p-1 rounded-md">{car.idImovel}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-semibold">{car.status}</span>
                </div>
                 <div className="flex flex-col">
                    <span className="text-muted-foreground">Condição</span>
                    <span className="font-semibold">{car.condicao ?? 'Não informado'}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-muted-foreground">Tipo de Imóvel</span>
                    <span className="font-semibold">{car.tipo}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-muted-foreground">Área (CAR)</span>
                    <span className="font-semibold">{car.area ? `${car.area} ha` : 'Não informado'}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-muted-foreground">Módulos Fiscais</span>
                    <span className="font-semibold">{car.modulosFiscais ?? 'Não informado'}</span>
                </div>
                 <div className="flex flex-col">
                    <span className="text-muted-foreground">Município/UF</span>
                    <span className="font-semibold">{car.idMunicipio} / {car.siglaUf}</span>
                </div>
                 <div className="flex flex-col">
                    <span className="text-muted-foreground">Data de Extração</span>
                    <span className="font-semibold">{car.dataExtracao ?? 'Não informado'}</span>
                </div>
                 <div className="flex flex-col">
                    <span className="text-muted-foreground">Última Atualização</span>
                    <span className="font-semibold">{car.dataAtualizacaoCar ?? 'Não informado'}</span>
                </div>
            </CardContent>
        </Card>
    )
}

const ArtAndPrescriptionHistory = ({ property }: { property: FullProperty }) => {
  const artsForProperty = MOCK_ARTS.filter(art => art.propertyId === property.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Histórico de Receituários (ARTs)
        </CardTitle>
        <CardDescription>
          Visualize todas as Anotações de Responsabilidade Técnica e receituários agronômicos gerados para esta propriedade.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº da ART</TableHead>
              <TableHead>Data de Emissão</TableHead>
              <TableHead>Responsável Técnico</TableHead>
              <TableHead>Produto Aplicado</TableHead>
              <TableHead className="text-right">Receituário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artsForProperty.length > 0 ? artsForProperty.map((art) => (
              <TableRow key={art.id}>
                <TableCell className="font-medium">{art.artNumber}</TableCell>
                <TableCell>{art.issueDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-muted-foreground" />
                    <Link to={`/dashboard/rt/${encodeURIComponent(art.responsible)}`} className="font-medium text-primary hover:underline">
                      {art.responsible}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>{art.applicationProduct}</TableCell>
                <TableCell className="text-right">
                  {art.fileUrl ? (
                    <Button variant="outline" size="sm" asChild>
                      <a href={art.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </a>
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">Não disponível</span>
                  )}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhum receituário (ART) encontrado para esta propriedade.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const PropriedadesPage = () => {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();
  const [properties, setProperties] = useState<FullProperty[]>(MOCK_PROPERTIES);
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState<FullProperty | null>(null);

  useEffect(() => {
    let propertyToSelect: FullProperty | null = null;
    if (propertyId) {
      propertyToSelect = properties.find(p => p.id === propertyId) || null;
    } else if (properties.length > 0) {
      propertyToSelect = properties[0];
    }
    setSelectedProperty(propertyToSelect);
  }, [propertyId, properties]);

  const handleSaveProperty = (property: Property) => {
    const newProperty: FullProperty = { ...property, applications: [] };
    setProperties(prev => [...prev, newProperty]);
    setSelectedProperty(newProperty);
    navigate(`/dashboard/propriedades/${newProperty.id}`);
  };

  const handleSelectProperty = (property: FullProperty) => {
    setSelectedProperty(property);
    navigate(`/dashboard/propriedades/${property.id}`);
  };

  const title = role === 'farmer' ? "Minhas Propriedades" : "Propriedades";
  const description = role === 'farmer'
    ? "Gerencie suas propriedades rurais e acompanhe o histórico."
    : "Gerencie as propriedades rurais sob sua responsabilidade e acompanhe o histórico.";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
        </div>
        <PropertySheet onSave={handleSaveProperty} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
            <h2 className="font-semibold">Lista de Propriedades</h2>
            {properties.map(prop => (
                <Card 
                    key={prop.id} 
                    className={`cursor-pointer transition-all ${selectedProperty?.id === prop.id ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'}`}
                    onClick={() => handleSelectProperty(prop)}
                >
                    <CardHeader>
                        <CardTitle>{prop.name}</CardTitle>
                        <CardDescription>{prop.address}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2"><Tractor className="w-4 h-4 text-muted-foreground"/> {prop.totalArea} ha</div>
                        <div className="flex items-center gap-2"><Wheat className="w-4 h-4 text-muted-foreground"/> {prop.mainCulture}</div>
                    </CardContent>
                </Card>
            ))}
             {properties.length === 0 && (
                <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                    <p>Nenhuma propriedade cadastrada.</p>
                    <p className="text-sm">Clique em "Adicionar Propriedade" para começar.</p>
                </div>
            )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedProperty ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Localização no Mapa</CardTitle>
                  <CardDescription>Visualização da localização geográfica da propriedade.</CardDescription>
                </CardHeader>
                <CardContent>
                  <PropertyMap 
                    latitude={selectedProperty.latitude} 
                    longitude={selectedProperty.longitude} 
                  />
                </CardContent>
              </Card>
              <CarDetails car={selectedProperty.car} />
              <ApplicationHistory applications={selectedProperty.applications} />
              <ArtAndPrescriptionHistory property={selectedProperty} />
              <PropertyReports property={selectedProperty} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
                <div className="text-center text-muted-foreground p-8">
                    <MapPin className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Nenhuma propriedade selecionada</h3>
                    <p>Selecione uma propriedade na lista para ver os detalhes.</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropriedadesPage;
