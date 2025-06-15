import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { categorizeTransaction } from "@/utils/transactionUtils";

// Types for transaction data
export interface Transaction {
  id: string;
  date: string;
  type: 'ingreso' | 'gasto';
  description: string | null;
  amount: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  category: string; // Keep this field as it's required by the database
}

export type TransactionInput = {
  date: string;
  type: 'ingreso' | 'gasto';
  description: string | null;
  amount: number;
  category?: string; // Make it optional in the input but provide default
};

// Helper function to determine a category based on the description
export const determineCategory = async (description: string, type: 'ingreso' | 'gasto'): Promise<string> => {
  try {
    const result = await categorizeTransaction(description, type);
    return result.category;
  } catch (error) {
    console.error('Error determining category:', error);
    return "Sin categoría";
  }
};

// Get all transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  console.log("Fetching transactions");
  
  // Get current session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    console.error("No authenticated user found when fetching transactions");
    return [];
  }
  
  console.log("Fetching transactions for user:", session.user.id);
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  console.log(`Retrieved ${data?.length || 0} transactions`);

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

  console.log("Creating transaction for user:", user.id);

  // Determine category using our new hybrid system
  const category = await determineCategory(
    transaction.description || '', 
    transaction.type
  );

  const transactionWithCategory = {
    ...transaction,
    category,
    user_id: user.id
  };

  const { data, error } = await supabase
    .from('transactions')
    .insert(transactionWithCategory)
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
  // If updating description, update category too
  let updates = transaction;
  
  if (transaction.description !== undefined) {
    // We need the current type to determine category
    const { data: currentTransaction } = await supabase
      .from('transactions')
      .select('type')
      .eq('id', id)
      .single();
    
    if (currentTransaction) {
      const category = await determineCategory(
        transaction.description || '', 
        currentTransaction.type as 'ingreso' | 'gasto'
      );
      updates = { ...transaction, category };
    }
  }

  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
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
