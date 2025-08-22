import { createTransaction, TransactionInput, updateTransaction } from '@/services/transactionService';
import { useMutationWithToast } from './useMutationWithToast';
import { TOAST_MESSAGES } from '@/constants/messages';

export const useTransactionMutations = (onSuccess?: () => void) => {
  const createTransactionMutation = useMutationWithToast({
    mutationFn: createTransaction,
    successMessage: TOAST_MESSAGES.TRANSACTION.CREATE_SUCCESS,
    errorMessage: TOAST_MESSAGES.TRANSACTION.CREATE_ERROR,
    queryKeysToInvalidate: [['transactions']],
    onSuccess
  });

  const updateTransactionMutation = useMutationWithToast({
    mutationFn: ({ id, data }: { id: string; data: TransactionInput }) => 
      updateTransaction(id, data),
    successMessage: TOAST_MESSAGES.TRANSACTION.UPDATE_SUCCESS,
    errorMessage: TOAST_MESSAGES.TRANSACTION.UPDATE_ERROR,
    queryKeysToInvalidate: [['transactions']],
    onSuccess
  });

  return {
    createTransactionMutation,
    updateTransactionMutation
  };
};