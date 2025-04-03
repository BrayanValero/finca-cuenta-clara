
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

// Types for transaction data
export interface Transaction {
  id: string;
  date: string;
  type: 'ingreso' | 'gasto';
  category: string;
  description: string | null;
  amount: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export type TransactionInput = {
  date: string;
  type: 'ingreso' | 'gasto';
  category: string;
  description: string | null;
  amount: number;
};

// Get all transactions for the current user
export const getTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  // Explicitly cast the data to ensure it meets our Transaction interface
  return (data || []).map(item => ({
    ...item,
    type: item.type as 'ingreso' | 'gasto'
  })) as Transaction[];
};

// Create a new transaction
export const createTransaction = async (transaction: TransactionInput): Promise<Transaction> => {
  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      ...transaction,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }

  // Explicitly cast to ensure type compatibility
  return {
    ...data,
    type: data.type as 'ingreso' | 'gasto'
  } as Transaction;
};

// Update an existing transaction
export const updateTransaction = async (id: string, transaction: Partial<TransactionInput>): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .update(transaction)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }

  // Explicitly cast to ensure type compatibility
  return {
    ...data,
    type: data.type as 'ingreso' | 'gasto'
  } as Transaction;
};

// Delete a transaction
export const deleteTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};
