
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  photo_url: string | null;
  full_name?: string;
  phone?: string;
  address?: string;
}

export function useProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, photo_url")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      
      // Crear full_name combinando first_name y last_name
      const profile = data ? {
        ...data,
        full_name: [data.first_name, data.last_name].filter(Boolean).join(' ') || '',
        phone: '', // Por ahora campos vacíos hasta que se agreguen a la DB
        address: ''
      } : null;
      
      return profile as Profile;
    },
    enabled: !!userId,
  });

  const updateProfile = useMutation({
    mutationFn: async (updateData: {
      id: string;
      full_name?: string;
      phone?: string;
      address?: string;
    }) => {
      // Separar full_name en first_name y last_name
      const nameParts = updateData.full_name?.trim().split(' ') || [];
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';

      const { error } = await supabase
        .from("profiles")
        .update({ 
          first_name: first_name || null,
          last_name: last_name || null
        })
        .eq("id", updateData.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  return { 
    profile, 
    isLoading, 
    error: error?.message || null, 
    updateProfile 
  };
}
