
import { Link, useNavigate } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tractor } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Nome completo deve ter pelo menos 2 caracteres." }),
  role: z.enum(["industria", "revenda", "responsavel_tecnico", "produtor_rural", "fiscal"], {
    errorMap: () => ({ message: "Por favor, selecione um tipo de conta." }),
  }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

const SignupPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    console.log("Signup form submitted (Supabase integration is paused):", values);

    // A chamada ao Supabase está temporariamente desabilitada.
    // Para reativar, descomente o bloco a seguir e remova o código de simulação abaixo.
    /*
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
          role: values.role,
        },
      },
    });
    setLoading(false);

    if (error) {
      toast({
        title: "Erro no Cadastro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Cadastro Realizado com Sucesso!",
        description: "Enviamos um email de confirmação para você.",
      });
      navigate("/login");
    }
    */

    // Simulação de cadastro bem-sucedido para desenvolvimento da UI
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Cadastro (Simulado) bem-sucedido!",
        description: "Redirecionando para a página de login...",
      });
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/30 py-12">
      <Card className="mx-auto max-w-sm w-full">
         <CardHeader>
            <div className="flex justify-center mb-4">
             <Link to="/" className="flex items-center justify-center">
                <Tractor className="h-8 w-8 text-primary" />
                <span className="ml-2 text-2xl font-bold text-foreground">AgroRT</span>
             </Link>
            </div>
          <CardTitle className="text-2xl text-center">Cadastro</CardTitle>
          <CardDescription className="text-center">
            Crie sua conta para começar a usar o AgroRT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Conta</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="industria">Indústria</SelectItem>
                        <SelectItem value="revenda">Revenda</SelectItem>
                        <SelectItem value="responsavel_tecnico">Responsável Técnico</SelectItem>
                        <SelectItem value="produtor_rural">Produtor Rural</SelectItem>
                        <SelectItem value="fiscal">Fiscal (CREA/MAPA)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="nome@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link to="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
