import fs from 'node:fs';
import path from 'node:path';

function parseEnvFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const entries = {};

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    entries[key] = value;
  }

  return entries;
}

const fileArg = process.argv.find((argument) => argument.startsWith('--file='));
const modeArg = process.argv.find((argument) => argument.startsWith('--mode='));
const mode = modeArg ? modeArg.slice('--mode='.length) : 'runtime';
const envFile = fileArg ? path.resolve(process.cwd(), fileArg.slice('--file='.length)) : null;
const env = envFile ? { ...process.env, ...parseEnvFile(envFile) } : process.env;

const requiredKeys = [
  'VITE_DISCORD_CLIENT_ID',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_SITE_URL',
];

const errors = [];
const warnings = [];

for (const key of requiredKeys) {
  if (!String(env[key] || '').trim()) {
    errors.push(`${key} is required.`);
  }
}

if (env.VITE_SUPABASE_URL && !/^https:\/\/.+/i.test(env.VITE_SUPABASE_URL)) {
  errors.push('VITE_SUPABASE_URL must be an https URL.');
}

if (env.VITE_SITE_URL && !/^https?:\/\/.+/i.test(env.VITE_SITE_URL)) {
  errors.push('VITE_SITE_URL must be an absolute URL.');
}

if (mode === 'production') {
  if (/localhost|127\.0\.0\.1/i.test(String(env.VITE_SITE_URL || ''))) {
    errors.push('VITE_SITE_URL cannot point to localhost in production mode.');
  }
  if (/localhost|127\.0\.0\.1/i.test(String(env.VITE_DASHBOARD_URL || ''))) {
    errors.push('VITE_DASHBOARD_URL cannot point to localhost in production mode.');
  }
}

if (!String(env.VITE_SUPPORT_SERVER_URL || '').trim()) {
  warnings.push('VITE_SUPPORT_SERVER_URL is empty. Footer and support CTA will lose the direct support link.');
}

if (!String(env.VITE_DOCS_URL || '').trim()) {
  warnings.push('VITE_DOCS_URL is empty. Docs CTA will point to fallback routes only.');
}

if (!String(env.VITE_STATUS_URL || '').trim()) {
  warnings.push('VITE_STATUS_URL is empty. Status CTA will be hidden or degraded.');
}

for (const warning of warnings) {
  console.warn(`WARN: ${warning}`);
}

if (errors.length) {
  for (const error of errors) {
    console.error(`ERROR: ${error}`);
  }
  process.exit(1);
}

console.log(`TON618 web env check passed (${mode}${envFile ? ` from ${path.basename(envFile)}` : ''}).`);
