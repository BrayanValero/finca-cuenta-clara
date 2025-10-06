import React, { useState } from 'react';
import { ArrowLeft, Plus, BarChart3, Users, ShoppingCart, Receipt, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AnimalTable } from '@/components/AnimalTable';
import { AnimalSaleForm } from '@/components/AnimalSaleForm';
import { AnimalExpenseForm } from '@/components/AnimalExpenseForm';
import { AnimalTransactionForm } from '@/components/AnimalTransactionForm';
import { EggDebtorTable } from '@/components/EggDebtorTable';
import { ClientForm } from '@/components/ClientForm';
import AnimalTransactionActions from '@/components/transactions/AnimalTransactionActions';
import AnimalProfileCard from '@/components/AnimalProfileCard';
import AnimalDetailView from '@/components/AnimalDetailView';
import CardStat from '@/components/CardStat';
import { useAnimals } from '@/hooks/useAnimals';
import { useAnimalTransactions } from '@/hooks/useAnimalTransactions';
import { useCreateAnimalTransaction, useUpdateAnimalTransaction, useDeleteAnimalTransaction } from '@/hooks/useAnimalMutations';
import { useEggDebtors } from '@/hooks/useEggDebtors';
import { useCreateEggDebtor, useDeleteEggDebtor } from '@/hooks/useEggDebtorMutations';
import { useCreateClient } from '@/hooks/useClientMutations';
import { Animal, AnimalTransaction } from '@/services/animalService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Animals: React.FC = () => {
  const [selectedAnimalType, setSelectedAnimalType] = useState<string | null>(null);
  const [selectedIndividualAnimal, setSelectedIndividualAnimal] = useState<Animal | null>(null);
  const [isSaleFormOpen, setIsSaleFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isDebtorFormOpen, setIsDebtorFormOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<AnimalTransaction | null>(null);
  const [isEditTransactionFormOpen, setIsEditTransactionFormOpen] = useState(false);

  const { data: animals = [], isLoading: animalsLoading, refetch: refetchAnimals } = useAnimals();
  const { data: transactions = [], isLoading: transactionsLoading } = useAnimalTransactions(
    selectedIndividualAnimal?.id || (selectedAnimalType ? undefined : undefined)
  );
  const { data: debtors = [], isLoading: debtorsLoading } = useEggDebtors(
    selectedAnimalType === 'gallinas' && selectedIndividualAnimal ? selectedIndividualAnimal.id : undefined
  );

  const createTransaction = useCreateAnimalTransaction();
  const updateTransaction = useUpdateAnimalTransaction();
  const deleteTransaction = useDeleteAnimalTransaction();
  const createDebtor = useCreateEggDebtor();
  const deleteDebtor = useDeleteEggDebtor();
  const createClient = useCreateClient();

  const handleCreateTransaction = (data: any) => {
    if (data.createClient) {
      const clientData = data.createClient;
      delete data.createClient;
      
      createClient.mutate(clientData, {
        onSuccess: () => {
          if (data.createDebtor) {
            const debtorData = data.createDebtor;
            delete data.createDebtor;
            
            createDebtor.mutate(debtorData, {
              onSuccess: () => {
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
        }
      });
    } else if (data.createDebtor) {
      const debtorData = data.createDebtor;
      delete data.createDebtor;
      
      createDebtor.mutate(debtorData, {
        onSuccess: () => {
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

  const handleCreateClient = (data: any) => {
    createClient.mutate(data, {
      onSuccess: () => {
        setIsClientFormOpen(false);
      }
    });
  };

  const handleEditTransaction = (transaction: AnimalTransaction) => {
    setEditingTransaction(transaction);
    setIsEditTransactionFormOpen(true);
  };

  const handleUpdateTransaction = (data: any) => {
    if (editingTransaction) {
      updateTransaction.mutate(
        { id: editingTransaction.id, data },
        {
          onSuccess: () => {
            setIsEditTransactionFormOpen(false);
            setEditingTransaction(null);
          }
        }
      );
    }
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction.mutate(id);
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
    const icons: { [key: string]: string } = {
      'vacas': '🐄',
      'gallinas': '🐔',
      'pollitos': '🐤',
      'perros': '🐕',
      'piscos': '🦃'
    };
    return icons[type] || '🐾';
  };

  const getAnimalTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'vacas': 'Vacas',
      'gallinas': 'Gallinas',
      'pollitos': 'Pollitos',
      'perros': 'Perros',
      'piscos': 'Piscos'
    };
    return labels[type] || type;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const groupedAnimals = animals?.reduce((acc, animal) => {
    if (!acc[animal.animal_type]) {
      acc[animal.animal_type] = [];
    }
    acc[animal.animal_type].push(animal);
    return acc;
  }, {} as Record<string, Animal[]>) || {};

  if (animalsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando animales...</div>;
  }

  // Level 3: Individual animal detail view
  if (selectedIndividualAnimal) {
    return (
      <div className="container mx-auto p-4">
        <Button
          variant="outline"
          onClick={() => setSelectedIndividualAnimal(null)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a {getAnimalTypeLabel(selectedIndividualAnimal.animal_type)}
        </Button>

        <AnimalDetailView
          animal={selectedIndividualAnimal}
          onBack={() => setSelectedIndividualAnimal(null)}
          onUpdate={() => refetchAnimals()}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
          <CardStat
            title="Total Ingresos"
            value={formatCurrency(getAnimalSummary(selectedIndividualAnimal.id).totalIncome)}
            icon={<DollarSign />}
          />
          <CardStat
            title="Total Gastos"
            value={formatCurrency(getAnimalSummary(selectedIndividualAnimal.id).totalExpense)}
            icon={<TrendingDown />}
          />
          <CardStat
            title="Balance"
            value={formatCurrency(getAnimalSummary(selectedIndividualAnimal.id).balance)}
            icon={<TrendingUp />}
          />
          <CardStat
            title="Transacciones"
            value={getAnimalSummary(selectedIndividualAnimal.id).transactionCount.toString()}
            icon={<BarChart3 />}
          />
        </div>

        {/* Action Buttons for Individual Animal */}
        <div className="flex gap-2 mb-6">
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
                animalId={selectedIndividualAnimal.id}
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
                animalId={selectedIndividualAnimal.id}
                onSubmit={handleCreateTransaction}
                isLoading={createTransaction.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Transactions for Individual Animal */}
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
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className={`font-bold ${
                          transaction.type === 'ingreso' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'ingreso' ? '+' : '-'}
                          {formatCurrency(Number(transaction.amount))}
                        </div>
                      </div>
                      <AnimalTransactionActions
                        transaction={transaction}
                        onEdit={handleEditTransaction}
                        onDelete={handleDeleteTransaction}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Transaction Dialog */}
        <Dialog open={isEditTransactionFormOpen} onOpenChange={setIsEditTransactionFormOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Transacción</DialogTitle>
            </DialogHeader>
            {editingTransaction && (
              <AnimalTransactionForm
                animalId={editingTransaction.animal_id}
                onSubmit={handleUpdateTransaction}
                initialData={editingTransaction}
                isLoading={updateTransaction.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Level 2: Show individual animals of selected type
  if (selectedAnimalType && !selectedIndividualAnimal) {
    const animalsOfType = groupedAnimals[selectedAnimalType] || [];
    const isIndividualType = ['vacas', 'perros', 'piscos'].includes(selectedAnimalType);
    
    return (
      <div className="container mx-auto p-4">
        <Button
          variant="outline"
          onClick={() => setSelectedAnimalType(null)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Animales
        </Button>

        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          {getAnimalIcon(selectedAnimalType)} {getAnimalTypeLabel(selectedAnimalType)}
        </h1>

        {isIndividualType ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {animalsOfType.map((animal) => {
              const summary = getAnimalSummary(animal.id);
              return (
                <AnimalProfileCard
                  key={animal.id}
                  animal={animal}
                  summary={summary}
                  onClick={() => setSelectedIndividualAnimal(animal)}
                />
              );
            })}
          </div>
        ) : (
          <AnimalTable 
            animals={animalsOfType}
            onSelectAnimal={setSelectedIndividualAnimal}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <CardStat
            title="Balance Total"
            value={formatCurrency(
              animalsOfType.reduce((sum, animal) => {
                const summary = getAnimalSummary(animal.id);
                return sum + summary.balance;
              }, 0)
            )}
            icon={<TrendingUp />}
          />
          <CardStat
            title="Total Ingresos"
            value={formatCurrency(
              animalsOfType.reduce((sum, animal) => {
                const summary = getAnimalSummary(animal.id);
                return sum + summary.totalIncome;
              }, 0)
            )}
            icon={<DollarSign />}
          />
          <CardStat
            title="Total Gastos"
            value={formatCurrency(
              animalsOfType.reduce((sum, animal) => {
                const summary = getAnimalSummary(animal.id);
                return sum + summary.totalExpense;
              }, 0)
            )}
            icon={<TrendingDown />}
          />
        </div>
      </div>
    );
  }

  // Level 1: Show animal types grouped
  if (!selectedAnimalType) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Animales</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(groupedAnimals).map(([type, typeAnimals]) => {
            const totalQuantity = typeAnimals.reduce((sum, animal) => sum + animal.quantity, 0);
            const totalBalance = typeAnimals.reduce((sum, animal) => {
              const summary = getAnimalSummary(animal.id);
              return sum + summary.balance;
            }, 0);
            
            return (
              <Card 
                key={type}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedAnimalType(type)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl">{getAnimalIcon(type)}</span>
                    <span>{getAnimalTypeLabel(type)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {typeAnimals.length} registro{typeAnimals.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total: {totalQuantity} animal{totalQuantity !== 1 ? 'es' : ''}
                    </p>
                    <p className={`text-lg font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Balance: {formatCurrency(totalBalance)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default Animals;