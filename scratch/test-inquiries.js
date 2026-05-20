const supabaseUrl = 'https://cyovtwebgecrvrxxvfjw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5b3Z0d2ViZ2VjcnZyeHh2Zmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODAxMDksImV4cCI6MjA5NDM1NjEwOX0.Ea-RqeWzAayArsyhGa9Cnrm1bHE68Rq4_D6iLSp2rJc';

async function testInquiries() {
  try {
    const testInquiry = {
      name: 'Test Name',
      email: 'test@example.com',
      phone: '1234567890',
      subject: 'wholesale',
      message: 'Test message body'
    };

    console.log('Testing inquiries insert...');

    const res = await fetch(`${supabaseUrl}/rest/v1/inquiries`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testInquiry)
    });

    console.log(`Inquiries insert status: ${res.status}`);
    const text = await res.text();
    console.log(`Inquiries insert output:`, text);
  } catch (err) {
    console.error(err);
  }
}

testInquiries();
