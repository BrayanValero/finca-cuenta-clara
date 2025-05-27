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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from '@/contexts/AuthContext';
import TransactionForm from './TransactionForm';
import TransactionRow from './transactions/TransactionRow';

const ITEMS_PER_PAGE = 50;

const TransactionTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Log to help with debugging
  console.log("Current user ID:", user?.id);
  
  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: getTransactions,
    // Only fetch when we have a user
    enabled: !!user?.id
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page when searching
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

  // Calculate total balance correctly
  const calculateTotalBalance = (transactions: Transaction[]): number => {
    console.log("Calculating total balance from", transactions.length, "transactions");
    const total = transactions.reduce((balance, transaction) => {
      const amount = Number(transaction.amount);
      return balance + (transaction.type === 'ingreso' ? amount : -amount);
    }, 0);
    console.log("Total balance calculated:", total);
    return total;
  };

  // Calculate the current total balance
  const totalBalance = calculateTotalBalance(transactions);

  // Calculate balances for each transaction based on date (oldest to newest)
  const calculateBalances = (transactions: Transaction[]) => {
    // First, sort all transactions by date (oldest first) to calculate accurate running balances
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate running balance for each transaction
    let runningBalance = 0;
    const balances = new Map<string, number>();
    
    sortedTransactions.forEach(transaction => {
      const amount = Number(transaction.amount);
      if (transaction.type === 'ingreso') {
        runningBalance += amount;
      } else {
        runningBalance -= amount;
      }
      balances.set(transaction.id, runningBalance);
    });

    console.log("Final running balance:", runningBalance);
    return balances;
  };

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(
    (transaction: Transaction) =>
      transaction.description?.toLowerCase().includes(searchTerm) ||
      new Date(transaction.date).toLocaleDateString('es-ES').toLowerCase().includes(searchTerm)
  );

  // Calculate balances for all transactions
  const balances = calculateBalances(transactions);

  // Sort filtered transactions by date (newest first)
  const sortedFilteredTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedFilteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = sortedFilteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Balance Total:</p>
          <p className={`text-lg font-semibold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' })
              .format(totalBalance)
              .replace('COP', '$')}
          </p>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="max-w-[300px]">Descripción</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction: Transaction) => (
                <TransactionRow 
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  balance={balances.get(transaction.id) || 0}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchTerm 
                    ? "No se encontraron transacciones coincidentes." 
                    : "No hay transacciones registradas aún."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, sortedFilteredTransactions.length)} de {sortedFilteredTransactions.length} transacciones
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

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
