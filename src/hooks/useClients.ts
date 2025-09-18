import { useQuery } from '@tanstack/react-query';
import { getClients } from '@/services/clientService';
import { useAuth } from '@/contexts/AuthContext';

export const useClients = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['clients', user?.id],
    queryFn: getClients,
    enabled: !!user?.id
  });
};