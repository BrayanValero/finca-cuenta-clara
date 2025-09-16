import { createEggDebtor, updateEggDebtor, deleteEggDebtor, createEggDebtPayment } from '@/services/eggDebtorService';
import { useMutationWithToast } from './useMutationWithToast';

export const useCreateEggDebtor = () => {
  return useMutationWithToast({
    mutationFn: createEggDebtor,
    successMessage: { title: 'Éxito', description: 'Deudor creado exitosamente' },
    errorMessage: { title: 'Error', description: 'Error al crear deudor' },
    queryKeysToInvalidate: [['eggDebtors']]
  });
};

export const useUpdateEggDebtor = () => {
  return useMutationWithToast({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateEggDebtor(id, data),
    successMessage: { title: 'Éxito', description: 'Deudor actualizado exitosamente' },
    errorMessage: { title: 'Error', description: 'Error al actualizar deudor' },
    queryKeysToInvalidate: [['eggDebtors']]
  });
};

export const useDeleteEggDebtor = () => {
  return useMutationWithToast({
    mutationFn: deleteEggDebtor,
    successMessage: { title: 'Éxito', description: 'Deudor eliminado exitosamente' },
    errorMessage: { title: 'Error', description: 'Error al eliminar deudor' },
    queryKeysToInvalidate: [['eggDebtors']]
  });
};

export const useCreateEggDebtPayment = () => {
  return useMutationWithToast({
    mutationFn: createEggDebtPayment,
    successMessage: { title: 'Éxito', description: 'Pago registrado exitosamente' },
    errorMessage: { title: 'Error', description: 'Error al registrar pago' },
    queryKeysToInvalidate: [['eggDebtors']]
  });
};