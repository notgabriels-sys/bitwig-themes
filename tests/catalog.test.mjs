import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const catalog = JSON.parse(await readFile(new URL('../catalog.json', import.meta.url), 'utf8'));

// Independent source snapshots, extracted from VstThemeCatalog.hpp on
// 2026-09-10. Source file SHA-256:
// 3672fe335c56497ede1827811b54c32cca015a123c39aa1bd493614a7127a6b9
// Each signature hashes these 17 source-ordered uppercase #RRGGBB values,
// joined by a literal | with no trailing separator or newline. These constants
// must not be derived from the generator: they detect accidental source drift.
const sourceOrder = [
  'canvas', 'panel', 'panelRaised', 'control', 'controlHover', 'line',
  'lineStrong', 'text', 'textMuted', 'accent', 'accentBright', 'accentMuted',
  'focus', 'meter', 'success', 'warning', 'record',
];
const sourceSignatures = {
  black: 'dd53df0b03e97b165c609686da45f8f4e2612a6a332456e03b5c05472b8ce83a',
  terminal: '00d865d061099762fb35f1d52b78a59a3b1cbe9f4db7ffc72faf69fc45c4c597',
  obsidian: '5221c230b3cb085dead606cd4eab16fda69a57cb1831e96ed956360646c86955',
  ember: '43db5cf12eeacb2f883f7474e96a0655596963481d8e05d28c11f1d7c5aefae8',
  ultraviolet: 'db30c933affb4edac75a68cade8722beed4308ac03d4d101bde51254409413e0',
  moss: 'd459aca10d75c92a393969b8eb6e008eb6aba7c2f255dcb6dd96667fcc5ae572',
};

for (const [id, expectedSignature] of Object.entries(sourceSignatures)) {
  test(`${id} preserves all 17 original Granular Freeze colour tokens`, () => {
    const theme = catalog.themes.find((entry) => entry.id === id);
    assert.ok(theme, `Missing preserved source theme: ${id}`);
    assert.equal(theme.origin, 'granular-freeze');
    assert.deepEqual(Object.keys(theme.colors).sort(), [...sourceOrder].sort());
    const values = sourceOrder.map((role) => theme.colors[role]);
    for (const value of values) assert.match(value, /^#[0-9A-F]{6}$/);
    const actual = createHash('sha256').update(values.join('|')).digest('hex');
    assert.equal(actual, expectedSignature, `${id} differs from its preserved source palette`);
  });
}

test('Graphite stays an alias of the preserved Terminal palette', () => {
  assert.equal(catalog.defaultTheme, 'terminal');
  assert.ok(!catalog.themes.some((theme) => theme.id === 'graphite'));
  assert.deepEqual(catalog.themes.filter((theme) => theme.aliases.includes('graphite')).map((theme) => theme.id), ['terminal']);
});

test('only the six source snapshots are identified as inherited palettes', () => {
  assert.deepEqual(catalog.themes.filter((theme) => theme.origin === 'granular-freeze').map((theme) => theme.id).sort(), Object.keys(sourceSignatures).sort());
});
