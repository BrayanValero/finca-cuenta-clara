
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoanForm from '@/components/LoanForm';
import LoanTable from '@/components/LoanTable';
import MobileNav from '@/components/MobileNav';

const Loans = () => {
  return (
    <>
      <MobileNav />
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Préstamos</h2>
          <p className="text-muted-foreground">Gestiona los préstamos recibidos y otorgados</p>
        </div>

        <Tabs defaultValue="listado" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listado">Listado de Préstamos</TabsTrigger>
            <TabsTrigger value="pendientes">Préstamos Pendientes</TabsTrigger>
            <TabsTrigger value="agregar">Registrar Préstamo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listado" className="space-y-6">
            <LoanTable />
          </TabsContent>
          
          <TabsContent value="pendientes" className="space-y-6">
            <LoanTable statusFilter="pendiente" />
          </TabsContent>
          
          <TabsContent value="agregar" className="space-y-6">
            <div className="max-w-2xl mx-auto bg-white dark:bg-farm-green p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Nuevo Préstamo</h3>
              <LoanForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Loans;
