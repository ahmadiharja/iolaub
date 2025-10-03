#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 Quick Start - Bualoi Relief Fund Project\n');

// 1. Check if project is paused
if (fs.existsSync('.pause-marker.json')) {
  console.log('🛑 Project is currently paused.');
  console.log('💡 Use "npm run resume" to resume the project.');
  process.exit(0);
}

// 2. Check dependencies
console.log('📦 Checking dependencies...');
if (!fs.existsSync('node_modules')) {
  console.log('📥 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.log('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed');
}

// 3. Generate Prisma client
console.log('\n🔧 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');
} catch (error) {
  console.log('⚠️  Could not generate Prisma client:', error.message);
}

// 4. Check environment variables
console.log('\n🔐 Checking environment variables...');
if (fs.existsSync('.env')) {
  console.log('✅ .env file found');
} else {
  console.log('⚠️  .env file not found. Creating template...');
  const envTemplate = `# Database
DATABASE_URL="your_database_url_here"

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
`;
  fs.writeFileSync('.env', envTemplate);
  console.log('📝 Created .env template. Please fill in your values.');
}

// 5. Start development server
console.log('\n🌐 Starting development server...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🎯 Bualoi Relief Fund Project');
console.log('🌐 Local: http://localhost:3000');
console.log('📱 Admin: http://localhost:3000/admin');
console.log('🔧 API: http://localhost:3000/api');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n💡 Press Ctrl+C to stop');
console.log('💡 Use "npm run pause" to pause the project\n');

try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.log('❌ Failed to start development server:', error.message);
  process.exit(1);
}
