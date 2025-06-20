
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/transactionService';
import { useToast } from '@/components/ui/use-toast';
import { generateReport } from '@/utils/reportUtils';
import ReportPreview from '@/components/ReportPreview';
import QuickReportsTab from '@/components/reports/QuickReportsTab';
import CustomReportTab from '@/components/reports/CustomReportTab';
import { useLanguage } from '@/contexts/LanguageContext';

const Reports = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [activeReport, setActiveReport] = useState<{
    title: string;
    type: 'all' | 'incomes' | 'expenses' | 'descriptions';
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
    let reportType: 'all' | 'incomes' | 'expenses' | 'descriptions' = 'all';
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
        
      case 'descriptions':
        title = 'Análisis por Descripción';
        reportType = 'descriptions';
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
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('reports')}</h2>
          <p className="text-muted-foreground">{t('generateReports')}</p>
        </div>

        <Tabs defaultValue="rapidos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rapidos">{t('quickReports')}</TabsTrigger>
            <TabsTrigger value="personalizado">{t('customReport')}</TabsTrigger>
            {activeReport && <TabsTrigger value="preview">{t('preview')}</TabsTrigger>}
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
