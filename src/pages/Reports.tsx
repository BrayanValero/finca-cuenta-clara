
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MobileNav from '@/components/MobileNav';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/transactionService';
import { useToast } from '@/components/ui/use-toast';
import { generateReport } from '@/utils/reportUtils';
import ReportPreview from '@/components/ReportPreview';
import QuickReportsTab from '@/components/reports/QuickReportsTab';
import CustomReportTab from '@/components/reports/CustomReportTab';

const Reports = () => {
  const { toast } = useToast();
  const [activeReport, setActiveReport] = useState<{
    title: string;
    type: 'all' | 'incomes' | 'expenses' | 'categories';
    dateRange?: { start?: Date; end?: Date };
  } | null>(null);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions
  });

  const handleGenerateQuickReport = (type: string, format: 'pdf' | 'preview' = 'pdf') => {
    if (transactions.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay transacciones disponibles para generar el informe.",
        variant: "destructive"
      });
      return;
    }
    
    let title = '';
    let reportType: 'all' | 'incomes' | 'expenses' | 'categories' = 'all';
    let dateRange: { start?: Date; end?: Date } | undefined = undefined;
    
    // Define report parameters based on type
    switch (type) {
      case 'monthly':
        title = 'Informe Mensual';
        // Get current month's start and end dates
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        dateRange = { start, end };
        break;
        
      case 'annual':
        title = 'Balance Anual';
        // Get current year's start and end dates
        const currentYear = new Date().getFullYear();
        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31);
        dateRange = { start: yearStart, end: yearEnd };
        break;
        
      case 'categories':
        title = 'Análisis de Categorías';
        reportType = 'categories';
        break;
    }
    
    setActiveReport({
      title,
      type: reportType,
      dateRange
    });
    
    if (format !== 'preview') {
      generateReport({
        transactions,
        title,
        dateRange,
        type: reportType,
        format
      });
      
      toast({
        title: "Informe generado",
        description: `${title} generado con éxito en formato PDF.`
      });
    } else {
      // For preview, just switch to the preview tab
      const previewTab = document.querySelector('[value="preview"]') as HTMLButtonElement;
      if (previewTab) {
        previewTab.click();
      }
    }
  };

  return (
    <>
      <MobileNav />
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Informes</h2>
          <p className="text-muted-foreground">Genera informes y análisis de tus finanzas en H-V Farm</p>
        </div>

        <Tabs defaultValue="rapidos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rapidos">Informes Rápidos</TabsTrigger>
            <TabsTrigger value="personalizado">Informe Personalizado</TabsTrigger>
            {activeReport && <TabsTrigger value="preview">Vista Previa</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="rapidos" className="space-y-6">
            <QuickReportsTab onGenerateReport={handleGenerateQuickReport} />
          </TabsContent>
          
          <TabsContent value="personalizado" className="space-y-6">
            <CustomReportTab 
              transactions={transactions} 
              setActiveReport={setActiveReport} 
            />
          </TabsContent>
          
          {activeReport && (
            <TabsContent value="preview" className="space-y-6">
              <ReportPreview 
                transactions={transactions}
                title={activeReport.title}
                dateRange={activeReport.dateRange}
                type={activeReport.type}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default Reports;
