const supabaseUrl = 'https://cyovtwebgecrvrxxvfjw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5b3Z0d2ViZ2VjcnZyeHh2Zmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODAxMDksImV4cCI6MjA5NDM1NjEwOX0.Ea-RqeWzAayArsyhGa9Cnrm1bHE68Rq4_D6iLSp2rJc';

async function testEmptyProduct() {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'representation'
      },
      body: JSON.stringify({})
    });

    console.log(`Products insert status: ${res.status}`);
    const text = await res.text();
    console.log(`Products insert output:`, text);
  } catch (err) {
    console.error(err);
  }
}

testEmptyProduct();
