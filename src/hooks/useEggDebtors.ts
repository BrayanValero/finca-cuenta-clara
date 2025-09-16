import { useQuery } from '@tanstack/react-query';
import { getEggDebtors } from '@/services/eggDebtorService';
import { useAuth } from '@/contexts/AuthContext';

export const useEggDebtors = (animalId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['eggDebtors', user?.id, animalId],
    queryFn: () => animalId ? getEggDebtors(animalId) : [],
    enabled: !!user?.id && !!animalId
  });
};