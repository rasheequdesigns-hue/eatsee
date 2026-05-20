async function fetchProducts() {
  try {
    const res = await fetch(`http://localhost:8080/products.json?v=${Date.now()}`);
    console.log('Products.json fetch status:', res.status);
    const text = await res.text();
    console.log('Products.json content from server:');
    console.log(text);
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}
fetchProducts();
