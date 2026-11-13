// The downloaded script runs locally with Node.js, never in the browser.
export function createOpenCodeImportScript(
  config: string,
  origin: string
): string {
  const namespace = `newapi-${new URL(origin).host.replaceAll(/[^a-zA-Z0-9_-]/g, '-')}`
  return (
    `const incoming = ${JSON.stringify(JSON.parse(config))};\nconst namespace = ${JSON.stringify(namespace)};\n` +
    String.raw`
const fs = await import('node:fs/promises');
const path = await import('node:path');
const os = await import('node:os');
const { randomUUID } = await import('node:crypto');

function parseConfig(text) {
  // Preserve quoted strings, including URLs and escaped quotes.
  const withoutComments = text.replace(/^\uFEFF/, '').replace(
    /"(?:\\.|[^"\\])*"|\/\/[^\r\n]*|\/\*[\s\S]*?\*\//g,
    token => token.startsWith('"') ? token : token.replace(/[^\r\n]/g, ' ')
  );
  const json = withoutComments.replace(/"(?:\\.|[^"\\])*"|,\s*(?=[}\]])/g,
    token => token.startsWith('"') ? token : '');
  const value = JSON.parse(json);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Config must be an object.');
  return value;
}
function merge(base, added) {
  const result = { ...base };
  for (const [key, value] of Object.entries(added)) {
    if (['__proto__', 'prototype', 'constructor'].includes(key)) throw new Error('Unsupported config key.');
    if (value && typeof value === 'object' && !Array.isArray(value) &&
        result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
      result[key] = merge(result[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
const dir = path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'), 'opencode');
let existing = {};
let target = path.join(dir, 'opencode.json');
let original;
for (const name of ['opencode.json', 'opencode.jsonc']) {
  const file = path.join(dir, name);
  try {
    const stat = await fs.lstat(file);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Config must be a regular file: ' + file);
    const text = await fs.readFile(file, 'utf8');
    existing = merge(existing, parseConfig(text));
    target = file;
    original = text;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
const additions = {};
for (const [id, provider] of Object.entries(incoming.providers)) {
  const scopedId = namespace + '-' + id;
  const previous = existing.providers?.[scopedId];
  // A repeated import must not replace a locally configured key with a placeholder.
  if (previous?.settings?.apiKey) provider.settings.apiKey = previous.settings.apiKey;
  additions[scopedId] = provider;
}
const result = merge(existing, { providers: additions });
result.$schema ??= incoming.$schema;
result.model ??= namespace + '-' + incoming.model;
const output = JSON.stringify(result, null, 2) + '\n';
await fs.mkdir(dir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-') + '-' + randomUUID();
if (original !== undefined) {
  const backup = target + '.bak-' + stamp;
  await fs.writeFile(backup, original, { flag: 'wx', mode: 0o600 });
  console.log('Backup: ' + backup);
}
const temporary = target + '.tmp-' + stamp;
try {
  await fs.writeFile(temporary, output, { flag: 'wx', mode: 0o600 });
  if (original !== undefined && await fs.readFile(target, 'utf8') !== original) {
    throw new Error('Config changed during import; original file was not replaced.');
  }
  if (original === undefined) {
    // Exclusive creation also protects a config created while this script runs.
    await fs.copyFile(temporary, target, (await import('node:fs')).constants.COPYFILE_EXCL);
  } else {
    await fs.rename(temporary, target);
  }
} finally {
  await fs.rm(temporary, { force: true });
}
console.log('Saved: ' + target);
console.log('Replace <你的密钥> locally, then select a model using /models in OpenCode.');
`
  )
}
