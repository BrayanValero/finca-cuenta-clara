import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentData {
  title: string;
  description?: string;
  drive_url: string;
  document_type: string;
}

export const useDocumentMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createDocument = useMutation({
    mutationFn: async (data: DocumentData) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('Usuario no autenticado');
      }

      const { data: document, error } = await supabase
        .from('documents')
        .insert([{ ...data, user_id: user.user.id }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: "Documento agregado",
        description: "El documento se ha guardado correctamente."
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el documento."
      });
    }
  });

  const updateDocument = useMutation({
    mutationFn: async ({ id, ...data }: DocumentData & { id: string }) => {
      const { data: document, error } = await supabase
        .from('documents')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: "Documento actualizado",
        description: "Los cambios se han guardado correctamente."
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el documento."
      });
    }
  });

  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: "Documento eliminado",
        description: "El documento se ha eliminado correctamente."
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el documento."
      });
    }
  });

  return {
    createDocument,
    updateDocument,
    deleteDocument,
  };
};