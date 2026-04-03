#!/usr/bin/env node
/**
 * Build all generated assets (sitemap, RSS feed)
 * Run: node scripts/build-all.js
 * 
 * This is the main build script to run before deploying.
 * It regenerates sitemap.xml and feed.xml from articles-data.js
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('Building site assets...\n');

const scriptsDir = __dirname;

try {
    // Generate sitemap
    execSync(`node ${path.join(scriptsDir, 'generate-sitemap.js')}`, { stdio: 'inherit' });
    
    // Generate RSS feed
    execSync(`node ${path.join(scriptsDir, 'generate-feed.js')}`, { stdio: 'inherit' });
    
    console.log('\n✓ All assets built successfully!');
} catch (error) {
    console.error('\n✗ Build failed:', error.message);
    process.exit(1);
}
