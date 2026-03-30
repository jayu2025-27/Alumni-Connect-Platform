const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else results.push(file);
  });
  return results;
}

const frontendSrc = path.join(__dirname, 'src');
const files = walk(frontendSrc);

files.forEach(file => {
  if (file.endsWith('.js') || file.endsWith('.jsx')) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('http://localhost:8080')) {
      // Replace with template literal format using the environment variable
      const newContent = content.replace(/['"]http:\/\/localhost:8080([^'"]*)['"]/g, (match, path) => {
          return `\`\${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${path}\``;
      });
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated:', file);
    }
  }
});
