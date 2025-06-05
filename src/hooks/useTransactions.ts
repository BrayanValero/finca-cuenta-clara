
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/transactionService';
import { useAuth } from '@/contexts/AuthContext';

export const useTransactions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: getTransactions,
    enabled: !!user?.id
  });
};
