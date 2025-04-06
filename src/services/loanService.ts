
import { supabase } from "@/integrations/supabase/client";

// Types for loan data
export interface Loan {
  id: string;
  date: string;
  description: string | null;
  amount: number;
  loan_type: 'recibido' | 'otorgado';
  status: 'pendiente' | 'pagado';
  due_date: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type LoanInput = {
  date: string;
  description: string | null;
  amount: number;
  loan_type: 'recibido' | 'otorgado';
  status: 'pendiente' | 'pagado';
  due_date: string | null;
};

// Get all loans for the current user
export const getLoans = async (): Promise<Loan[]> => {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching loans:', error);
    throw error;
  }

  return (data || []) as Loan[];
};

// Create a new loan
export const createLoan = async (loan: LoanInput): Promise<Loan> => {
  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('loans')
    .insert({
      ...loan,
      user_id: user.id
    } as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating loan:', error);
    throw error;
  }

  return data as Loan;
};

// Update an existing loan
export const updateLoan = async (id: string, loan: Partial<LoanInput>): Promise<Loan> => {
  const { data, error } = await supabase
    .from('loans')
    .update(loan as any)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating loan:', error);
    throw error;
  }

  return data as Loan;
};

// Delete a loan
export const deleteLoan = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('loans')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting loan:', error);
    throw error;
  }
};
