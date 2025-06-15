
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lote, loteSchema, MOCK_LOTES } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Timeline from "@/components/Timeline";
import { toast } from "sonner";
import { PlusCircle, Eye } from "lucide-react";

const formSchema = loteSchema.omit({ id: true, codigoLote: true, fabricante: true });

const DashboardIndustry = () => {
  const [lotes, setLotes] = useState<Lote[]>(MOCK_LOTES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingLot, setViewingLot] = useState<Lote | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insumo: "",
      composition: "",
      dataFabricacao: "",
      dataValidade: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newLot: Lote = {
      id: `lote-${Date.now()}`,
      codigoLote: `LOTE-IND-${new Date().getFullYear()}-${String(
        lotes.length + 1
      ).padStart(3, "0")}`,
      fabricante: "AgroQuímica S.A.", // Fabricante fixo para este exemplo
      ...values,
      movimentacoes: [
        {
          data: values.dataFabricacao,
          evento: "Lote produzido",
          local: "AgroQuímica S.A.",
          tipo: "Fabricação",
          responsavel: "Sistema",
        },
      ],
    };

    setLotes((prevLotes) => [newLot, ...prevLotes]);
    toast.success("Lote registrado com sucesso!", {
      description: `O lote ${newLot.codigoLote} foi adicionado.`,
    });
    form.reset();
    setIsFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registro de Lotes de Insumos</CardTitle>
          <CardDescription>
            Cadastre novos lotes produzidos e consulte o histórico de rastreabilidade.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={() => setIsFormOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Registrar Novo Lote
            </Button>
        </CardContent>
      </Card>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Registrar Novo Lote</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="insumo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insumo (Produto)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Herbicida Z-MAX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="composition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Composição</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Glifosato 50%" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dataFabricacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Fabricação</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dataValidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Validade</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">Salvar Lote</Button>
                </form>
            </Form>
        </DialogContent>
      </Dialog>


      <Card>
        <CardHeader>
          <CardTitle>Lotes Produzidos</CardTitle>
          <CardDescription>
            Visualize todos os lotes e seu histórico de movimentação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cód. Lote</TableHead>
                <TableHead>Insumo</TableHead>
                <TableHead>Data Fabricação</TableHead>
                <TableHead>Data Validade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lotes.map((lote) => (
                <TableRow key={lote.id}>
                  <TableCell className="font-medium">{lote.codigoLote}</TableCell>
                  <TableCell>{lote.insumo}</TableCell>
                  <TableCell>{new Date(lote.dataFabricacao).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(lote.dataValidade).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setViewingLot(lote)}>
                      <Eye className="mr-2 h-4 w-4" /> Ver Histórico
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={!!viewingLot} onOpenChange={(isOpen) => !isOpen && setViewingLot(null)}>
          <DialogContent className="max-w-3xl">
              <DialogHeader>
                  <DialogTitle>Rastreabilidade do Lote: {viewingLot?.codigoLote}</DialogTitle>
                  <p className="text-sm text-muted-foreground">{viewingLot?.insumo}</p>
              </DialogHeader>
              <div className="py-4">
                {viewingLot && <Timeline movimentacoes={viewingLot.movimentacoes} />}
              </div>
          </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardIndustry;
