const supabaseUrl = 'https://cyovtwebgecrvrxxvfjw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5b3Z0d2ViZ2VjcnZyeHh2Zmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODAxMDksImV4cCI6MjA5NDM1NjEwOX0.Ea-RqeWzAayArsyhGa9Cnrm1bHE68Rq4_D6iLSp2rJc';

const standardColumns = [
  'id', 'name', 'category', 'categoryName', 'tagline', 'description', 
  'packing', 'image', 'ingredients', 'storage', 'nutrition', 'featured', 'created_at'
];

async function probe() {
  for (const col of standardColumns) {
    const payload = {};
    payload[col] = 'test';
    
    // special types
    if (col === 'nutrition') payload[col] = {};
    if (col === 'featured') payload[col] = false;

    const res = await fetch(`${supabaseUrl}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    const text = await res.text();
    const isColumnMissing = text.includes('Could not find');
    console.log(`Column "${col}": Status = ${res.status}, Missing = ${isColumnMissing}, Msg = ${text.trim()}`);
  }
}

probe();
