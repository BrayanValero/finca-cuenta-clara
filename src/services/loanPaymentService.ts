import { supabase } from "@/integrations/supabase/client";

// Types for loan payment data
export interface LoanPayment {
  id: string;
  loan_id: string;
  user_id: string;
  payment_date: string;
  amount: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type LoanPaymentInput = {
  loan_id: string;
  payment_date: string;
  amount: number;
  description: string | null;
};

// Get all payments for a specific loan
export const getLoanPayments = async (loanId: string): Promise<LoanPayment[]> => {
  const { data, error } = await supabase
    .from('loan_payments')
    .select('*')
    .eq('loan_id', loanId)
    .order('payment_date', { ascending: false });

  if (error) {
    console.error('Error fetching loan payments:', error);
    throw error;
  }

  return (data || []) as LoanPayment[];
};

// Create a new loan payment
export const createLoanPayment = async (payment: LoanPaymentInput): Promise<LoanPayment> => {
  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('loan_payments')
    .insert({
      ...payment,
      user_id: user.id
    } as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating loan payment:', error);
    throw error;
  }

  return data as LoanPayment;
};

// Delete a loan payment
export const deleteLoanPayment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('loan_payments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting loan payment:', error);
    throw error;
  }
};

// Get remaining balance for a loan
export const getLoanRemainingBalance = async (loanId: string): Promise<number> => {
  const { data, error } = await supabase
    .rpc('get_loan_remaining_balance', { loan_id: loanId });

  if (error) {
    console.error('Error getting loan remaining balance:', error);
    throw error;
  }

  return data || 0;
};