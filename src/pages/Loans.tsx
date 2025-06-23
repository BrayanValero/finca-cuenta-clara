
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoanForm from '@/components/LoanForm';
import LoanTable from '@/components/LoanTable';
import { useLanguage } from '@/contexts/LanguageContext';

const Loans = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="px-1 sm:px-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{t('loans')}</h2>
        <p className="text-muted-foreground text-sm sm:text-base">{t('manageLoans')}</p>
      </div>

      <Tabs defaultValue="listado" className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="w-full grid grid-cols-3 sm:w-auto sm:flex">
            <TabsTrigger value="listado" className="text-xs sm:text-sm px-2 sm:px-4">{t('loanListing')}</TabsTrigger>
            <TabsTrigger value="pendientes" className="text-xs sm:text-sm px-2 sm:px-4">{t('pendingLoans')}</TabsTrigger>
            <TabsTrigger value="agregar" className="text-xs sm:text-sm px-2 sm:px-4">{t('registerLoan')}</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="listado" className="space-y-4 sm:space-y-6">
          <div className="mobile-table-container rounded-lg bg-white dark:bg-farm-green shadow-sm">
            <div className="p-2 sm:p-4">
              <div className="min-w-[640px] sm:min-w-[800px]">
                <LoanTable />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pendientes" className="space-y-4 sm:space-y-6">
          <div className="mobile-table-container rounded-lg bg-white dark:bg-farm-green shadow-sm">
            <div className="p-2 sm:p-4">
              <div className="min-w-[640px] sm:min-w-[800px]">
                <LoanTable statusFilter="pendiente" />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="agregar" className="space-y-4 sm:space-y-6">
          <div className="w-full max-w-2xl mx-auto bg-white dark:bg-farm-green p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold mb-4">{t('newLoan')}</h3>
            <LoanForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Loans;
