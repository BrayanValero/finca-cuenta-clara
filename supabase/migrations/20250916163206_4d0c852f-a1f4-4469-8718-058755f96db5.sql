-- Create table for egg carton debtors
CREATE TABLE public.egg_debtors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  animal_id UUID NOT NULL,
  debtor_name TEXT NOT NULL,
  phone TEXT,
  cartons_owed INTEGER NOT NULL DEFAULT 0,
  eggs_owed INTEGER NOT NULL DEFAULT 0,
  price_per_carton NUMERIC NOT NULL DEFAULT 12000,
  price_per_egg NUMERIC NOT NULL DEFAULT 500,
  total_debt NUMERIC GENERATED ALWAYS AS (cartons_owed * price_per_carton + eggs_owed * price_per_egg) STORED,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.egg_debtors ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own egg debtors" 
ON public.egg_debtors 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own egg debtors" 
ON public.egg_debtors 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own egg debtors" 
ON public.egg_debtors 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own egg debtors" 
ON public.egg_debtors 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_egg_debtors_updated_at
BEFORE UPDATE ON public.egg_debtors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for egg debt payments
CREATE TABLE public.egg_debt_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  debtor_id UUID NOT NULL,
  cartons_paid INTEGER NOT NULL DEFAULT 0,
  eggs_paid INTEGER NOT NULL DEFAULT 0,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.egg_debt_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own egg debt payments" 
ON public.egg_debt_payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own egg debt payments" 
ON public.egg_debt_payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own egg debt payments" 
ON public.egg_debt_payments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own egg debt payments" 
ON public.egg_debt_payments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_egg_debt_payments_updated_at
BEFORE UPDATE ON public.egg_debt_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();