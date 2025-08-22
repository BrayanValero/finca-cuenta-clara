import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface MutationConfig<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage: { title: string; description: string };
  errorMessage: { title: string; description: string };
  queryKeysToInvalidate: string[][];
  onSuccess?: () => void;
}

export const useMutationWithToast = <TData, TVariables>({
  mutationFn,
  successMessage,
  errorMessage,
  queryKeysToInvalidate,
  onSuccess
}: MutationConfig<TData, TVariables>) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryKeysToInvalidate.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      toast(successMessage);
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast({
        variant: "destructive",
        ...errorMessage
      });
    }
  });
};