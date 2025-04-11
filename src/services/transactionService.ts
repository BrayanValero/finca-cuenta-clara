
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

// Types for transaction data
export interface Transaction {
  id: string;
  date: string;
  type: 'ingreso' | 'gasto';
  category: string; // Mantenemos el campo en la interfaz para compatibilidad interna
  description: string | null;
  amount: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export type TransactionInput = {
  date: string;
  type: 'ingreso' | 'gasto';
  category: string; // Mantenemos el campo en el input pero no lo mostramos en la UI
  description: string | null;
  amount: number;
};

// Helper function to determine category based on description
export const determineCategory = (description: string): string => {
  const lowerDesc = description.toLowerCase();
  
  // Check for sueldos category first (includes "semana marcos")
  if (lowerDesc.includes('semana marcos') || lowerDesc.includes('sueldo')) {
    return 'sueldos';
  } else if (lowerDesc.includes('cacao') || lowerDesc.includes('maiz') || lowerDesc.includes('venta')) {
    return 'ventas';
  } else if (lowerDesc.includes('gasolina')) {
    return 'insumos';
  } else if ((lowerDesc.includes('pago') && (lowerDesc.includes('roberto') || lowerDesc.includes('fernando'))) || 
            lowerDesc.includes('mano de obra')) {
    return 'mano_obra';
  } else if (lowerDesc.includes('abogado')) {
    return 'otros';
  }
  
  return 'otros';
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

  // If description exists, check if we need to update the category
  if (transaction.description) {
    const suggestedCategory = determineCategory(transaction.description);
    if (suggestedCategory !== 'otros') {
      transaction.category = suggestedCategory;
    }
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
  // If description exists, check if we need to update the category
  if (transaction.description) {
    const suggestedCategory = determineCategory(transaction.description);
    if (suggestedCategory !== 'otros') {
      transaction.category = suggestedCategory;
    }
  }

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
