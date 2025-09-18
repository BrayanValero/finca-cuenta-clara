import React, { useState } from 'react';
import { ArrowLeft, Plus, BarChart3, Users, ShoppingCart, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AnimalTable } from '@/components/AnimalTable';
import { AnimalSaleForm } from '@/components/AnimalSaleForm';
import { AnimalExpenseForm } from '@/components/AnimalExpenseForm';
import { EggDebtorForm } from '@/components/EggDebtorForm';
import { EggDebtorTable } from '@/components/EggDebtorTable';
import { useAnimals } from '@/hooks/useAnimals';
import { useAnimalTransactions } from '@/hooks/useAnimalTransactions';
import { useCreateAnimalTransaction } from '@/hooks/useAnimalMutations';
import { useEggDebtors } from '@/hooks/useEggDebtors';
import { useCreateEggDebtor, useDeleteEggDebtor } from '@/hooks/useEggDebtorMutations';
import { Animal } from '@/services/animalService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Animals: React.FC = () => {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isSaleFormOpen, setIsSaleFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isDebtorFormOpen, setIsDebtorFormOpen] = useState(false);

  const { data: animals = [], isLoading: animalsLoading } = useAnimals();
  const { data: transactions = [], isLoading: transactionsLoading } = useAnimalTransactions(
    selectedAnimal?.id
  );
  const { data: debtors = [], isLoading: debtorsLoading } = useEggDebtors(
    selectedAnimal?.animal_type === 'gallinas' ? selectedAnimal?.id : undefined
  );

  const createTransaction = useCreateAnimalTransaction();
  const createDebtor = useCreateEggDebtor();
  const deleteDebtor = useDeleteEggDebtor();

  const handleCreateTransaction = (data: any) => {
    // If it's a credit sale, create the debtor first
    if (data.createDebtor) {
      const debtorData = data.createDebtor;
      delete data.createDebtor; // Remove debtor data from transaction
      
      createDebtor.mutate(debtorData, {
        onSuccess: () => {
          // After creating debtor, create the transaction
          createTransaction.mutate(data, {
            onSuccess: () => {
              setIsSaleFormOpen(false);
              setIsExpenseFormOpen(false);
            }
          });
        }
      });
    } else {
      createTransaction.mutate(data, {
        onSuccess: () => {
          setIsSaleFormOpen(false);
          setIsExpenseFormOpen(false);
        }
      });
    }
  };

  const handleCreateDebtor = (data: any) => {
    createDebtor.mutate(data, {
      onSuccess: () => {
        setIsDebtorFormOpen(false);
      }
    });
  };

  const handleDeleteDebtor = (debtorId: string) => {
    if (confirm('¿Está seguro de eliminar este deudor?')) {
      deleteDebtor.mutate(debtorId);
    }
  };

  const getAnimalSummary = (animalId: string) => {
    const animalTransactions = transactions.filter(t => t.animal_id === animalId);
    const totalIncome = animalTransactions
      .filter(t => t.type === 'ingreso')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = animalTransactions
      .filter(t => t.type === 'gasto')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance, transactionCount: animalTransactions.length };
  };

  const getAnimalIcon = (type: string) => {
    switch (type) {
      case 'vacas': return '🐄';
      case 'gallinas': return '🐔';
      case 'perros': return '🐕';
      case 'pollitos': return '🐣';
      default: return '🐾';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (animalsLoading) {
    return <div className="p-6">Cargando animales...</div>;
  }

  if (!selectedAnimal) {
    return (
      <div className="p-6">
        <AnimalTable animals={animals} onSelectAnimal={setSelectedAnimal} />
      </div>
    );
  }

  const summary = getAnimalSummary(selectedAnimal.id);

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedAnimal(null)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Mis Animales
        </Button>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{getAnimalIcon(selectedAnimal.animal_type)}</span>
          <div>
            <h1 className="text-2xl font-bold capitalize">{selectedAnimal.animal_type}</h1>
            {selectedAnimal.name && (
              <p className="text-muted-foreground">{selectedAnimal.name}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Cantidad: {selectedAnimal.quantity}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Ingresos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Gastos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.totalExpense)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                summary.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(summary.balance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transacciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.transactionCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-6">
          {selectedAnimal.animal_type === 'gallinas' ? (
            <>
              <Dialog open={isSaleFormOpen} onOpenChange={setIsSaleFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Venta
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Registrar Venta de Huevos</DialogTitle>
                  </DialogHeader>
                  <AnimalSaleForm
                    animalId={selectedAnimal.id}
                    onSubmit={handleCreateTransaction}
                    isLoading={createTransaction.isPending}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={isExpenseFormOpen} onOpenChange={setIsExpenseFormOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Receipt className="mr-2 h-4 w-4" />
                    Gasto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Registrar Gasto</DialogTitle>
                  </DialogHeader>
                  <AnimalExpenseForm
                    animalId={selectedAnimal.id}
                    onSubmit={handleCreateTransaction}
                    isLoading={createTransaction.isPending}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={isDebtorFormOpen} onOpenChange={setIsDebtorFormOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Nuevo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Nuevo Cliente</DialogTitle>
                  </DialogHeader>
                  <EggDebtorForm
                    animalId={selectedAnimal.id}
                    onSubmit={handleCreateDebtor}
                    isLoading={createDebtor.isPending}
                  />
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <>
              <Dialog open={isSaleFormOpen} onOpenChange={setIsSaleFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Ingreso
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Registrar Ingreso</DialogTitle>
                  </DialogHeader>
                  <AnimalExpenseForm
                    animalId={selectedAnimal.id}
                    onSubmit={(data) => handleCreateTransaction({...data, type: 'ingreso'})}
                    isLoading={createTransaction.isPending}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={isExpenseFormOpen} onOpenChange={setIsExpenseFormOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Receipt className="mr-2 h-4 w-4" />
                    Gasto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Registrar Gasto</DialogTitle>
                  </DialogHeader>
                  <AnimalExpenseForm
                    animalId={selectedAnimal.id}
                    onSubmit={handleCreateTransaction}
                    isLoading={createTransaction.isPending}
                  />
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {selectedAnimal.animal_type === 'gallinas' ? (
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transacciones</TabsTrigger>
            <TabsTrigger value="debtors">Deudores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Historial de Transacciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <p>Cargando transacciones...</p>
                ) : transactions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No hay transacciones registradas para este animal
                  </p>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={transaction.type === 'ingreso' ? 'default' : 'destructive'}
                            >
                              {transaction.type === 'ingreso' ? 'Ingreso' : 'Gasto'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {transaction.category}
                            </span>
                          </div>
                          {transaction.description && (
                            <p className="text-sm text-muted-foreground">
                              {transaction.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: es })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${
                            transaction.type === 'ingreso' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'ingreso' ? '+' : '-'}
                            {formatCurrency(Number(transaction.amount))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="debtors">
            <EggDebtorTable
              debtors={debtors}
              onDelete={handleDeleteDebtor}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Historial de Transacciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <p>Cargando transacciones...</p>
            ) : transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay transacciones registradas para este animal
              </p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={transaction.type === 'ingreso' ? 'default' : 'destructive'}
                        >
                          {transaction.type === 'ingreso' ? 'Ingreso' : 'Gasto'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {transaction.category}
                        </span>
                      </div>
                      {transaction.description && (
                        <p className="text-sm text-muted-foreground">
                          {transaction.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: es })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        transaction.type === 'ingreso' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'ingreso' ? '+' : '-'}
                        {formatCurrency(Number(transaction.amount))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Animals;