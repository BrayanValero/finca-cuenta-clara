
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionForm from '@/components/TransactionForm';
import FileUpload from '@/components/FileUpload';
import TransactionTable from '@/components/TransactionTable';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Transactions = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <div className="h-full flex flex-col">
      {/* Header - optimizado para móvil */}
      <div className="flex-shrink-0 px-2 sm:px-4 py-2 sm:py-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-theme-primary">
          {t('transactions')}
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
          {t('manageIncomeExpenses')}
        </p>
      </div>

      {/* Tabs Container - flex-1 para ocupar espacio restante */}
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs defaultValue="listado" className="flex-1 flex flex-col">
          {/* Tabs Navigation - sticky en móvil */}
          <div className="flex-shrink-0 sticky top-0 bg-background z-10 border-b px-2 sm:px-4">
            <div className="overflow-x-auto">
              <TabsList className={`${
                isMobile 
                  ? 'w-full grid grid-cols-3 h-12 gap-1 p-1' 
                  : 'inline-flex h-10 p-1'
              } bg-muted rounded-lg`}>
                <TabsTrigger 
                  value="listado" 
                  className={`${
                    isMobile 
                      ? 'text-xs px-2 py-2 min-h-[40px]' 
                      : 'text-sm px-4 py-2'
                  } flex-1 font-medium transition-all`}
                >
                  {isMobile ? 'Lista' : t('listing')}
                </TabsTrigger>
                <TabsTrigger 
                  value="agregar" 
                  className={`${
                    isMobile 
                      ? 'text-xs px-2 py-2 min-h-[40px]' 
                      : 'text-sm px-4 py-2'
                  } flex-1 font-medium transition-all`}
                >
                  {isMobile ? 'Nuevo' : t('addTransaction')}
                </TabsTrigger>
                <TabsTrigger 
                  value="importar" 
                  className={`${
                    isMobile 
                      ? 'text-xs px-2 py-2 min-h-[40px]' 
                      : 'text-sm px-4 py-2'
                  } flex-1 font-medium transition-all`}
                >
                  {isMobile ? 'Excel' : t('importExcel')}
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          {/* Tab Content - flex-1 con scroll */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="listado" className="h-full m-0 p-0">
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <div className="h-full bg-white dark:bg-card rounded-none sm:rounded-lg sm:m-4 sm:shadow-sm">
                    <div className="h-full p-2 sm:p-4">
                      <TransactionTable />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="agregar" className="h-full m-0 p-0">
              <div className="h-full overflow-y-auto">
                <div className="p-3 sm:p-6">
                  <div className="max-w-2xl mx-auto bg-white dark:bg-card rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-theme-primary">
                      {t('newTransaction')}
                    </h3>
                    <TransactionForm />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="importar" className="h-full m-0 p-0">
              <div className="h-full overflow-y-auto">
                <div className="p-3 sm:p-6">
                  <div className="max-w-2xl mx-auto bg-white dark:bg-card rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-theme-primary">
                      {t('importFromExcel')}
                    </h3>
                    <FileUpload />
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Transactions;
