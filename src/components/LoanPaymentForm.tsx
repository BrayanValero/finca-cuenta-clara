import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLoanPaymentMutations } from '@/hooks/useLoanPayments';
import { LoanPaymentInput } from '@/services/loanPaymentService';

const paymentSchema = z.object({
  amount: z.string()
    .min(1, 'El monto es requerido')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'El monto debe ser un número mayor a 0'),
  payment_date: z.string().min(1, 'La fecha es requerida'),
  description: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface LoanPaymentFormProps {
  loanId: string;
  onSuccess: () => void;
  maxAmount?: number;
}

const LoanPaymentForm: React.FC<LoanPaymentFormProps> = ({ loanId, onSuccess, maxAmount }) => {
  const { createPaymentMutation } = useLoanPaymentMutations(onSuccess);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: '',
      payment_date: new Date().toISOString().split('T')[0],
      description: '',
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    const paymentData: LoanPaymentInput = {
      loan_id: loanId,
      payment_date: data.payment_date,
      amount: Number(data.amount),
      description: data.description || null,
    };

    await createPaymentMutation.mutateAsync(paymentData);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto del Abono</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  {...field} 
                  max={maxAmount}
                />
              </FormControl>
              {maxAmount && (
                <p className="text-sm text-muted-foreground">
                  Saldo pendiente: ${maxAmount.toFixed(2)}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha del Abono</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Descripción del abono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={createPaymentMutation.isPending}
        >
          {createPaymentMutation.isPending ? 'Registrando...' : 'Registrar Abono'}
        </Button>
      </form>
    </Form>
  );
};

export default LoanPaymentForm;