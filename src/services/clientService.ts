import { supabase } from '@/integrations/supabase/client';

export interface Client {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const createClient = async (client: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Client> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuario no autenticado');

  const { data, error } = await supabase
    .from('clients')
    .insert({
      ...client,
      user_id: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateClient = async (id: string, client: Partial<Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .update(client)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteClient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) throw error;
};