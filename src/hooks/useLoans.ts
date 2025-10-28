import { useQuery } from '@tanstack/react-query';
import { getLoans } from '@/services/loanService';
import { supabase } from '@/integrations/supabase/client';

// Get all loan payments for the user
export const getAllLoanPayments = async () => {
  const { data, error } = await supabase
    .from('loan_payments')
    .select('*')
    .order('payment_date', { ascending: false });

  if (error) {
    console.error('Error fetching all loan payments:', error);
    throw error;
  }

  return data || [];
};

export const useLoans = () => {
  return useQuery({
    queryKey: ['loans'],
    queryFn: getLoans
  });
};

export const useAllLoanPayments = () => {
  return useQuery({
    queryKey: ['all-loan-payments'],
    queryFn: getAllLoanPayments
  });
};
