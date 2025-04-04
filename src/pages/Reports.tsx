
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet, Download, PieChart } from 'lucide-react';
import ReportForm from '@/components/ReportForm';
import MobileNav from '@/components/MobileNav';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/transactionService';
import { useToast } from '@/components/ui/use-toast';

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
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions
  });

  const handleGenerateQuickReport = (type: string) => {
    if (transactions.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay transacciones disponibles para generar el informe.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Generando informe",
      description: `Informe de tipo ${type} generado con éxito.`
    });
    
    console.log(`Generating ${type} report with ${transactions.length} transactions`);
    // Aquí iría la lógica para generar el informe con datos reales
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
          </TabsList>
          
          <TabsContent value="rapidos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ReportCard 
                title="Informe Mensual" 
                description="Resumen de ingresos y gastos del mes actual."
                icon={FileText}
                onClick={() => handleGenerateQuickReport('monthly')}
              />
              
              <ReportCard 
                title="Balance Anual" 
                description="Estado financiero completo del año en curso."
                icon={FileSpreadsheet}
                onClick={() => handleGenerateQuickReport('annual')}
              />
              
              <ReportCard 
                title="Análisis de Categorías" 
                description="Distribución detallada por categorías."
                icon={PieChart}
                onClick={() => handleGenerateQuickReport('categories')}
              />
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
                <ReportForm transactions={transactions} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Reports;
