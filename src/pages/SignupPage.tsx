
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tractor } from 'lucide-react';

const SignupPage = () => {
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
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Nome Completo</Label>
              <Input id="full-name" placeholder="Seu nome" required />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="role">Tipo de Conta</Label>
                <Select>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione seu perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="industria">Indústria</SelectItem>
                    <SelectItem value="revenda">Revenda</SelectItem>
                    <SelectItem value="responsavel_tecnico">Responsável Técnico</SelectItem>
                    <SelectItem value="produtor_rural">Produtor Rural</SelectItem>
                    <SelectItem value="fiscal">Fiscal (CREA/MAPA)</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Criar Conta
            </Button>
          </div>
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
