
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoanForm from '@/components/LoanForm';
import LoanTable from '@/components/LoanTable';
import { useLanguage } from '@/contexts/LanguageContext';

const Loans = () => {
  const { t } = useLanguage();

  return (
    <>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('loans')}</h2>
          <p className="text-muted-foreground">{t('manageLoans')}</p>
        </div>

        <Tabs defaultValue="listado" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listado">{t('loanListing')}</TabsTrigger>
            <TabsTrigger value="pendientes">{t('pendingLoans')}</TabsTrigger>
            <TabsTrigger value="agregar">{t('registerLoan')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listado" className="space-y-6">
            <LoanTable />
          </TabsContent>
          
          <TabsContent value="pendientes" className="space-y-6">
            <LoanTable statusFilter="pendiente" />
          </TabsContent>
          
          <TabsContent value="agregar" className="space-y-6">
            <div className="max-w-2xl mx-auto bg-white dark:bg-farm-green p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">{t('newLoan')}</h3>
              <LoanForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Loans;
