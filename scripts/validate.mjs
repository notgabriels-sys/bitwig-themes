#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = p => readFile(path.join(root, p), 'utf8');
const catalog = JSON.parse(await read('catalog.json'));
const roles = ['canvas', 'panel', 'panelRaised', 'control', 'controlHover', 'line', 'lineStrong', 'text', 'textMuted', 'accent', 'accentBright', 'accentMuted', 'focus', 'meter', 'success', 'warning', 'record'];
assert.equal(catalog.schemaVersion, 1);
assert.equal(catalog.themes.length, 50, 'Exactly 50 theme entries required');
assert.equal(catalog.groups.length, 10, 'Exactly 10 groups required');
assert.equal(catalog.defaultTheme, 'terminal');
const lum = hex => hex.slice(1).match(/../g).map(v => parseInt(v, 16) / 255)
  .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
  .reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0);
const ratio = (a, b) => (Math.max(lum(a), lum(b)) + .05) / (Math.min(lum(a), lum(b)) + .05);
const ids = new Set();
const signatures = new Set();
const groups = new Set(catalog.groups.map(g => g.id));
assert.equal(groups.size, 10);
const floors = { text: Infinity, muted: Infinity, accent: Infinity, focus: Infinity };
for (const t of catalog.themes) {
  assert.match(t.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(!ids.has(t.id), `Duplicate id ${t.id}`);
  ids.add(t.id);
  assert.ok(groups.has(t.group), `Unknown group ${t.group}`);
  assert.ok(t.name && t.description);
  assert.ok(['granular-freeze', 'collection'].includes(t.origin));
  assert.ok(Array.isArray(t.aliases));
  assert.deepEqual(Object.keys(t.colors).sort(), [...roles].sort());
  for (const color of Object.values(t.colors)) assert.match(color, /^#[A-F0-9]{6}$/);
  const signature = roles.map(r => t.colors[r]).join('|');
  assert.ok(!signatures.has(signature), `Duplicate complete palette ${t.id}`);
  signatures.add(signature);
  const measured = {
    text: ratio(t.colors.text, t.colors.panelRaised),
    muted: ratio(t.colors.textMuted, t.colors.panel),
    accent: ratio(t.colors.accent, t.colors.panel),
    focus: ratio(t.colors.focus, t.colors.panel)
  };
  for (const [role, value] of Object.entries(measured)) {
    floors[role] = Math.min(floors[role], value);
    assert.ok(value >= (['text', 'muted'].includes(role) ? 4.5 : 3), `${t.id} ${role} contrast ${value}`);
  }
  for (const r of ['canvas', 'panel', 'panelRaised', 'control', 'controlHover']) {
    const rgb = t.colors[r].slice(1).match(/../g).map(v => parseInt(v, 16));
    assert.ok(Math.max(...rgb) - Math.min(...rgb) <= 16, `${t.id} ${r} must remain neutral`);
    assert.ok(lum(t.colors[r]) < .1, `${t.id} ${r} must remain dark`);
  }
  assert.deepEqual(JSON.parse(await read(`themes/${t.group}/${t.id}.json`)), t);
  const preview = await read(`assets/previews/${t.id}.svg`);
  assert.ok(preview.includes('<svg'), `Missing SVG ${t.id}`);
  for (const color of [t.colors.canvas, t.colors.panel, t.colors.accent, t.colors.text])
    assert.ok(preview.toUpperCase().includes(color), `${t.id} preview must use exact ${color}`);
}
for (const group of catalog.groups) {
  assert.equal(catalog.themes.filter(t => t.group === group.id).length, 5, `${group.id} must have five themes`);
  const files = (await readdir(path.join(root, 'themes', group.id))).filter(f => f.endsWith('.json'));
  assert.equal(files.length, 5, `Unexpected theme file in ${group.id}`);
}
const aliases = new Set(ids);
for (const t of catalog.themes) for (const alias of t.aliases) {
  assert.match(alias, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(!aliases.has(alias), `Ambiguous alias ${alias}`);
  aliases.add(alias);
}
assert.deepEqual(catalog.themes.filter(t => t.origin === 'granular-freeze').map(t => t.id).sort(),
  ['black', 'ember', 'moss', 'obsidian', 'terminal', 'ultraviolet']);
assert.ok(catalog.themes.find(t => t.id === 'terminal').aliases.includes('graphite'));
const overview = await read('assets/previews/overview.svg');
assert.ok(overview.includes('<svg'));
console.log(`PASS: 50 distinct palettes, 10 groups × 5, 17 valid tokens, six inherited palettes, unambiguous aliases, matching JSON and SVG files.`);
console.log('Minimum token contrast:', Object.fromEntries(Object.entries(floors).map(([k,v]) => [k, `${v.toFixed(2)}:1`])));
console.log('Scope: opaque palette tokens only. Bitwig surfaces, alpha blends and complete application accessibility require host inspection.');
