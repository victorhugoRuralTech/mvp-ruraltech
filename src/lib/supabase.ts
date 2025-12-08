import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types para o banco de dados
export interface User {
  id: string;
  username: string;
  password: string;
  created_at: string;
}

export interface UserData {
  id: string;
  user_id: string;
  data_type: 'cattle' | 'buyers' | 'supplies' | 'employees' | 'sales' | 'lots';
  data: any;
  created_at: string;
  updated_at: string;
}
