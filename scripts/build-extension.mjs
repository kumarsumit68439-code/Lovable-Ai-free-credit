#!/usr/bin/env node
/**
 * Builds lvbl-infinity-v16.50-own.zip from public/extension/src/
 * Runs before: next build
 */
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcDir = join(root, 'public', 'extension', 'src');
const outZip = join(root, 'public', 'extension', 'lvbl-infinity-v16.50-own.zip');

if (!existsSync(srcDir)) {
  console.log('[build-extension] No src/ directory found, skipping zip build.');
  process.exit(0);
}

try { execSync(`rm -f "${outZip}"`); } catch (_) {}

execSync(`cd "${srcDir}" && zip -r "${outZip}" .`, { stdio: 'inherit' });
console.log('[build-extension] Built: ' + outZip);
