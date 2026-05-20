const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\rashe\\Desktop\\work\\eatsee & nacure\\web\\style.css', 'utf8');

const regex = /url\([^)]+\)/g;
let match;
console.log('Background images found in style.css:');
while ((match = regex.exec(content)) !== null) {
  console.log(match[0]);
}
