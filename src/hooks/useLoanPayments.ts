import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLoanPayment, deleteLoanPayment, getLoanPayments, LoanPaymentInput } from '@/services/loanPaymentService';
import { useToast } from '@/hooks/use-toast';

export const useLoanPayments = (loanId: string) => {
  return useQuery({
    queryKey: ['loan-payments', loanId],
    queryFn: () => getLoanPayments(loanId),
    enabled: !!loanId
  });
};

export const useLoanPaymentMutations = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPaymentMutation = useMutation({
    mutationFn: createLoanPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['loan-payments'] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['loan-balances'] });
      toast({
        title: "Abono registrado",
        description: "El abono ha sido registrado con éxito."
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar el abono. Por favor, inténtelo de nuevo."
      });
    }
  });

  const deletePaymentMutation = useMutation({
    mutationFn: deleteLoanPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan-payments'] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['loan-balances'] });
      toast({
        title: "Abono eliminado",
        description: "El abono ha sido eliminado con éxito."
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el abono. Por favor, inténtelo de nuevo."
      });
    }
  });

  return {
    createPaymentMutation,
    deletePaymentMutation
  };
};