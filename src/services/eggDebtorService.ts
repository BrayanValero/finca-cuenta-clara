import { supabase } from '@/integrations/supabase/client';

export interface EggDebtor {
  id: string;
  user_id: string;
  animal_id: string;
  debtor_name: string;
  phone?: string;
  cartons_owed: number;
  eggs_owed: number;
  price_per_carton: number;
  price_per_egg: number;
  total_debt: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EggDebtPayment {
  id: string;
  user_id: string;
  debtor_id: string;
  cartons_paid: number;
  eggs_paid: number;
  amount_paid: number;
  payment_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const getEggDebtors = async (animalId: string): Promise<EggDebtor[]> => {
  const { data, error } = await supabase
    .from('egg_debtors')
    .select('*')
    .eq('animal_id', animalId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error al obtener deudores: ${error.message}`);
  }

  return data || [];
};

export const createEggDebtor = async (debtor: Omit<EggDebtor, 'id' | 'user_id' | 'total_debt' | 'created_at' | 'updated_at'>): Promise<EggDebtor> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('egg_debtors')
    .insert({
      ...debtor,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error al crear deudor: ${error.message}`);
  }

  return data;
};

export const updateEggDebtor = async (id: string, debtor: Partial<Omit<EggDebtor, 'id' | 'user_id' | 'total_debt' | 'created_at' | 'updated_at'>>): Promise<EggDebtor> => {
  const { data, error } = await supabase
    .from('egg_debtors')
    .update(debtor)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar deudor: ${error.message}`);
  }

  return data;
};

export const deleteEggDebtor = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('egg_debtors')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error al eliminar deudor: ${error.message}`);
  }
};

export const getEggDebtPayments = async (debtorId: string): Promise<EggDebtPayment[]> => {
  const { data, error } = await supabase
    .from('egg_debt_payments')
    .select('*')
    .eq('debtor_id', debtorId)
    .order('payment_date', { ascending: false });

  if (error) {
    throw new Error(`Error al obtener pagos: ${error.message}`);
  }

  return data || [];
};

export const createEggDebtPayment = async (payment: Omit<EggDebtPayment, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<EggDebtPayment> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('egg_debt_payments')
    .insert({
      ...payment,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error al crear pago: ${error.message}`);
  }

  return data;
};