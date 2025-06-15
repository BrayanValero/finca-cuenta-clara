
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionForm from '@/components/TransactionForm';
import FileUpload from '@/components/FileUpload';
import TransactionTable from '@/components/TransactionTable';
// Eliminado: import MobileNav from '@/components/MobileNav';

const Transactions = () => {
  return (
    <>
      {/* Eliminado: <MobileNav /> */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transacciones</h2>
          <p className="text-muted-foreground">Gestiona los ingresos y gastos de tu finca</p>
        </div>

        <Tabs defaultValue="listado" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listado">Listado</TabsTrigger>
            <TabsTrigger value="agregar">Agregar Transacción</TabsTrigger>
            <TabsTrigger value="importar">Importar Excel</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listado" className="space-y-6">
            <TransactionTable />
          </TabsContent>
          
          <TabsContent value="agregar" className="space-y-6">
            <div className="max-w-2xl mx-auto bg-white dark:bg-farm-green p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Nueva Transacción</h3>
              <TransactionForm />
            </div>
          </TabsContent>
          
          <TabsContent value="importar" className="space-y-6">
            <div className="max-w-2xl mx-auto bg-white dark:bg-farm-green p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Importar desde Excel</h3>
              <FileUpload />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Transactions;
