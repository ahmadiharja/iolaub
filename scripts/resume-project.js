#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('▶️  Resuming Bualoi Relief Fund Project...\n');

// 1. Check if project was paused
if (!fs.existsSync('.pause-marker.json')) {
  console.log('ℹ️  No pause marker found. Project was not paused.');
  process.exit(0);
}

// 2. Read pause information
const pauseMarker = JSON.parse(fs.readFileSync('.pause-marker.json', 'utf8'));
console.log('📋 Resume Information:');
console.log(`⏰ Was paused at: ${pauseMarker.pausedAt}`);
console.log(`📝 Reason: ${pauseMarker.reason}`);
console.log(`🔖 Last commit: ${pauseMarker.lastCommit}`);

// 3. Check git status
try {
  const currentStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  if (currentStatus) {
    console.log('\n⚠️  Warning: You have uncommitted changes:');
    console.log(currentStatus);
    console.log('\n💡 Consider committing or stashing them before resuming.');
  }
} catch (error) {
  console.log('⚠️  Could not check git status');
}

// 4. Remove pause marker
fs.unlinkSync('.pause-marker.json');
console.log('\n🗑️  Pause marker removed');

// 5. Install dependencies if needed
console.log('\n📦 Checking dependencies...');
if (!fs.existsSync('node_modules')) {
  console.log('📥 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} else {
  console.log('✅ Dependencies already installed');
}

// 6. Generate Prisma client
console.log('\n🔧 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');
} catch (error) {
  console.log('⚠️  Could not generate Prisma client:', error.message);
}

// 7. Start development server
console.log('\n🚀 Starting development server...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🎯 Project Resumed Successfully!');
console.log('🌐 Development server will start on http://localhost:3000');
console.log('📱 Admin panel: http://localhost:3000/admin');
console.log('🔧 API endpoints: http://localhost:3000/api');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n💡 Press Ctrl+C to stop the server');
console.log('💡 Use npm run pause to pause the project again\n');

// Start the dev server
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.log('❌ Failed to start development server:', error.message);
  process.exit(1);
}
