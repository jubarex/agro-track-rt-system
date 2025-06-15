
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ART, MOCK_PROPERTIES, artSchema, Application } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface ARTSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (art: ART) => void;
}

const ARTSheet = ({ isOpen, onOpenChange, onSave }: ARTSheetProps) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const form = useForm<z.infer<typeof artSchema>>({
    resolver: zodResolver(artSchema),
    defaultValues: {
      artNumber: "",
      issueDate: "",
      propertyId: "",
      applicationId: "",
      fileUrl: "",
    },
  });

  const handlePropertyChange = (propertyId: string) => {
    form.setValue("propertyId", propertyId);
    form.setValue("applicationId", ""); // Reseta a aplicação quando a propriedade muda
    setSelectedPropertyId(propertyId);
    const property = MOCK_PROPERTIES.find(p => p.id === propertyId);
    setApplications(property?.applications || []);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Em um app real, o arquivo seria enviado para um storage e a URL seria salva
      form.setValue("fileUrl", `path/to/${file.name}`);
      toast.info(`Arquivo "${file.name}" selecionado.`);
    }
  };

  function onSubmit(values: z.infer<typeof artSchema>) {
    onSave(values);
    toast.success("ART salva com sucesso!");
    onOpenChange(false);
    form.reset();
    setFileName("");
    setSelectedPropertyId(null);
    setApplications([]);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Adicionar Nova ART</SheetTitle>
          <SheetDescription>
            Preencha os dados para registrar uma nova ART ou faça o upload do documento.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="artNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da ART</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 2024123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Emissão</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propriedade Associada</FormLabel>
                  <Select onValueChange={handlePropertyChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma propriedade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_PROPERTIES.map(prop => (
                        <SelectItem key={prop.id} value={prop.id}>
                          {prop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedPropertyId && (
              <FormField
                control={form.control}
                name="applicationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aplicação de Insumo Associada</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={applications.length === 0}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma aplicação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {applications.map(app => (
                          <SelectItem key={app.id} value={app.id}>
                            {`${app.product} - ${app.date}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {applications.length === 0 && <p className="text-sm text-muted-foreground mt-1">Nenhuma aplicação encontrada.</p>}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
             <FormItem>
                <FormLabel>Upload do Documento (PDF)</FormLabel>
                <FormControl>
                    <div className="relative">
                        <Input
                            id="file-upload"
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept=".pdf"
                            onChange={handleFileChange}
                        />
                        <Button asChild variant="outline" className="w-full justify-center">
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload className="mr-2" />
                                {fileName || "Selecionar arquivo"}
                            </label>
                        </Button>
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
            <SheetFooter className="mt-6">
                <SheetClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                </SheetClose>
                <Button type="submit">Salvar ART</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default ARTSheet;
