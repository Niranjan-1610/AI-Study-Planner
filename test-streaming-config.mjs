#!/usr/bin/env node

/**
 * Streaming Configuration Test
 * Run this to verify your streaming setup is correct
 * 
 * Usage: node test-streaming-config.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('\n🔍 Streaming Configuration Test\n');

// Test 1: Check .env.local
console.log('1️⃣  Checking .env.local...');
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('  ❌ FAIL: .env.local not found');
  console.log('  📝 Create .env.local with:');
  console.log('     NEXT_PUBLIC_TAMBO_API_KEY=sk_test_...');
  console.log('     NEXT_PUBLIC_TAMBO_URL=https://api.tambo.ai');
} else {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasApiKey = envContent.includes('NEXT_PUBLIC_TAMBO_API_KEY');
  const apiKeyValid = envContent.includes('sk_test_');
  
  if (!hasApiKey) {
    console.error('  ❌ FAIL: NEXT_PUBLIC_TAMBO_API_KEY not set');
  } else if (!apiKeyValid) {
    console.error('  ❌ FAIL: API key format invalid (should start with sk_test_)');
  } else {
    console.log('  ✅ PASS: API key configured');
  }
  
  const hasUrl = envContent.includes('NEXT_PUBLIC_TAMBO_URL');
  if (hasUrl) {
    console.log('  ✅ PASS: API URL configured');
  } else {
    console.log('  ⚠️  WARN: NEXT_PUBLIC_TAMBO_URL not set (using default)');
  }
}

// Test 2: Check patch file
console.log('\n2️⃣  Checking streaming patch...');
const patchPath = path.join(__dirname, 'patches', '@tambo-ai+typescript-sdk+0.89.0.patch');
if (!fs.existsSync(patchPath)) {
  console.error('  ❌ FAIL: Patch file not found');
  console.log('  📝 Run: npm install to restore patches/');
} else {
  console.log('  ✅ PASS: Streaming patch exists');
}

// Test 3: Check patch-package
console.log('\n3️⃣  Checking patch-package installation...');
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
if (packageJson.devDependencies?.['patch-package']) {
  console.log('  ✅ PASS: patch-package installed');
  
  // Check postinstall script
  if (packageJson.scripts?.postinstall?.includes('patch-package')) {
    console.log('  ✅ PASS: postinstall hook configured');
  } else {
    console.error('  ❌ FAIL: postinstall hook not configured');
    console.log('  📝 Add to package.json scripts: "postinstall": "patch-package"');
  }
} else {
  console.error('  ❌ FAIL: patch-package not installed');
  console.log('  📝 Run: npm install patch-package --save-dev');
}

// Test 4: Check streaming configuration in code
console.log('\n4️⃣  Checking streaming code configuration...');
const chatPagePath = path.join(__dirname, 'src', 'app', 'chat', 'page.tsx');
if (fs.existsSync(chatPagePath)) {
  const chatPageContent = fs.readFileSync(chatPagePath, 'utf8');
  if (chatPageContent.includes('streaming={true}')) {
    console.log('  ✅ PASS: Streaming enabled in chat/page.tsx');
  } else {
    console.warn('  ⚠️  WARN: Streaming may be disabled in chat/page.tsx');
  }
  
  if (chatPageContent.includes('StreamErrorBoundary')) {
    console.log('  ✅ PASS: Error boundary configured');
  } else {
    console.warn('  ⚠️  WARN: StreamErrorBoundary not used');
  }
} else {
  console.error('  ❌ FAIL: chat/page.tsx not found');
}

// Test 5: Check error handling
console.log('\n5️⃣  Checking error handling setup...');
const boundaryPath = path.join(__dirname, 'src', 'components', 'StreamErrorBoundary.tsx');
if (fs.existsSync(boundaryPath)) {
  const boundaryContent = fs.readFileSync(boundaryPath, 'utf8');
  if (boundaryContent.includes('ErrorInfo')) {
    console.log('  ✅ PASS: StreamErrorBoundary component exists');
  }
} else {
  console.error('  ❌ FAIL: StreamErrorBoundary.tsx not found');
}

const chatPanelPath = path.join(__dirname, 'src', 'app', 'interactables', 'components', 'chat-panel.tsx');
if (fs.existsSync(chatPanelPath)) {
  const chatPanelContent = fs.readFileSync(chatPanelPath, 'utf8');
  if (chatPanelContent.includes('unhandledrejection')) {
    console.log('  ✅ PASS: Unhandled rejection handler configured');
  } else {
    console.warn('  ⚠️  WARN: Unhandled rejection handling missing');
  }
} else {
  console.error('  ❌ FAIL: chat-panel.tsx not found');
}

// Summary
console.log('\n📋 Summary:');
console.log('   ✅ All critical checks should pass for streaming to work');
console.log('   ⚠️  Warnings are optional but recommended');
console.log('   ❌ Failures must be fixed before streaming will work\n');

console.log('🚀 Next steps:');
console.log('   1. Fix any ❌ failures above');
console.log('   2. Run: npm install');
console.log('   3. Run: npm run dev');
console.log('   4. Test streaming by sending a message in the chat\n');
