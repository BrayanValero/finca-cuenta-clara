import { createClient, updateClient, deleteClient } from '@/services/clientService';
import { useMutationWithToast } from './useMutationWithToast';

export const useCreateClient = () => {
  return useMutationWithToast({
    mutationFn: createClient,
    successMessage: { title: 'Éxito', description: 'Cliente creado exitosamente' },
    errorMessage: { title: 'Error', description: 'Error al crear cliente' },
    queryKeysToInvalidate: [['clients']]
  });
};

export const useUpdateClient = () => {
  return useMutationWithToast({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateClient(id, data),
    successMessage: { title: 'Éxito', description: 'Cliente actualizado exitosamente' },
    errorMessage: { title: 'Error', description: 'Error al actualizar cliente' },
    queryKeysToInvalidate: [['clients']]
  });
};

export const useDeleteClient = () => {
  return useMutationWithToast({
    mutationFn: deleteClient,
    successMessage: { title: 'Éxito', description: 'Cliente eliminado exitosamente' },
    errorMessage: { title: 'Error', description: 'Error al eliminar cliente' },
    queryKeysToInvalidate: [['clients']]
  });
};