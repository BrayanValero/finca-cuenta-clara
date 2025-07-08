import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction, TransactionInput, updateTransaction } from '@/services/transactionService';
import { useToast } from '@/components/ui/use-toast';

export const useTransactionMutations = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transacción registrada",
        description: "La transacción ha sido guardada con éxito."
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar la transacción. Por favor, inténtelo de nuevo."
      });
    }
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TransactionInput }) => 
      updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transacción actualizada",
        description: "La transacción ha sido actualizada con éxito."
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la transacción. Por favor, inténtelo de nuevo."
      });
    }
  });

  return {
    createTransactionMutation,
    updateTransactionMutation
  };
};