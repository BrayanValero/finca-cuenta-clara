
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionForm from '@/components/TransactionForm';
import FileUpload from '@/components/FileUpload';
import TransactionTable from '@/components/TransactionTable';
import { useLanguage } from '@/contexts/LanguageContext';

const Transactions = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="px-1 sm:px-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{t('transactions')}</h2>
        <p className="text-muted-foreground text-sm sm:text-base">{t('manageIncomeExpenses')}</p>
      </div>

      <Tabs defaultValue="listado" className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="w-full grid grid-cols-3 sm:w-auto sm:flex">
            <TabsTrigger value="listado" className="text-xs sm:text-sm px-2 sm:px-4">{t('listing')}</TabsTrigger>
            <TabsTrigger value="agregar" className="text-xs sm:text-sm px-2 sm:px-4">{t('addTransaction')}</TabsTrigger>
            <TabsTrigger value="importar" className="text-xs sm:text-sm px-2 sm:px-4">{t('importExcel')}</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="listado" className="space-y-4 sm:space-y-6">
          <div className="mobile-table-container rounded-lg bg-white dark:bg-farm-green shadow-sm">
            <div className="p-2 sm:p-4">
              <div className="min-w-[640px] sm:min-w-[800px]">
                <TransactionTable />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="agregar" className="space-y-4 sm:space-y-6">
          <div className="w-full max-w-2xl mx-auto bg-white dark:bg-farm-green p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold mb-4">{t('newTransaction')}</h3>
            <TransactionForm />
          </div>
        </TabsContent>
        
        <TabsContent value="importar" className="space-y-4 sm:space-y-6">
          <div className="w-full max-w-2xl mx-auto bg-white dark:bg-farm-green p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold mb-4">{t('importFromExcel')}</h3>
            <FileUpload />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Transactions;
