import { supabase } from '@/integrations/supabase/client';

export interface Animal {
  id: string;
  user_id: string;
  animal_type: string;
  name?: string;
  quantity: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface AnimalTransaction {
  id: string;
  animal_id: string;
  user_id: string;
  type: 'ingreso' | 'gasto';
  category: string;
  amount: number;
  description?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export const getAnimals = async (): Promise<Animal[]> => {
  const { data, error } = await supabase
    .from('animals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error al obtener animales: ${error.message}`);
  }

  return data || [];
};

export const createAnimal = async (animal: Omit<Animal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Animal> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('animals')
    .insert({
      ...animal,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error al crear animal: ${error.message}`);
  }

  return data;
};

export const updateAnimal = async (id: string, animal: Partial<Omit<Animal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Animal> => {
  const { data, error } = await supabase
    .from('animals')
    .update(animal)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar animal: ${error.message}`);
  }

  return data;
};

export const deleteAnimal = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('animals')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error al eliminar animal: ${error.message}`);
  }
};

export const getAnimalTransactions = async (animalId?: string): Promise<AnimalTransaction[]> => {
  let query = supabase
    .from('animal_transactions')
    .select('*');
  
  if (animalId) {
    query = query.eq('animal_id', animalId);
  }
  
  const { data, error } = await query.order('date', { ascending: false });

  if (error) {
    throw new Error(`Error al obtener transacciones de animales: ${error.message}`);
  }

  return (data || []) as AnimalTransaction[];
};

export const createAnimalTransaction = async (transaction: Omit<AnimalTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<AnimalTransaction> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('animal_transactions')
    .insert({
      ...transaction,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error al crear transacción de animal: ${error.message}`);
  }

  return data as AnimalTransaction;
};

export const updateAnimalTransaction = async (id: string, transaction: Partial<Omit<AnimalTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<AnimalTransaction> => {
  const { data, error } = await supabase
    .from('animal_transactions')
    .update(transaction)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar transacción de animal: ${error.message}`);
  }

  return data as AnimalTransaction;
};

export const deleteAnimalTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('animal_transactions')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error al eliminar transacción de animal: ${error.message}`);
  }
};