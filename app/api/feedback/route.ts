import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, rating, comment } = body;

  if (!name?.trim() || !rating || !comment?.trim()) {
    return Response.json({ error: 'Name, rating and comment are required' }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return Response.json({ error: 'Rating must be 1–5' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('feedback')
    .insert([{ name: name.trim(), email: email?.trim() || null, rating, comment: comment.trim() }])
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
