
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Statistics from "./pages/Statistics";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Simula un estado de autenticación - Esto deberá conectarse a Supabase más adelante
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas con Layout de App */}
            <Route element={<AppLayout />}>
              <Route 
                path="/" 
                element={
                  isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/transacciones" 
                element={
                  isAuthenticated ? <Transactions /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/estadisticas" 
                element={
                  isAuthenticated ? <Statistics /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/informes" 
                element={
                  isAuthenticated ? <Reports /> : <Navigate to="/login" replace />
                } 
              />
            </Route>
            
            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
