#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up environment for Explore My Kerala...\n');

// Check if .env.local already exists
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('⚠️  .env.local already exists. Backing up to .env.local.backup');
  fs.copyFileSync(envLocalPath, path.join(__dirname, '.env.local.backup'));
}

// Copy config.env to .env.local
const configEnvPath = path.join(__dirname, 'config.env');
if (fs.existsSync(configEnvPath)) {
  fs.copyFileSync(configEnvPath, envLocalPath);
  console.log('✅ Created .env.local from config.env');
} else {
  console.log('❌ config.env not found. Please create it first.');
  process.exit(1);
}

console.log('\n📝 Next steps:');
console.log('1. Get your Firebase credentials from https://console.firebase.google.com/');
console.log('2. Update .env.local with your actual Firebase project details');
console.log('3. Run: npm run dev');
console.log('\n🔧 Firebase Setup:');
console.log('- Create a new Firebase project');
console.log('- Enable Firestore Database');
console.log('- Enable Storage');
console.log('- Enable Authentication');
console.log('- Copy your config values to .env.local');

console.log('\n✨ Environment setup complete!');
