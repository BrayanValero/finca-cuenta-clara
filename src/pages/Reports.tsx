
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/transactionService';
import { getAnimals, getAnimalTransactions } from '@/services/animalService';
import { useToast } from '@/hooks/use-toast';
import { generateReport, generateAnimalReport } from '@/utils/reportUtils';
import ReportPreview from '@/components/ReportPreview';
import QuickReportsTab from '@/components/reports/QuickReportsTab';
import CustomReportTab from '@/components/reports/CustomReportTab';


const Reports = () => {
  const { toast } = useToast();
  
  const [activeReport, setActiveReport] = useState<{
    title: string;
    type: 'all' | 'incomes' | 'expenses' | 'descriptions' | 'animals';
    dateRange?: { start?: Date; end?: Date };
  } | null>(null);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions
  });
  
  const { data: animals = [] } = useQuery({
    queryKey: ['animals'],
    queryFn: getAnimals
  });
  
  const { data: animalTransactions = [] } = useQuery({
    queryKey: ['animalTransactions'],
    queryFn: () => getAnimalTransactions()
  });

  const handleGenerateQuickReport = (type: string, format: 'pdf' | 'preview' = 'pdf') => {
    if (type === 'animals') {
      if (animals.length === 0) {
        toast({
          title: "Sin datos",
          description: "No hay animales disponibles para generar el informe.",
          variant: "destructive"
        });
        return;
      }
      
      const title = 'Informe de Animales';
      setActiveReport({
        title,
        type: 'animals',
        dateRange: undefined
      });
      
      if (format !== 'preview') {
        generateAnimalReport({
          animals,
          animalTransactions,
          title,
          format
        });
        
        toast({
          title: "Informe generado",
          description: `${title} generado con éxito en formato PDF.`
        });
      } else {
        const previewTab = document.querySelector('[value="preview"]') as HTMLButtonElement;
        if (previewTab) {
          previewTab.click();
        }
      }
      return;
    }
    
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
          
          {activeReport && activeReport.type !== 'animals' && (
            <TabsContent value="preview" className="space-y-6">
              <ReportPreview 
                transactions={transactions}
                title={activeReport.title}
                dateRange={activeReport.dateRange}
                type={activeReport.type}
              />
            </TabsContent>
          )}
          
          {activeReport && activeReport.type === 'animals' && (
            <TabsContent value="preview" className="space-y-6">
              <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-6">
                <h3 className="text-2xl font-bold mb-4">{activeReport.title}</h3>
                <p className="text-muted-foreground mb-6">
                  Vista previa del informe de animales con {animals.length} animales y {animalTransactions.length} transacciones.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Animales</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{animals.length}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Transacciones</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{animalTransactions.length}</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Balance Total</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(
                        animalTransactions.filter(t => t.type === 'ingreso').reduce((sum, t) => sum + Number(t.amount), 0) -
                        animalTransactions.filter(t => t.type === 'gasto').reduce((sum, t) => sum + Number(t.amount), 0)
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Haz clic en "Generar PDF" en la pestaña de Informes Rápidos para descargar el informe completo.
                </p>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default Reports;
