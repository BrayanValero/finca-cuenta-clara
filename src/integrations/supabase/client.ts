// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kshnqbfsmkleolhkxrkk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaG5xYmZzbWtsZW9saGt4cmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDYzMzYsImV4cCI6MjA1OTI4MjMzNn0.YT7PikEtWQ6_Jm2az0o1o9GiblarNFHa4PZLazyXyJs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);