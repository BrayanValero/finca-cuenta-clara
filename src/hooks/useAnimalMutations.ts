import { createAnimal, updateAnimal, deleteAnimal, createAnimalTransaction, updateAnimalTransaction, deleteAnimalTransaction } from '@/services/animalService';
import { useMutationWithToast } from './useMutationWithToast';
import { TOAST_MESSAGES } from '@/constants/messages';

export const useCreateAnimal = () => {
  return useMutationWithToast({
    mutationFn: createAnimal,
    successMessage: TOAST_MESSAGES.ANIMAL.CREATE_SUCCESS,
    errorMessage: TOAST_MESSAGES.ANIMAL.CREATE_ERROR,
    queryKeysToInvalidate: [['animals']]
  });
};

export const useUpdateAnimal = () => {
  return useMutationWithToast({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAnimal(id, data),
    successMessage: TOAST_MESSAGES.ANIMAL.UPDATE_SUCCESS,
    errorMessage: TOAST_MESSAGES.ANIMAL.UPDATE_ERROR,
    queryKeysToInvalidate: [['animals']]
  });
};

export const useDeleteAnimal = () => {
  return useMutationWithToast({
    mutationFn: deleteAnimal,
    successMessage: TOAST_MESSAGES.ANIMAL.DELETE_SUCCESS,
    errorMessage: TOAST_MESSAGES.ANIMAL.DELETE_ERROR,
    queryKeysToInvalidate: [['animals'], ['animalTransactions']]
  });
};

export const useCreateAnimalTransaction = () => {
  return useMutationWithToast({
    mutationFn: createAnimalTransaction,
    successMessage: TOAST_MESSAGES.ANIMAL_TRANSACTION.CREATE_SUCCESS,
    errorMessage: TOAST_MESSAGES.ANIMAL_TRANSACTION.CREATE_ERROR,
    queryKeysToInvalidate: [['animalTransactions']]
  });
};

export const useUpdateAnimalTransaction = () => {
  return useMutationWithToast({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAnimalTransaction(id, data),
    successMessage: TOAST_MESSAGES.ANIMAL_TRANSACTION.UPDATE_SUCCESS,
    errorMessage: TOAST_MESSAGES.ANIMAL_TRANSACTION.UPDATE_ERROR,
    queryKeysToInvalidate: [['animalTransactions']]
  });
};

export const useDeleteAnimalTransaction = () => {
  return useMutationWithToast({
    mutationFn: deleteAnimalTransaction,
    successMessage: TOAST_MESSAGES.ANIMAL_TRANSACTION.DELETE_SUCCESS,
    errorMessage: TOAST_MESSAGES.ANIMAL_TRANSACTION.DELETE_ERROR,
    queryKeysToInvalidate: [['animalTransactions']]
  });
};