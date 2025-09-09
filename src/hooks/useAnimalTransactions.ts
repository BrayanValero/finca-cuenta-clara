import { useQuery } from '@tanstack/react-query';
import { getAnimalTransactions } from '@/services/animalService';
import { useAuth } from '@/contexts/AuthContext';

export const useAnimalTransactions = (animalId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['animalTransactions', user?.id, animalId],
    queryFn: () => getAnimalTransactions(animalId),
    enabled: !!user?.id
  });
};