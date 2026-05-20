const supabaseUrl = 'https://cyovtwebgecrvrxxvfjw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5b3Z0d2ViZ2VjcnZyeHh2Zmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODAxMDksImV4cCI6MjA5NDM1NjEwOX0.Ea-RqeWzAayArsyhGa9Cnrm1bHE68Rq4_D6iLSp2rJc';

async function fetchOpenAPI() {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    console.log('OpenAPI fetch status:', res.status);
    const spec = await res.json();
    
    console.log('TABLES FOUND IN SPEC:', Object.keys(spec.definitions || {}));
    
    if (spec.definitions) {
      if (spec.definitions.products) {
        console.log('--- PRODUCTS SCHEMA ---');
        console.log(spec.definitions.products.properties);
      }
      if (spec.definitions.inquiries) {
        console.log('--- INQUIRIES SCHEMA ---');
        console.log(spec.definitions.inquiries.properties);
      }
      if (spec.definitions.site_content) {
        console.log('--- SITE CONTENT SCHEMA ---');
        console.log(spec.definitions.site_content.properties);
      }
      if (spec.definitions.site_settings) {
        console.log('--- SITE SETTINGS SCHEMA ---');
        console.log(spec.definitions.site_settings.properties);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

fetchOpenAPI();
