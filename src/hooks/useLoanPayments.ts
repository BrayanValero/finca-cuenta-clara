import { useQuery } from '@tanstack/react-query';
import { createLoanPayment, deleteLoanPayment, getLoanPayments, LoanPaymentInput } from '@/services/loanPaymentService';
import { useMutationWithToast } from './useMutationWithToast';
import { TOAST_MESSAGES } from '@/constants/messages';

export const useLoanPayments = (loanId: string) => {
  return useQuery({
    queryKey: ['loan-payments', loanId],
    queryFn: () => getLoanPayments(loanId),
    enabled: !!loanId
  });
};

export const useLoanPaymentMutations = (onSuccess?: () => void) => {
  const createPaymentMutation = useMutationWithToast({
    mutationFn: createLoanPayment,
    successMessage: TOAST_MESSAGES.LOAN_PAYMENT.CREATE_SUCCESS,
    errorMessage: TOAST_MESSAGES.LOAN_PAYMENT.CREATE_ERROR,
    queryKeysToInvalidate: [['loan-payments'], ['loans'], ['loan-balances']],
    onSuccess
  });

  const deletePaymentMutation = useMutationWithToast({
    mutationFn: deleteLoanPayment,
    successMessage: TOAST_MESSAGES.LOAN_PAYMENT.DELETE_SUCCESS,
    errorMessage: TOAST_MESSAGES.LOAN_PAYMENT.DELETE_ERROR,
    queryKeysToInvalidate: [['loan-payments'], ['loans'], ['loan-balances']],
    onSuccess
  });

  return {
    createPaymentMutation,
    deletePaymentMutation
  };
};