
-- Create a table to track user login sessions
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  login_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view only their own sessions
CREATE POLICY "Users can view their own sessions" 
  ON public.user_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own sessions
CREATE POLICY "Users can create their own sessions" 
  ON public.user_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create an index for better performance when querying recent sessions
CREATE INDEX idx_user_sessions_user_id_login_time ON public.user_sessions(user_id, login_time DESC);
