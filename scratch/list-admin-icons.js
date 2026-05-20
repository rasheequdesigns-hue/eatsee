const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\rashe\\Desktop\\work\\eatsee & nacure\\web\\admin.html', 'utf8');

const regex = /<i class=['"]([^'"]*)['"]/g;
let match;
console.log('Icons in admin.html:');
while ((match = regex.exec(content)) !== null) {
  console.log(match[1]);
}
