const supabaseUrl = 'https://cyovtwebgecrvrxxvfjw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5b3Z0d2ViZ2VjcnZyeHh2Zmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODAxMDksImV4cCI6MjA5NDM1NjEwOX0.Ea-RqeWzAayArsyhGa9Cnrm1bHE68Rq4_D6iLSp2rJc';

async function testProducts() {
  try {
    const testProduct = {
      id: 'test-prod-123',
      name: 'Test Porotta',
      category: 'breads',
      tagline: 'Deliciously flaky and layered flatbread',
      description: 'Handmade flaky bread perfect with curry.',
      packing: '5 Pieces per Pack & 350g',
      image: '',
      ingredients: 'Wheat flour, water, salt, oil',
      storage: 'Keep frozen',
      nutrition: { calories: '120', carbohydrates: '24g', protein: '4g', fat: '2g', sodium: '150mg', servingSize: '70g' },
      featured: false
    };

    console.log('Testing products insert without categoryName...');

    const res = await fetch(`${supabaseUrl}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(testProduct)
    });

    console.log(`Products insert status: ${res.status}`);
    const text = await res.text();
    console.log(`Products insert output:`, text);

    if (res.status === 201 || res.status === 200) {
      // Clean up
      const delRes = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.test-prod-123`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      console.log(`Products delete status: ${delRes.status}`);
    }
  } catch (err) {
    console.error(err);
  }
}

testProducts();
