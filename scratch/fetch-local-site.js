async function fetchSite() {
  try {
    const res = await fetch('http://localhost:8080/');
    console.log('Site fetch status:', res.status);
    const html = await res.text();
    console.log('Does it contain product-card in HTML?');
    console.log(html.includes('product-card'));
    console.log('Does it contain products-grid in HTML?');
    console.log(html.includes('products-grid'));
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}
fetchSite();
