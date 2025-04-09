
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Transaction } from '@/services/transactionService';

interface TransactionActionsProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionActions = ({ transaction, onEdit, onDelete }: TransactionActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(transaction)}>
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem>Detalles</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600"
          onClick={() => onDelete(transaction.id)}
        >
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TransactionActions;
