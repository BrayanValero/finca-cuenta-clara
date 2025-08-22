import { supabase } from '@/integrations/supabase/client';
import { useMutationWithToast } from './useMutationWithToast';
import { TOAST_MESSAGES } from '@/constants/messages';

interface DocumentData {
  title: string;
  description?: string;
  drive_url: string;
  document_type: string;
}

const createDocumentFn = async (data: DocumentData) => {
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
};

const updateDocumentFn = async ({ id, ...data }: DocumentData & { id: string }) => {
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
};

const deleteDocumentFn = async (id: string) => {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
};

export const useDocumentMutations = () => {
  const createDocument = useMutationWithToast({
    mutationFn: createDocumentFn,
    successMessage: TOAST_MESSAGES.DOCUMENT.CREATE_SUCCESS,
    errorMessage: TOAST_MESSAGES.DOCUMENT.CREATE_ERROR,
    queryKeysToInvalidate: [['documents']]
  });

  const updateDocument = useMutationWithToast({
    mutationFn: updateDocumentFn,
    successMessage: TOAST_MESSAGES.DOCUMENT.UPDATE_SUCCESS,
    errorMessage: TOAST_MESSAGES.DOCUMENT.UPDATE_ERROR,
    queryKeysToInvalidate: [['documents']]
  });

  const deleteDocument = useMutationWithToast({
    mutationFn: deleteDocumentFn,
    successMessage: TOAST_MESSAGES.DOCUMENT.DELETE_SUCCESS,
    errorMessage: TOAST_MESSAGES.DOCUMENT.DELETE_ERROR,
    queryKeysToInvalidate: [['documents']]
  });

  return {
    createDocument,
    updateDocument,
    deleteDocument,
  };
};