
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tractor } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(1, { message: "Senha é obrigatória." }),
});

const LoginPage = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    // Simulação de login buscando dados do localStorage
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula latência de rede

      const usersJSON = localStorage.getItem('users_db');
      const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];

      const foundUser = users.find(u => u.email === values.email);
      // A checagem de senha é ignorada por ser uma simulação

      if (foundUser) {
        toast({
          title: "Login bem-sucedido!",
          description: "Redirecionando para a página principal...",
        });
        login({ 
          email: foundUser.email,
          fullName: foundUser.name, 
          role: foundUser.role,
          creaNumber: foundUser.creaNumber,
          creaValidated: foundUser.creaValidated,
        });
      } else {
        toast({
          title: "Erro de Login",
          description: "Email ou senha inválidos.",
          variant: "destructive",
        });
      }
    } catch (error) {
        console.error("Failed to log in:", error);
        toast({
            title: "Erro de Login",
            description: "Ocorreu um erro inesperado.",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/30">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <div className="flex justify-center mb-4">
             <Link to="/" className="flex items-center justify-center">
                <Tractor className="h-8 w-8 text-primary" />
                <span className="ml-2 text-2xl font-bold text-foreground">AgroRT</span>
             </Link>
          </div>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Entre com seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
                    <div className="flex items-center">
                      <FormLabel>Senha</FormLabel>
                      <Link to="#" className="ml-auto inline-block text-sm underline">
                        Esqueceu sua senha?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Login"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link to="/signup" className="underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
