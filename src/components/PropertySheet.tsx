
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema, Property } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import LocationPicker from "./LocationPicker";
import { PlusCircle } from "lucide-react";
import { useAuditTrail } from "@/hooks/useAuditTrail";

type PropertySheetProps = {
  onSave: (property: Property) => void;
};

const PropertySheet = ({ onSave }: PropertySheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { logAction } = useAuditTrail();

  const form = useForm<Property>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      ownerCpfCnpj: "",
      totalArea: 0,
      latitude: 0,
      longitude: 0,
      mainCulture: "",
      address: "",
    },
  });

  const onSubmit = (data: Property) => {
    const newProperty = { ...data, id: `prop-${Date.now()}` };
    onSave(newProperty);
    logAction("Criou Propriedade", { name: newProperty.name, owner: newProperty.ownerCpfCnpj });
    toast({ title: "Sucesso!", description: "Propriedade salva com sucesso." });
    form.reset();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Adicionar Propriedade
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-2xl w-full overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>Cadastrar Propriedade</SheetTitle>
              <SheetDescription>
                Preencha as informações abaixo para cadastrar uma nova propriedade rural.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Propriedade</FormLabel>
                    <FormControl><Input placeholder="Fazenda Santa Luzia" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownerCpfCnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF/CNPJ do Proprietário</FormLabel>
                    <FormControl><Input placeholder="000.000.000-00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl><Input placeholder="Zona Rural, n° 100..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área Total (ha)</FormLabel>
                      <FormControl><Input type="number" placeholder="150" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mainCulture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cultura Principal</FormLabel>
                      <FormControl><Input placeholder="Soja" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <LocationPicker />
            </div>
            <SheetFooter>
                <SheetClose asChild>
                    <Button variant="outline" type="button">Cancelar</Button>
                </SheetClose>
              <Button type="submit">Salvar</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default PropertySheet;
