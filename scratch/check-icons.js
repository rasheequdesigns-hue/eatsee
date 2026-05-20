const fs = require('fs');
const files = ['index.html', 'admin.html', 'app.js', 'admin.js'];

files.forEach(file => {
  try {
    const content = fs.readFileSync('c:\\Users\\rashe\\Desktop\\work\\eatsee & nacure\\web\\' + file, 'utf8');
    const regex = /class="[^"]*fa[lrd] [^"]*"/g;
    let match;
    console.log(`--- Icons found in ${file} matching fa[lrd] ---`);
    while ((match = regex.exec(content)) !== null) {
      console.log(match[0]);
    }
    
    // Also search for standard <i> tags containing fa[lrd]
    const regexI = /<i class=['"]([^'"]*fa[lrd][^'"]*)['"]/g;
    while ((match = regexI.exec(content)) !== null) {
      console.log(`  <i> tag icon: ${match[1]}`);
    }
  } catch (err) {
    // ignore
  }
});
