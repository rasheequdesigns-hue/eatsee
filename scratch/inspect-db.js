const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://cyovtwebgecrvrxxvfjw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5b3Z0d2ViZ2VjcnZyeHh2Zmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODAxMDksImV4cCI6MjA5NDM1NjEwOX0.Ea-RqeWzAayArsyhGa9Cnrm1bHE68Rq4_D6iLSp2rJc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error(error);
  } else {
    console.log('Products:', JSON.stringify(data, null, 2));
  }
}
check();
