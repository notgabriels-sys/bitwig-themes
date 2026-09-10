#!/usr/bin/env node
import { readFile, lstat, mkdir, open, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderBte } from './bitwig.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const HELP = `Export Gabriel themes using your own complete Bitwig default.bte.

Usage:
  node scripts/export-bitwig.mjs --list
  node scripts/export-bitwig.mjs --theme terminal --base /path/default.bte --out /path/terminal.bte
  node scripts/export-bitwig.mjs --all --base /path/default.bte --out /path/generated-directory
  node scripts/export-bitwig.mjs --help

Requires Node.js 22+. Writes new files only; existing outputs are never replaced.
The source is read-only. The tool does not patch Bitwig or install a live theme.
Use an ordinary export folder outside the .bitwig-theme-editor configuration.
Generated files incorporate your local defaults; keep them out of this repository.
`;

function parseOptions(args) {
  const options = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!['--theme', '--base', '--out', '--all', '--list', '--help'].includes(arg)) throw new Error(`Unknown argument: ${arg}`);
    const key = arg.slice(2);
    if (Object.hasOwn(options, key)) throw new Error(`Repeated argument: ${arg}`);
    if (['all', 'list', 'help'].includes(key)) options[key] = true;
    else {
      if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Missing value for ${arg}.`);
      options[key] = args[++i];
    }
  }
  if (options.help || options.list) {
    if (Object.keys(options).length !== 1) throw new Error('--help and --list must be used alone.');
  } else if (Boolean(options.theme) === Boolean(options.all) || !options.base || !options.out) {
    throw new Error('Choose exactly one of --theme or --all, and provide --base and --out.');
  }
  return options;
}

async function statOrNull(file) {
  try { return await lstat(file); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

// Resolve every existing component before writing. Symlink directories are also
// rejected so an innocent export path cannot resolve into the source or live UI.
async function checkOutput(file, basePath) {
  if (file === basePath) throw new Error('Output must not replace the base default.bte.');
  if (file.split(path.sep).some(segment => segment.toLowerCase() === '.bitwig-theme-editor' || /^Bitwig.*\.app$/i.test(segment))) {
    throw new Error('Choose an export folder outside Bitwig and .bitwig-theme-editor; this tool does not install themes.');
  }
  let cursor = path.parse(file).root;
  const parts = file.slice(cursor.length).split(path.sep).filter(Boolean);
  for (let i = 0; i < parts.length; i += 1) {
    cursor = path.join(cursor, parts[i]);
    const stat = await statOrNull(cursor);
    if (!stat) continue;
    if (stat.isSymbolicLink()) throw new Error(`Output path contains a symbolic link: ${cursor}`);
    if (i === parts.length - 1) throw new Error(`Output already exists; choose a new path: ${file}`);
    if (!stat.isDirectory()) throw new Error(`Output parent is not a directory: ${cursor}`);
  }
}

export async function main(args = process.argv.slice(2)) {
  const options = parseOptions(args);
  if (options.help) { console.log(HELP); return; }
  const catalog = JSON.parse(await readFile(path.join(ROOT, 'catalog.json'), 'utf8'));
  if (!Array.isArray(catalog.themes) || !catalog.themes.length) throw new Error('Catalog has no themes.');
  const seen = new Set();
  for (const theme of catalog.themes) {
    if (!Array.isArray(theme.aliases ?? [])) throw new Error('Catalog contains invalid theme aliases.');
    for (const identifier of [theme.id, ...(theme.aliases ?? [])]) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(identifier ?? '') || seen.has(identifier)) throw new Error('Catalog contains unsafe or ambiguous theme ids/aliases.');
      seen.add(identifier);
    }
  }
  if (options.list) {
    for (const theme of catalog.themes) console.log(`${theme.id}\t${theme.group}\t${theme.name}`);
    return;
  }
  const selected = options.all ? catalog.themes : catalog.themes.filter(theme => theme.id === options.theme || theme.aliases?.includes(options.theme));
  if (!selected.length) throw new Error(`Unknown theme: ${options.theme}. Use --list for exact ids.`);
  const basePath = await realpath(path.resolve(options.base));
  if (!(await lstat(basePath)).isFile()) throw new Error('Base must be a readable default.bte file.');
  const source = await readFile(basePath, 'utf8');
  const outputRoot = path.resolve(options.out);
  const plans = selected.map(theme => ({
    theme,
    file: options.all ? path.join(outputRoot, theme.group, `${theme.id}.bte`) : outputRoot,
    result: renderBte(source, theme),
  }));
  for (const plan of plans) {
    if (options.all && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(plan.theme.group ?? '')) throw new Error('Catalog contains an unsafe theme group.');
    await checkOutput(plan.file, basePath);
  }
  // Bulk preflight happens before mkdir/open: a known collision writes nothing.
  for (const { file, result } of plans) {
    await mkdir(path.dirname(file), { recursive: true });
    await checkOutput(file, basePath);
    const handle = await open(file, 'wx', 0o644);
    try { await handle.writeFile(result.text, 'utf8'); }
    finally { await handle.close(); }
    console.log(`Exported ${path.relative(process.cwd(), file)} (${result.mappedCount} mapped / ${result.colorCount} colour keys; alpha retained)`);
  }
  console.log(`Created ${plans.length} local export${plans.length === 1 ? '' : 's'}. Verify in your Bitwig version before sharing compatibility claims.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(`Export failed: ${error.message}`); process.exitCode = 1; });
}
