const fs = require('fs');
const path = require('path');

const babelConfigFiles = [
  '.babelrc',
  '.babelrc.js',
  'babel.config.js'
];

console.log('Checking for Babel config files...');

babelConfigFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`Found ${file}, removing...`);
    try {
      fs.unlinkSync(filePath);
      console.log(`Successfully removed ${file}`);
    } catch (err) {
      console.error(`Error removing ${file}:`, err);
    }
  } else {
    console.log(`${file} not found, skipping.`);
  }
});

console.log('Babel config check complete.'); 