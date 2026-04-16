#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const distPath = join(projectRoot, 'dist');

console.log('Starting AI Chat Client...');
console.log(`Serving files from: ${distPath}`);

try {
  // Use sirv-cli to serve the dist folder
  // --single for SPA (redirects 404s to index.html)
  // --port 5173 to match the usual dev port
  execSync(`npx sirv "${distPath}" --single --port 5173 --host`, { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to start the server. Make sure you have run "npm install" and the "dist" folder exists.');
  process.exit(1);
}
