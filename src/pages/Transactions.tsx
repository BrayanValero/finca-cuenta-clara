
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionForm from '@/components/TransactionForm';
import FileUpload from '@/components/FileUpload';
import TransactionTable from '@/components/TransactionTable';
import { useLanguage } from '@/contexts/LanguageContext';

const Transactions = () => {
  const { t } = useLanguage();

  return (
    <>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('transactions')}</h2>
          <p className="text-muted-foreground">{t('manageIncomeExpenses')}</p>
        </div>

        <Tabs defaultValue="listado" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listado">{t('listing')}</TabsTrigger>
            <TabsTrigger value="agregar">{t('addTransaction')}</TabsTrigger>
            <TabsTrigger value="importar">{t('importExcel')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listado" className="space-y-6">
            <TransactionTable />
          </TabsContent>
          
          <TabsContent value="agregar" className="space-y-6">
            <div className="max-w-2xl mx-auto bg-white dark:bg-farm-green p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">{t('newTransaction')}</h3>
              <TransactionForm />
            </div>
          </TabsContent>
          
          <TabsContent value="importar" className="space-y-6">
            <div className="max-w-2xl mx-auto bg-white dark:bg-farm-green p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">{t('importFromExcel')}</h3>
              <FileUpload />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Transactions;
