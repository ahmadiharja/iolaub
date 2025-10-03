#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🛑 Pausing Bualoi Relief Fund Project...\n');

// 1. Stop development server if running
try {
  console.log('📱 Stopping development server...');
  execSync('taskkill /f /im node.exe 2>nul || true', { stdio: 'ignore' });
  console.log('✅ Development server stopped');
} catch (error) {
  console.log('ℹ️  No development server running');
}

// 2. Create pause marker
const pauseMarker = {
  pausedAt: new Date().toISOString(),
  reason: process.argv[2] || 'Manual pause',
  gitStatus: execSync('git status --porcelain', { encoding: 'utf8' }).trim(),
  lastCommit: execSync('git log -1 --oneline', { encoding: 'utf8' }).trim()
};

fs.writeFileSync('.pause-marker.json', JSON.stringify(pauseMarker, null, 2));
console.log('📝 Pause marker created');

// 3. Commit current changes if any
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  if (gitStatus) {
    console.log('💾 Committing current changes...');
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "WIP: Pausing project - auto-save"', { stdio: 'inherit' });
    console.log('✅ Changes committed');
  } else {
    console.log('ℹ️  No uncommitted changes');
  }
} catch (error) {
  console.log('⚠️  Could not commit changes:', error.message);
}

// 4. Create backup of important files
const backupDir = '.backup';
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

const importantFiles = [
  '.env',
  'package.json',
  'prisma/schema.prisma',
  'src/app/layout.tsx',
  'src/app/page.tsx'
];

importantFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const backupPath = path.join(backupDir, `${path.basename(file)}.backup`);
    fs.copyFileSync(file, backupPath);
  }
});

console.log('💾 Important files backed up');

// 5. Display pause summary
console.log('\n🎯 Project Paused Successfully!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`⏰ Paused at: ${pauseMarker.pausedAt}`);
console.log(`📝 Reason: ${pauseMarker.reason}`);
console.log(`📊 Git status: ${pauseMarker.gitStatus || 'Clean'}`);
console.log(`🔖 Last commit: ${pauseMarker.lastCommit}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n📋 To resume project:');
console.log('   npm run resume');
console.log('   or');
console.log('   node scripts/resume-project.js');
console.log('\n💡 To check pause status:');
console.log('   npm run pause-status');
