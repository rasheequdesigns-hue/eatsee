const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\rashe\\Desktop\\work\\eatsee & nacure\\web\\style.css', 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('no-image') || line.includes('product-card')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
