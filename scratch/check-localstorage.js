const fs = require('fs');
const files = ['app.js', 'admin.js', 'index.html', 'admin.html'];

for (const file of files) {
  try {
    const content = fs.readFileSync('c:\\Users\\rashe\\Desktop\\work\\eatsee & nacure\\web\\' + file, 'utf8');
    if (content.includes('localStorage')) {
      console.log(`File ${file} contains localStorage`);
    }
  } catch (err) {
    // ignore
  }
}
