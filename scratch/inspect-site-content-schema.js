const supabaseUrl = 'https://cyovtwebgecrvrxxvfjw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5b3Z0d2ViZ2VjcnZyeHh2Zmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODAxMDksImV4cCI6MjA5NDM1NjEwOX0.Ea-RqeWzAayArsyhGa9Cnrm1bHE68Rq4_D6iLSp2rJc';

async function inspect() {
  try {
    const testKey = 'test_key_antigravity';
    const testValue = JSON.stringify({ foo: 'bar', timestamp: Date.now() });

    console.log('Testing site_content insert/upsert using fetch...');

    // Upsert
    const upsertRes = await fetch(`${supabaseUrl}/rest/v1/site_content`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify({ key: testKey, value: testValue })
    });

    console.log(`Upsert response status: ${upsertRes.status}`);
    const upsertText = await upsertRes.text();
    console.log(`Upsert output:`, upsertText);

    // Retrieve
    const retrieveRes = await fetch(`${supabaseUrl}/rest/v1/site_content?key=eq.${testKey}&select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    console.log(`Retrieve response status: ${retrieveRes.status}`);
    const retrieveText = await retrieveRes.text();
    console.log(`Retrieve output:`, retrieveText);

    // Delete
    const deleteRes = await fetch(`${supabaseUrl}/rest/v1/site_content?key=eq.${testKey}`, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    console.log(`Delete response status: ${deleteRes.status}`);
    console.log('Cleaned up test key.');

  } catch (err) {
    console.error('Inspection failed:', err);
  }
}

inspect();
