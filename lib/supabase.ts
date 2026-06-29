import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anon);

export interface FeedbackRow {
  id: string;
  name: string;
  email?: string;
  rating: number;
  comment: string;
  reply?: string;
  replied_at?: string;
  created_at: string;
}
