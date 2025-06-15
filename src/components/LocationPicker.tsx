
import { useFormContext } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LocationPicker = () => {
  const form = useFormContext();
  const { toast } = useToast();

  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("latitude", position.coords.latitude, { shouldValidate: true });
        form.setValue("longitude", position.coords.longitude, { shouldValidate: true });
        toast({ title: "Sucesso", description: "Localização obtida com sucesso!" });
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível obter a localização. Verifique as permissões do seu navegador.",
        });
        console.error("Geolocation error:", error);
      }
    );
  };

  return (
    <div className="space-y-4 rounded-md border p-4">
        <div className="flex justify-between items-center">
            <h3 className="font-medium">Geolocalização</h3>
            <Button type="button" variant="outline" size="sm" onClick={handleGetCurrentLocation}>
                <MapPin className="w-4 h-4 mr-2" />
                Usar localização atual
            </Button>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input type="number" placeholder="-23.55052" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input type="number" placeholder="-46.633308" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default LocationPicker;
