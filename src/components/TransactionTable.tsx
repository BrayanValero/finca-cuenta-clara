
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTransactions, deleteTransaction, Transaction } from '@/services/transactionService';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import TransactionForm from './TransactionForm';
import TransactionRow from './transactions/TransactionRow';

const TransactionTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transacción eliminada",
        description: "La transacción ha sido eliminada con éxito."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la transacción."
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingTransaction(null);
  };

  const filteredTransactions = transactions.filter(
    (transaction: Transaction) =>
      transaction.description?.toLowerCase().includes(searchTerm) ||
      new Date(transaction.date).toLocaleDateString('es-ES').toLowerCase().includes(searchTerm)
  );

  if (isLoading) {
    return <div className="text-center py-8">Cargando transacciones...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error al cargar las transacciones.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar transacciones..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="max-w-[300px]">Descripción</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction: Transaction) => (
                <TransactionRow 
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {searchTerm 
                    ? "No se encontraron transacciones coincidentes." 
                    : "No hay transacciones registradas aún."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Transacción</DialogTitle>
            <DialogDescription>
              Actualice los datos de la transacción según sea necesario.
            </DialogDescription>
          </DialogHeader>
          <TransactionForm 
            editTransaction={editingTransaction} 
            onSuccess={closeEditDialog} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionTable;
