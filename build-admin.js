const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to the .next directory
const nextDir = path.join(process.cwd(), '.next');

console.log('Build script started...');

// Delete the .next directory if it exists
try {
  if (fs.existsSync(nextDir)) {
    console.log('Cleaning up existing .next directory...');
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('.next directory removed successfully');
  }
} catch (err) {
  console.error('Error removing .next directory:', err.message);
  // Continue anyway, as Next.js will recreate it
}

// Run the Next.js build
try {
  console.log('Starting Next.js build...');
  execSync('next build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (err) {
  console.error('Build failed:', err.message);
  process.exit(1);
} 