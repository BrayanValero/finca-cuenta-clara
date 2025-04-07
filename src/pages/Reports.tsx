
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet, Download, PieChart, Eye } from 'lucide-react';
import ReportForm from '@/components/ReportForm';
import MobileNav from '@/components/MobileNav';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/transactionService';
import { useToast } from '@/components/ui/use-toast';
import { generateReport } from '@/utils/reportUtils';
import ReportPreview from '@/components/ReportPreview';

const ReportCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick 
}: { 
  title: string, 
  description: string, 
  icon: React.ElementType, 
  onClick: () => void 
}) => (
  <Card className="hover:border-farm-brown transition-colors">
    <CardHeader>
      <div className="flex items-center gap-3">
        <Icon className="h-8 w-8 text-farm-green dark:text-farm-beige" />
        <CardTitle>{title}</CardTitle>
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardFooter>
      <Button 
        onClick={onClick} 
        className="w-full mt-2 bg-farm-brown hover:bg-farm-lightbrown text-white"
      >
        <Download className="mr-2 h-4 w-4" />
        Generar
      </Button>
    </CardFooter>
  </Card>
);

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

  const handleGenerateQuickReport = (type: string, format: 'pdf' | 'excel' = 'excel') => {
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
    
    // Define report parameters based on type
    switch (type) {
      case 'monthly':
        title = 'Informe Mensual';
        // Get current month's start and end dates
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        setActiveReport({
          title,
          type: 'all',
          dateRange: { start, end }
        });
        
        if (format !== 'preview') {
          generateReport({
            transactions,
            title,
            dateRange: { start, end },
            type: 'all',
            format
          });
          
          toast({
            title: "Informe generado",
            description: `Informe mensual generado con éxito en formato ${format.toUpperCase()}.`
          });
        }
        break;
        
      case 'annual':
        title = 'Balance Anual';
        // Get current year's start and end dates
        const currentYear = new Date().getFullYear();
        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31);
        
        setActiveReport({
          title,
          type: 'all',
          dateRange: { start: yearStart, end: yearEnd }
        });
        
        if (format !== 'preview') {
          generateReport({
            transactions,
            title,
            dateRange: { start: yearStart, end: yearEnd },
            type: 'all',
            format
          });
          
          toast({
            title: "Informe generado",
            description: `Balance anual generado con éxito en formato ${format.toUpperCase()}.`
          });
        }
        break;
        
      case 'categories':
        title = 'Análisis de Categorías';
        reportType = 'categories';
        
        setActiveReport({
          title,
          type: 'categories'
        });
        
        if (format !== 'preview') {
          generateReport({
            transactions,
            title,
            type: 'categories',
            format
          });
          
          toast({
            title: "Informe generado",
            description: `Análisis de categorías generado con éxito en formato ${format.toUpperCase()}.`
          });
        }
        break;
    }
  };

  return (
    <>
      <MobileNav />
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Informes</h2>
          <p className="text-muted-foreground">Genera informes y análisis de tus finanzas</p>
        </div>

        <Tabs defaultValue="rapidos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rapidos">Informes Rápidos</TabsTrigger>
            <TabsTrigger value="personalizado">Informe Personalizado</TabsTrigger>
            {activeReport && <TabsTrigger value="preview">Vista Previa</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="rapidos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:border-farm-brown transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-farm-green dark:text-farm-beige" />
                    <CardTitle>Informe Mensual</CardTitle>
                  </div>
                  <CardDescription>Resumen de ingresos y gastos del mes actual.</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleGenerateQuickReport('monthly', 'preview')} 
                      variant="outline" 
                      className="flex-1"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Vista previa
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    onClick={() => handleGenerateQuickReport('monthly', 'excel')} 
                    variant="outline" 
                    className="flex-1"
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel
                  </Button>
                  <Button 
                    onClick={() => handleGenerateQuickReport('monthly', 'pdf')} 
                    className="flex-1 bg-farm-brown hover:bg-farm-lightbrown text-white"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="hover:border-farm-brown transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-farm-green dark:text-farm-beige" />
                    <CardTitle>Balance Anual</CardTitle>
                  </div>
                  <CardDescription>Estado financiero completo del año en curso.</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleGenerateQuickReport('annual', 'preview')} 
                      variant="outline" 
                      className="flex-1"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Vista previa
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    onClick={() => handleGenerateQuickReport('annual', 'excel')} 
                    variant="outline" 
                    className="flex-1"
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel
                  </Button>
                  <Button 
                    onClick={() => handleGenerateQuickReport('annual', 'pdf')} 
                    className="flex-1 bg-farm-brown hover:bg-farm-lightbrown text-white"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="hover:border-farm-brown transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <PieChart className="h-8 w-8 text-farm-green dark:text-farm-beige" />
                    <CardTitle>Análisis de Categorías</CardTitle>
                  </div>
                  <CardDescription>Distribución detallada por categorías.</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleGenerateQuickReport('categories', 'preview')} 
                      variant="outline" 
                      className="flex-1"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Vista previa
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    onClick={() => handleGenerateQuickReport('categories', 'excel')} 
                    variant="outline" 
                    className="flex-1"
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel
                  </Button>
                  <Button 
                    onClick={() => handleGenerateQuickReport('categories', 'pdf')} 
                    className="flex-1 bg-farm-brown hover:bg-farm-lightbrown text-white"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="personalizado" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generar Informe Personalizado</CardTitle>
                <CardDescription>
                  Configura y genera un informe con los parámetros que necesites.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReportForm transactions={transactions} setActiveReport={setActiveReport} />
              </CardContent>
            </Card>
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
