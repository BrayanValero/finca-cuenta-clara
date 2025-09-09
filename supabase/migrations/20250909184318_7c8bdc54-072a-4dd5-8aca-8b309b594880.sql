-- Create animals table to track different animal types
CREATE TABLE public.animals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  animal_type TEXT NOT NULL,
  name TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create animal_transactions table for separate accounting per animal
CREATE TABLE public.animal_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID NOT NULL REFERENCES public.animals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ingreso', 'gasto')),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on animals table
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for animals
CREATE POLICY "Users can view their own animals" 
ON public.animals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own animals" 
ON public.animals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own animals" 
ON public.animals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own animals" 
ON public.animals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Enable RLS on animal_transactions table
ALTER TABLE public.animal_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for animal_transactions
CREATE POLICY "Users can view their own animal transactions" 
ON public.animal_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own animal transactions" 
ON public.animal_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own animal transactions" 
ON public.animal_transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own animal transactions" 
ON public.animal_transactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_animals_updated_at
BEFORE UPDATE ON public.animals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_animal_transactions_updated_at
BEFORE UPDATE ON public.animal_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();