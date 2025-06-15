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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { User } from "@/types";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Nome completo deve ter pelo menos 2 caracteres." }),
  role: z.enum(["industry", "resale", "rt", "farmer", "fiscal"], {
    errorMap: () => ({ message: "Por favor, selecione um tipo de conta." }),
  }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  creaNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === 'rt' && (!data.creaNumber || data.creaNumber.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'O número do CREA é obrigatório para Responsável Técnico.',
      path: ['creaNumber'],
    });
  }
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
      creaNumber: "",
    },
  });

  const role = form.watch('role');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    let creaValidated = false;

    if (values.role === 'rt') {
      console.log(`Simulando validação do CREA no backend: ${values.creaNumber}`);
      
      // Simulação da validação para fins de UI
      await new Promise(resolve => setTimeout(resolve, 1500));
      const isCreaValid = Math.random() > 0.2; // 80% de chance de ser válido

      if (!isCreaValid) {
        toast({
          title: "CREA Inválido (Simulado)",
          description: "Não foi possível validar seu número do CREA. Verifique e tente novamente.",
          variant: "destructive",
        });
        form.setError("creaNumber", { type: "manual", message: "Número do CREA inválido." });
        setLoading(false);
        return;
      }
      
      creaValidated = true;
      toast({
        title: "CREA Validado (Simulado)",
        description: "Seu número de CREA foi validado com sucesso!",
      });
    }

    // Usando localStorage para simular um banco de dados de usuários
    try {
      const usersJSON = localStorage.getItem('users_db');
      const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];

      const existingUser = users.find(u => u.email === values.email);
      if (existingUser) {
        toast({
          title: "Erro no Cadastro",
          description: "Este email já está cadastrado.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const newUser: User = {
        id: values.email,
        name: values.fullName,
        email: values.email,
        role: values.role,
        creaNumber: values.creaNumber,
        creaValidated: values.role === 'rt' ? creaValidated : undefined,
      };

      users.push(newUser);
      localStorage.setItem('users_db', JSON.stringify(users));

      toast({
        title: "Cadastro (Simulado) bem-sucedido!",
        description: "Redirecionando para a página de login...",
      });
      navigate("/login");

    } catch (error) {
      console.error("Failed to sign up:", error);
      toast({
        title: "Erro no Cadastro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
        setLoading(false);
    }
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
                        <SelectItem value="industry">Indústria</SelectItem>
                        <SelectItem value="resale">Revenda</SelectItem>
                        <SelectItem value="rt">Responsável Técnico</SelectItem>
                        <SelectItem value="farmer">Produtor Rural</SelectItem>
                        <SelectItem value="fiscal">Fiscal (CREA/MAPA)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {role === 'rt' && (
                <FormField
                  control={form.control}
                  name="creaNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do CREA</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: SP-12345678/D" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormDescription>
                          Será validado no momento do cadastro.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
