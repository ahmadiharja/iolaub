#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('📊 Bualoi Relief Fund Project Status\n');

// 1. Check if project is paused
if (fs.existsSync('.pause-marker.json')) {
  const pauseMarker = JSON.parse(fs.readFileSync('.pause-marker.json', 'utf8'));
  
  console.log('🛑 PROJECT IS PAUSED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`⏰ Paused at: ${pauseMarker.pausedAt}`);
  console.log(`📝 Reason: ${pauseMarker.reason}`);
  console.log(`🔖 Last commit: ${pauseMarker.lastCommit}`);
  
  if (pauseMarker.gitStatus) {
    console.log(`📊 Git status when paused:`);
    console.log(pauseMarker.gitStatus);
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n💡 To resume: npm run resume');
} else {
  console.log('▶️  PROJECT IS ACTIVE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Check if dev server is running
  try {
    execSync('netstat -ano | findstr :3000', { stdio: 'pipe' });
    console.log('🌐 Development server: RUNNING (port 3000)');
  } catch (error) {
    console.log('🌐 Development server: NOT RUNNING');
  }
  
  // Check git status
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    if (gitStatus) {
      console.log('📊 Git status:');
      console.log(gitStatus);
    } else {
      console.log('📊 Git status: Clean');
    }
  } catch (error) {
    console.log('📊 Git status: Could not check');
  }
  
  // Check last commit
  try {
    const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf8' }).trim();
    console.log(`🔖 Last commit: ${lastCommit}`);
  } catch (error) {
    console.log('🔖 Last commit: Could not check');
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n💡 To pause: npm run pause');
  console.log('💡 To start dev server: npm run dev');
}

// 2. Check project health
console.log('\n🔍 Project Health Check:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Check package.json
if (fs.existsSync('package.json')) {
  console.log('✅ package.json: Found');
} else {
  console.log('❌ package.json: Missing');
}

// Check .env
if (fs.existsSync('.env')) {
  console.log('✅ .env: Found');
} else {
  console.log('⚠️  .env: Missing (may cause issues)');
}

// Check Prisma schema
if (fs.existsSync('prisma/schema.prisma')) {
  console.log('✅ Prisma schema: Found');
} else {
  console.log('❌ Prisma schema: Missing');
}

// Check node_modules
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules: Found');
} else {
  console.log('⚠️  node_modules: Missing (run npm install)');
}

// Check .next build
if (fs.existsSync('.next')) {
  console.log('✅ Next.js build: Found');
} else {
  console.log('ℹ️  Next.js build: Not found (run npm run build)');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
