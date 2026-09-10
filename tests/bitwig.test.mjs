import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, realpath, symlink, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { COLOR_ROLES, REQUIRED_BASE_KEYS, parseBte, renderBte } from '../scripts/bitwig.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const catalog = JSON.parse(await readFile(path.join(ROOT, 'catalog.json'), 'utf8'));
const theme = catalog.themes[0];

// Entirely invented fixture colours; no Bitwig factory file or colour values.
function fixture(extra = {}) {
  const colors = Object.fromEntries([...new Set([...REQUIRED_BASE_KEYS, ...Object.keys(COLOR_ROLES)])].map(key => [key, '#193B57']));
  Object.assign(colors, {
    'Subtle Light Text': '#5278B63c', 'Time Selection Fill': '#7193B400',
    'Clip': '#4986AE', 'Clip Content Automation Stroke Color': '#7BA592',
    'Audio connection in modular environment': '#39B9D2',
    'Future vendor colour': '#7456C890', ...extra,
  });
  while (Object.keys(colors).length < 220) colors[`Synthetic fixture colour ${Object.keys(colors).length}`] = '#7398B2';
  return '// Default color values for invented test fixture\n// This file is auto-generated, please DO NOT edit.\nGradient: true\n' +
    Object.entries(colors).map(([key, value]) => `${key}: ${value}`).join('\n') + '\n';
}

async function temp(t) {
  const dir = await mkdtemp(path.join(await realpath(tmpdir()), 'gabriel-bte-test-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return dir;
}

function cli(args) {
  return spawnSync(process.execPath, [path.join(ROOT, 'scripts/export-bitwig.mjs'), ...args], { cwd: ROOT, encoding: 'utf8' });
}

test('parser accepts comments, CRLF and BOM, while preserving settings and alpha', () => {
  assert.deepEqual(parseBte('\uFEFF// Comment\r\nGradient: false\r\nA: #193B573c // alpha\r\n'), [
    { key: 'Gradient', value: 'false', type: 'setting' }, { key: 'A', value: '#193B573c', type: 'color' },
  ]);
});

test('parser rejects malformed hex, spacing, duplicate keys and unknown settings', () => {
  for (const value of ['#XYZ123', '#12345', '#123456789', '#1234', 'red']) assert.throws(() => parseBte(`A: ${value}`), /Invalid colour/);
  assert.throws(() => parseBte('A:#123456'), /Malformed/);
  assert.throws(() => parseBte('A: #123456\nA: #654321'), /Duplicate/);
  assert.throws(() => parseBte('Gradient: maybe'), /Gradient/);
  assert.throws(() => parseBte('FutureSetting: true'), /Invalid colour/);
  assert.throws(() => parseBte('A: #123456\0'), /NUL/);
});

test('complete bases need both sufficient colour count and core semantic anchors', () => {
  assert.throws(() => renderBte('Gradient: false\nWindow background: #193B57', theme), /complete local default/);
  assert.throws(() => renderBte(fixture().replace('Default text: #193B57\n', ''), theme), /missing required keys/);
  assert.throws(() => renderBte(fixture().replace('Gradient: true\n', ''), theme), /missing Gradient/);
});

test('render preserves exact key order, unknown values, semantic colours and every alpha byte', () => {
  const source = fixture();
  const before = parseBte(source);
  const result = renderBte(source, theme);
  const after = parseBte(result.text);
  assert.deepEqual(after.map(e => e.key), before.map(e => e.key));
  for (let i = 0; i < before.length; i += 1) {
    const old = before[i];
    if (old.value.length === 9) assert.equal(after[i].value.slice(7), old.value.slice(7), old.key);
    if (!Object.hasOwn(COLOR_ROLES, old.key)) assert.equal(after[i].value, old.value, old.key);
  }
  const values = Object.fromEntries(after.map(e => [e.key, e.value]));
  assert.equal(values['Window background'], theme.colors.canvas.toUpperCase());
  assert.equal(values['Default text'], '#193B57');
  assert.equal(values['Dark Text'], '#193B57');
  assert.equal(values['Field background'], '#193B57');
  assert.equal(values['Clip'], '#4986AE');
  assert.equal(values['Clip Content Automation Stroke Color'], '#7BA592');
  assert.equal(values['Audio connection in modular environment'], '#39B9D2');
  assert.equal(values['Time Selection Fill'].slice(-2), '00');
  assert.equal(values.Gradient, 'true');
  assert.ok(!result.text.includes('Default color values'));
  assert.ok(!result.text.includes('please DO NOT edit'));
  assert.ok(result.text.includes('this is a custom theme'));
});

test('render checks theme identity and RGB tokens', () => {
  assert.throws(() => renderBte(fixture(), { ...theme, id: '../outside' }), /theme id/);
  assert.throws(() => renderBte(fixture(), { ...theme, name: 'name\nGradient: false' }), /theme name/);
  assert.throws(() => renderBte(fixture(), { ...theme, colors: { ...theme.colors, canvas: '#12345678' } }), /theme token/);
});

test('every theme retains an increasing Grey 0 to Grey 6 luminance ramp', () => {
  const luminance = hex => {
    const linear = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
      .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  for (const item of catalog.themes) {
    const values = Object.fromEntries(parseBte(renderBte(fixture(), item).text).map(entry => [entry.key, entry.value]));
    for (let i = 1; i <= 6; i += 1) {
      assert.ok(luminance(values[`Grey ${i}`]) > luminance(values[`Grey ${i - 1}`]), `${item.id}: Grey ${i - 1} must be darker than Grey ${i}`);
    }
  }
});

test('CLI single export creates new file and leaves base byte-for-byte unchanged', async t => {
  const dir = await temp(t), base = path.join(dir, 'default.bte'), out = path.join(dir, 'custom.bte');
  const source = fixture();
  await writeFile(base, source);
  const run = cli(['--theme', theme.id, '--base', base, '--out', out]);
  assert.equal(run.status, 0, run.stderr);
  assert.equal(await readFile(base, 'utf8'), source);
  assert.equal(await readFile(out, 'utf8'), renderBte(source, theme).text);
  assert.notEqual(cli(['--theme', theme.id, '--base', base, '--out', out]).status, 0);
  assert.equal(await readFile(out, 'utf8'), renderBte(source, theme).text);
});

test('CLI rejects base overwrite, symlinks and live configuration targets', async t => {
  const dir = await temp(t), base = path.join(dir, 'default.bte');
  await writeFile(base, fixture());
  const run = out => cli(['--theme', theme.id, '--base', base, '--out', out]);
  assert.match(run(base).stderr, /must not replace/);
  const alias = path.join(dir, 'alias.bte');
  await symlink(base, alias);
  assert.match(run(alias).stderr, /symbolic link/);
  const actual = path.join(dir, 'actual');
  await mkdir(actual);
  await symlink(actual, path.join(dir, 'linked-folder'));
  assert.match(run(path.join(dir, 'linked-folder', 'new.bte')).stderr, /symbolic link/);
  assert.match(run(path.join(dir, '.bitwig-theme-editor', 'theme.bte')).stderr, /does not install/);
  assert.match(run(path.join(dir, '.BITWIG-THEME-EDITOR', 'theme.bte')).stderr, /does not install/);
});

test('CLI resolves the graphite alias to the exact terminal theme', async t => {
  const dir = await temp(t), base = path.join(dir, 'default.bte'), out = path.join(dir, 'alias-export.bte');
  const source = fixture();
  await writeFile(base, source);
  const run = cli(['--theme', 'graphite', '--base', base, '--out', out]);
  assert.equal(run.status, 0, run.stderr);
  assert.equal(await readFile(out, 'utf8'), renderBte(source, catalog.themes.find(item => item.id === 'terminal')).text);
});

test('CLI bulk export preflights all conflicts before writing', async t => {
  const dir = await temp(t), base = path.join(dir, 'default.bte'), out = path.join(dir, 'bulk');
  await writeFile(base, fixture());
  const last = catalog.themes.at(-1);
  const conflict = path.join(out, last.group, `${last.id}.bte`);
  await mkdir(path.dirname(conflict), { recursive: true });
  await writeFile(conflict, 'existing');
  const run = cli(['--all', '--base', base, '--out', out]);
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /already exists/);
  assert.equal(await readFile(conflict, 'utf8'), 'existing');
  assert.deepEqual(await readdir(out), [last.group]);
  assert.deepEqual(await readdir(path.dirname(conflict)), [`${last.id}.bte`]);
});

test('CLI exports every catalog theme into its family without changing source', async t => {
  const dir = await temp(t), base = path.join(dir, 'default.bte'), out = path.join(dir, 'bulk');
  const source = fixture();
  await writeFile(base, source);
  const run = cli(['--all', '--base', base, '--out', out]);
  assert.equal(run.status, 0, run.stderr);
  for (const item of catalog.themes) {
    const actual = await readFile(path.join(out, item.group, `${item.id}.bte`), 'utf8');
    assert.equal(actual, renderBte(source, item).text);
  }
  assert.equal(await readFile(base, 'utf8'), source);
});

test('CLI rejects theme traversal, missing options, duplicate arguments and unknown flags', () => {
  for (const args of [[], ['--theme', '../outside', '--base', 'none', '--out', 'none'], ['--all'], ['--wat'], ['--list', '--all'], ['--all', '--all'], ['--theme', '--base']]) {
    assert.notEqual(cli(args).status, 0, JSON.stringify(args));
  }
  assert.equal(cli(['--help']).status, 0);
  const list = cli(['--list']);
  assert.equal(list.status, 0, list.stderr);
  assert.equal(list.stdout.trim().split('\n').length, catalog.themes.length);
});
