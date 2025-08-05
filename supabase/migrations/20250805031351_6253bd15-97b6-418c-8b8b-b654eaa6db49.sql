-- Create loan_payments table to track partial payments
CREATE TABLE public.loan_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID NOT NULL REFERENCES public.loans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loan_payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own loan payments" 
ON public.loan_payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own loan payments" 
ON public.loan_payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own loan payments" 
ON public.loan_payments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own loan payments" 
ON public.loan_payments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE TRIGGER update_loan_payments_updated_at
BEFORE UPDATE ON public.loan_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add a computed field function to get remaining balance for loans
CREATE OR REPLACE FUNCTION public.get_loan_remaining_balance(loan_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  original_amount NUMERIC;
  total_payments NUMERIC;
BEGIN
  -- Get original loan amount
  SELECT amount INTO original_amount FROM public.loans WHERE id = loan_id;
  
  -- Get total payments made
  SELECT COALESCE(SUM(amount), 0) INTO total_payments 
  FROM public.loan_payments 
  WHERE loan_payments.loan_id = get_loan_remaining_balance.loan_id;
  
  -- Return remaining balance
  RETURN original_amount - total_payments;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;