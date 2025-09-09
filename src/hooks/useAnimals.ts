import { useQuery } from '@tanstack/react-query';
import { getAnimals } from '@/services/animalService';
import { useAuth } from '@/contexts/AuthContext';

export const useAnimals = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['animals', user?.id],
    queryFn: getAnimals,
    enabled: !!user?.id
  });
};