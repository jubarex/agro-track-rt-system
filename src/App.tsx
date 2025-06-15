import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardIndustry from "./pages/DashboardIndustry";
import DashboardResale from "./pages/DashboardResale";
import DashboardRT from "./pages/DashboardRT";
import DashboardFarmer from "./pages/DashboardFarmer";
import DashboardFiscal from "./pages/DashboardFiscal";
import NFePage from "./pages/NFePage";
import DashboardRastreabilidade from "./pages/DashboardRastreabilidade";
import { AuthProvider } from "./contexts/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Rotas dos dashboards */}
              <Route path="industry" element={<DashboardIndustry />} />
              <Route path="resale" element={<DashboardResale />} />
              <Route path="rt" element={<DashboardRT />} />
              <Route path="farmer" element={<DashboardFarmer />} />
              <Route path="fiscal" element={<DashboardFiscal />} />

              {/* Fase 3 e 4 */}
              <Route path="nfe" element={<NFePage />} />
              <Route path="rastreabilidade" element={<DashboardRastreabilidade />} />
              {/* Outras rotas do dashboard podem ser adicionadas aqui */}
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
