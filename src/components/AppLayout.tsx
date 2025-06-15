
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, LogOut, LayoutDashboard, Table, Users, ShieldCheck, UploadCloud, Activity, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Notifications from "./Notifications";

// Troca o Timeline por Activity no menuByRole
const menuByRole = {
  industry: [
    {
      title: "Dashboard",
      to: "/dashboard/industry",
      icon: LayoutDashboard,
    },
    {
      title: "Lotes",
      to: "/dashboard/lotes",
      icon: Table,
    },
    {
      title: "Notas Fiscais",
      to: "/dashboard/nfe",
      icon: UploadCloud,
    },
    {
      title: "Rastreabilidade",
      to: "/dashboard/rastreabilidade",
      icon: Activity,
    },
  ],
  resale: [
    {
      title: "Dashboard",
      to: "/dashboard/resale",
      icon: LayoutDashboard,
    },
    {
      title: "Vendas",
      to: "/dashboard/vendas",
      icon: Table,
    },
    {
      title: "Notas Fiscais",
      to: "/dashboard/nfe",
      icon: UploadCloud,
    },
    {
      title: "Rastreabilidade",
      to: "/dashboard/rastreabilidade",
      icon: Activity,
    },
  ],
  rt: [
    {
      title: "Dashboard",
      to: "/dashboard/rt",
      icon: LayoutDashboard,
    },
    {
      title: "Propriedades",
      to: "/dashboard/propriedades",
      icon: Table,
    },
    {
      title: "ARTs",
      to: "/dashboard/arts",
      icon: FileText,
    },
  ],
  farmer: [
    {
      title: "Dashboard",
      to: "/dashboard/farmer",
      icon: LayoutDashboard,
    },
    {
      title: "Minhas Propriedades",
      to: "/dashboard/propriedades",
      icon: Table,
    },
    {
      title: "Rastreabilidade",
      to: "/dashboard/rastreabilidade",
      icon: Activity,
    },
  ],
  fiscal: [
    {
      title: "Dashboard",
      to: "/dashboard/fiscal",
      icon: LayoutDashboard,
    },
    {
      title: "Auditorias",
      to: "/dashboard/auditorias",
      icon: ShieldCheck,
    },
  ],
};

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role?.toLowerCase();

  // Redireciona para o dashboard do perfil correto ao acessar /dashboard
  if (location.pathname === "/dashboard" && role) {
    switch (role) {
      case "industry":
        navigate("/dashboard/industry", { replace: true });
        break;
      case "resale":
        navigate("/dashboard/resale", { replace: true });
        break;
      case "rt":
        navigate("/dashboard/rt", { replace: true });
        break;
      case "farmer":
        navigate("/dashboard/farmer", { replace: true });
        break;
      case "fiscal":
        navigate("/dashboard/fiscal", { replace: true });
        break;
      default:
        break;
    }
  }

  const menu = menuByRole[role] || [
    {
      title: "Dashboard",
      to: "/dashboard",
      icon: Home,
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarHeader className="p-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">AgroRT</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menu.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild>
                        <Link to={item.to}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <div className="w-full flex-1" />
            <Notifications />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <div className="flex-1 p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
