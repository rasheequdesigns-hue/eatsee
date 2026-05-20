const supabaseUrl = 'https://cyovtwebgecrvrxxvfjw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5b3Z0d2ViZ2VjcnZyeHh2Zmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODAxMDksImV4cCI6MjA5NDM1NjEwOX0.Ea-RqeWzAayArsyhGa9Cnrm1bHE68Rq4_D6iLSp2rJc';

async function test(tableName) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${tableName}?select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    console.log(`--- Table ${tableName} status: ${res.status} ---`);
    const text = await res.text();
    console.log(`Content:`, text.substring(0, 1000));
  } catch (err) {
    console.error(`Error querying table ${tableName}:`, err);
  }
}

async function run() {
  await test('site_settings');
  await test('site_content');
  await test('products');
}

run();
