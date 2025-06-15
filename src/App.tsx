import React, { useState } from 'react';
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
import Loans from "./pages/Loans";
import ChartDetail from "./pages/ChartDetail";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Personal from "./pages/Personal";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// Import i18n config to initialize it
import './i18n/config';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Routes component with authentication check
const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      
      {/* Rutas protegidas con Layout de App */}
      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transacciones" element={<Transactions />} />
        <Route path="/estadisticas" element={<Statistics />} />
        <Route path="/informes" element={<Reports />} />
        <Route path="/prestamos" element={<Loans />} />
        <Route path="/detalle-distribuciones" element={<ChartDetail />} />
        <Route path="/personal" element={<Personal />} />
      </Route>
      
      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Create a new QueryClient instance within the component function
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <AppRoutes />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
