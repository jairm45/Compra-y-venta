import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  career: string;
  semester: string;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Service {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Food {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Rating {
  id: string;
  seller_id: string;
  buyer_id: string;
  product_id: string;
  stars: number;
  comment: string;
  created_at: string;
}
