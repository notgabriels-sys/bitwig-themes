#!/usr/bin/env node
// The source of truth for the collection. Uses only the Node.js standard library.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const unknownArguments = process.argv.slice(2).filter((arg) => arg !== '--check');
if (unknownArguments.length) throw new Error(`Unknown argument: ${unknownArguments.join(' ')}`);

export const groups = [
  { id: 'graphite', name: 'Graphite', description: 'Neutral silver, ash and charcoal signals on the original graphite surfaces.' },
  { id: 'violet', name: 'Violet', description: 'Restrained violet and lavender signals, led by the original Ultraviolet palette.' },
  { id: 'ember', name: 'Ember', description: 'Muted red-orange, amber and warm clay signals.' },
  { id: 'blue-steel', name: 'Blue Steel', description: 'Desaturated steel blues, including the historically named Moss palette.' },
  { id: 'polar', name: 'Polar', description: 'Pale icy blues and cool mineral signals.' },
  { id: 'teal', name: 'Teal', description: 'Quiet blue-green signals with a cool studio character.' },
  { id: 'botanical', name: 'Botanical', description: 'Greyed leaf, sage and lichen greens.' },
  { id: 'copper', name: 'Copper', description: 'Earthy copper, bronze and ochre signals.' },
  { id: 'rose', name: 'Rose', description: 'Soft rose, plum and mauve signals.' },
  { id: 'high-contrast', name: 'High Contrast', description: 'Brighter signals and stronger text and boundary tokens on neutral black surfaces.' },
];

export const colorTokens = [
  'canvas', 'panel', 'panelRaised', 'control', 'controlHover', 'line',
  'lineStrong', 'text', 'textMuted', 'accent', 'accentBright', 'accentMuted',
  'focus', 'meter', 'success', 'warning', 'record',
];

// All nine surface, boundary and text values below are copied exactly from the
// current Granular Freeze source palette. They stay neutral in the extensions.
const originalBase = {
  canvas: '#0B0B0B', panel: '#17181A', panelRaised: '#1F2023',
  control: '#3B3E43', controlHover: '#27282B', line: '#2E2F33',
  lineStrong: '#585C62', text: '#E9EAEC', textMuted: '#A0A4AB',
};

const originalStatus = {
  success: '#63D38D', warning: '#F0B86E', record: '#F27683',
};

// Original accent values are explicit, not interpolated or reinterpreted.
// [accent, accentBright, accentMuted, focus, meter]
const originals = {
  terminal: ['#C9CFD6', '#D2D7DD', '#585C62', '#D2D7DD', '#C9CFD6'],
  black: ['#81858D', '#A0A4AB', '#4C4F54', '#A0A4AB', '#81858D'],
  obsidian: ['#D2D7DD', '#E9EAEC', '#696C70', '#E9EAEC', '#D2D7DD'],
  ultraviolet: ['#A78BFA', '#B8A2FF', '#55487E', '#B8A2FF', '#A78BFA'],
  ember: ['#B97A6C', '#F0B86E', '#704A42', '#F0B86E', '#B97A6C'],
  moss: ['#8FA8C0', '#D2D7DD', '#526476', '#D2D7DD', '#8FA8C0'],
};

// Each row is [id, name, group, description, accent, accentBright, accentMuted].
// The last three fields are omitted for preserved Granular Freeze originals.
const definitions = [
  ['terminal', 'Terminal / Graphite', 'graphite', 'The original cool-silver default; Terminal and Graphite share this exact palette.'],
  ['black', 'Black', 'graphite', 'The original low-key grey accent with cool-silver text.'],
  ['obsidian', 'Obsidian', 'graphite', 'The original bright silver accent, including its neutral warning token.'],
  ['slate', 'Slate', 'graphite', 'Balanced blue-grey signals for a quiet neutral workspace.', '#A5ADB8', '#C5CDD6', '#535B66'],
  ['ash', 'Ash', 'graphite', 'Warm grey signals with a soft mineral finish.', '#AAA79F', '#D2CFC6', '#5D5A54'],

  ['ultraviolet', 'Ultraviolet', 'violet', 'The original restrained neon-violet accent and lavender focus.',],
  ['iris', 'Iris', 'violet', 'Cool periwinkle signals with a pale violet focus.', '#9596D6', '#BABCEF', '#505173'],
  ['dusk', 'Dusk', 'violet', 'Dusty plum-violet signals with a gently lifted focus.', '#AF92BF', '#D0B7DD', '#614E6C'],
  ['violet-glass', 'Violet Glass', 'violet', 'Clear blue-violet signals for a cooler violet variation.', '#8F9DE7', '#B9C2F4', '#49557C'],
  ['lilac', 'Lilac', 'violet', 'Pale grey-lilac signals with low saturation.', '#BAA5CE', '#D8C7E7', '#67596F'],

  ['ember', 'Ember', 'ember', 'The original muted red-clay accent and warm amber focus.'],
  ['furnace', 'Furnace', 'ember', 'Muted brick-red signals lifted by a warm peach focus.', '#CA8778', '#E6B09C', '#704B45'],
  ['hearth', 'Hearth', 'ember', 'Soft burnt-orange signals with a warm gold focus.', '#CA9670', '#E7BC91', '#72543D'],
  ['cinder', 'Cinder', 'ember', 'Greyed terracotta signals with a pale clay focus.', '#B48A80', '#D9B2A6', '#65504A'],
  ['amber', 'Amber', 'ember', 'Restrained honey-gold signals with a pale amber focus.', '#C7A46B', '#E8CA92', '#6C593D'],

  ['moss', 'Moss', 'blue-steel', 'The original blue-steel palette; its historical Moss name is retained exactly.'],
  ['blueprint', 'Blueprint', 'blue-steel', 'Measured medium-blue signals with a cool pale-blue focus.', '#829FCB', '#ADC5E9', '#475971'],
  ['harbor', 'Harbor', 'blue-steel', 'Foggy blue-grey signals with a soft silver-blue focus.', '#92A9B6', '#BCD0D9', '#52616B'],
  ['steel', 'Steel', 'blue-steel', 'Cool industrial blue signals with restrained saturation.', '#8B9DB3', '#B8C7D9', '#4D5967'],
  ['dusk-blue', 'Dusk Blue', 'blue-steel', 'Smoky indigo-blue signals with a gentle blue focus.', '#909CC1', '#B9C4E2', '#505971'],

  ['frost', 'Frost', 'polar', 'Pale frost-blue signals against the neutral graphite base.', '#B4CEDB', '#D6E8EF', '#5D737F'],
  ['glacier', 'Glacier', 'polar', 'Cool glacial blue signals with a clear icy focus.', '#9DC7DA', '#C5E2EF', '#506F7D'],
  ['icefield', 'Icefield', 'polar', 'Greyed cyan-white signals with a quiet mineral finish.', '#B4D2D1', '#D7E9E7', '#607776'],
  ['quartz', 'Quartz', 'polar', 'Pale silver-lavender signals with a near-white focus.', '#C4C4D7', '#E1E0ED', '#6B6C7C'],
  ['moonlight', 'Moonlight', 'polar', 'Pale blue-silver signals with a cool luminous focus.', '#B8C4E0', '#D8E1F4', '#636E85'],

  ['petrol', 'Petrol', 'teal', 'Muted petrol-blue signals with a soft aqua focus.', '#78B2B8', '#A4D6D9', '#3E656A'],
  ['lagoon', 'Lagoon', 'teal', 'Greyed turquoise signals with a pale mint focus.', '#80BDB1', '#AEDCCF', '#446D64'],
  ['sonar', 'Sonar', 'teal', 'Quiet blue-cyan signals with a crisp cool focus.', '#7FAFC5', '#ADD3E4', '#445F6E'],
  ['tidepool', 'Tidepool', 'teal', 'Desaturated sea-green signals with a soft blue-green focus.', '#93B9AE', '#BDD8CF', '#50695F'],
  ['deep-water', 'Deep Water', 'teal', 'Slate-teal signals with a pale coastal-blue focus.', '#87ABAF', '#B1CDD0', '#496165'],

  ['sage', 'Sage', 'botanical', 'Grey-green signals with a calm silver-leaf focus.', '#A2B49A', '#CAD6C2', '#596650'],
  ['lichen', 'Lichen', 'botanical', 'Muted yellow-green signals with a pale mineral focus.', '#ADB68A', '#D2D9B1', '#61684A'],
  ['fern', 'Fern', 'botanical', 'Restrained leaf-green signals with a soft fresh-green focus.', '#88B49A', '#B2D6BD', '#486650'],
  ['willow', 'Willow', 'botanical', 'Pale olive-grey signals with a warm silver-green focus.', '#B1B49C', '#D6D8C3', '#636650'],
  ['eucalyptus', 'Eucalyptus', 'botanical', 'Cool silver-green signals with a pale mint-grey focus.', '#9BBBAD', '#C3DCCD', '#566B61'],

  ['copper', 'Copper', 'copper', 'Soft copper signals with a pale warm-metal focus.', '#BE947C', '#DEBCA4', '#6B523F'],
  ['bronze', 'Bronze', 'copper', 'Earthy bronze signals with a light sand focus.', '#B5A17B', '#D7C7A3', '#655A43'],
  ['ochre', 'Ochre', 'copper', 'Muted ochre signals with a warm parchment focus.', '#C0AA75', '#E1CD9B', '#6B5F40'],
  ['patina', 'Patina', 'copper', 'Greyed green-bronze signals with a warm mineral focus.', '#A9AD87', '#CFD0AF', '#5F6248'],
  ['burnished', 'Burnished', 'copper', 'Rose-brown metal signals with a soft polished-copper focus.', '#B79B90', '#D9BEB1', '#68564D'],

  ['dusty-rose', 'Dusty Rose', 'rose', 'Greyed rose signals with a pale pink focus.', '#C094A4', '#E0BAC8', '#6D505E'],
  ['mulberry', 'Mulberry', 'rose', 'Muted plum signals with a soft mauve focus.', '#B48EAE', '#D8B4D0', '#664E64'],
  ['mauve', 'Mauve', 'rose', 'Grey-lilac signals with a pale rose-lavender focus.', '#B6A0B9', '#D8C4DB', '#655967'],
  ['blossom', 'Blossom', 'rose', 'Soft coral-pink signals with a pale blush focus.', '#C89FA8', '#E7C4C9', '#715A5F'],
  ['velvet', 'Velvet', 'rose', 'Quiet wine-rose signals with a dusty pink focus.', '#AE8C9C', '#D3B3C1', '#624C59'],

  ['phosphor', 'Phosphor', 'high-contrast', 'Bright pale-green signals with stronger neutral text and boundaries.', '#C3E8B8', '#E0F5D8', '#708669'],
  ['porcelain', 'Porcelain', 'high-contrast', 'Near-white neutral signals with stronger text and boundaries.', '#F0F0E9', '#FFFFFF', '#858781'],
  ['signal-gold', 'Signal Gold', 'high-contrast', 'Pale gold signals with stronger neutral text and boundaries.', '#F0D29A', '#FFE8BC', '#88774F'],
  ['ice-signal', 'Ice Signal', 'high-contrast', 'Bright pale-blue signals with stronger neutral text and boundaries.', '#BEE7F5', '#E4F6FC', '#6A828C'],
  ['violet-signal', 'Violet Signal', 'high-contrast', 'Pale lavender signals with stronger neutral text and boundaries.', '#D7C5FF', '#EEE4FF', '#796D91'],
];

export const themes = definitions.map(([id, name, group, description, accent, bright, muted]) => {
  const preserved = originals[id];
  const accents = preserved ?? [accent, bright, muted, bright, accent];
  const highContrast = group === 'high-contrast';
  const tokens = {
    ...originalBase,
    ...(highContrast ? { lineStrong: '#989EA6', text: '#F4F5F6', textMuted: '#BDC3CB' } : {}),
    accent: accents[0], accentBright: accents[1], accentMuted: accents[2],
    focus: accents[3], meter: accents[4],
    ...originalStatus,
    ...(id === 'obsidian' ? { warning: '#A0A4AB' } : {}),
  };
  return {
    id, name, group, description,
    origin: preserved ? 'granular-freeze' : 'collection',
    aliases: id === 'terminal' ? ['graphite'] : [],
    colors: Object.fromEntries(colorTokens.map((token) => [token, tokens[token]])),
  };
});

export const catalog = { schemaVersion: 1, defaultTheme: 'terminal', groups, themes };

function luminance(hex) {
  const channels = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const [red, green, blue] = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function validate() {
  if (groups.length !== 10 || themes.length !== 50) throw new Error('Expected exactly ten groups and fifty themes.');
  if (new Set(themes.map((theme) => theme.id)).size !== 50) throw new Error('Theme IDs must be unique.');
  if (new Set(themes.map((theme) => JSON.stringify(theme.colors))).size !== 50) throw new Error('Every palette must be distinct.');
  if (themes.filter((theme) => theme.origin === 'granular-freeze').length !== 6) throw new Error('Expected six preserved source palettes.');
  const routes = new Set(themes.map((theme) => theme.id));
  for (const theme of themes) {
    if (!groups.some((group) => group.id === theme.group)) throw new Error(`Unknown group for ${theme.id}`);
    for (const alias of theme.aliases) {
      if (routes.has(alias)) throw new Error(`Duplicate theme route: ${alias}`);
      routes.add(alias);
    }
    if (Object.keys(theme.colors).join(',') !== colorTokens.join(',')) throw new Error(`Invalid token contract: ${theme.id}`);
    for (const [token, value] of Object.entries(theme.colors)) {
      if (!/^#[0-9A-F]{6}$/.test(value)) throw new Error(`Invalid colour ${theme.id}.${token}`);
    }
    for (const [front, back, minimum] of [['text', 'panelRaised', 4.5], ['textMuted', 'panel', 4.5], ['focus', 'panel', 3], ['accent', 'panel', 3]]) {
      if (contrast(theme.colors[front], theme.colors[back]) < minimum) throw new Error(`Insufficient ${front}/${back} contrast: ${theme.id}`);
    }
  }
  for (const group of groups) {
    if (themes.filter((theme) => theme.group === group.id).length !== 5) throw new Error(`Expected five themes in ${group.id}`);
  }
}

function paletteDocumentation() {
  const lines = [
    '# Palette reference', '',
    'This collection contains **50 distinct palettes in 10 groups of 5**. Six palettes preserve the current Granular Freeze source colours exactly; 44 are new collection extensions. The default is **Terminal / Graphite** (`terminal`).', '',
    'These are reusable interface colour tokens. They do not imply that Bitwig Studio accepts a theme file or that the collection has been tested in Bitwig Studio. See the repository compatibility notes before using an adapter.', '',
    '## Source preservation', '',
    'The source catalog has seven named entries: Black, Graphite, Obsidian, Ember, Ultraviolet, Moss, and Terminal / Bitwig. Graphite and Terminal have identical values for all 17 colour tokens, so this collection counts them once as **Terminal / Graphite**, with `graphite` as an alias. The other five preserved palettes keep their source names and all colour values. **Moss is historically named: its actual original accent is blue steel (`#8FA8C0`), so it belongs in Blue Steel rather than Botanical.** Obsidian also preserves its original neutral warning colour (`#A0A4AB`).', '',
    'Preserved palettes use `origin: "granular-freeze"`; extensions use `origin: "collection"`. This records colour provenance, not plugin or host validation. New variants are not added to the Granular Freeze plugin by this repository.', '',
    '## Files and regeneration', '',
    '- `catalog.json` contains the entire catalog, its default and group metadata.',
    '- `themes/<group>/<id>.json` contains one theme object with the same schema.',
    '- `scripts/build-catalog.mjs` holds the editable definitions and generates both JSON forms and this document with no external dependencies.',
    '- Run `node scripts/build-catalog.mjs` to regenerate; run `node scripts/build-catalog.mjs --check` to verify generated content without writing.', '',
    '## Token roles', '',
    '| Token | Intended use |',
    '| --- | --- |',
    '| `canvas` | Outer application or plugin background. |',
    '| `panel` | Main panel surface. |',
    '| `panelRaised` | Raised sections and inset content surfaces. |',
    '| `control` | Control surface from the source contract. |',
    '| `controlHover` | Hover surface from the source contract; intentionally darker than `control`. |',
    '| `line` | Subtle decorative dividers; not a sufficient state indicator alone. |',
    '| `lineStrong` | Stronger edges; validate their contrast in the actual component. |',
    '| `text` | Primary text. |',
    '| `textMuted` | Secondary text. |',
    '| `accent` | Sparse selected or active musical controls. |',
    '| `accentBright` | Brighter emphasis within the same accent family. |',
    '| `accentMuted` | Decorative accent fills; not body text or the only state indicator. |',
    '| `focus` | Visible keyboard focus indicator. |',
    '| `meter` | Measured values, with real data supplied by the application. |',
    '| `success`, `warning`, `record` | Semantic states; pair colour with labels or recognizable shapes. |', '',
    '## Contrast and restraint', '',
    'Every palette retains the original neutral canvas, panel, raised panel and control surfaces. High Contrast variants brighten `text`, `textMuted`, and `lineStrong`; their remaining surfaces are unchanged. Colour belongs on small active controls, focus rings, measured signals and labelled semantic states. Keep non-neutral colour at or below 22% of the visible interface as a design target; token data alone cannot enforce screen coverage.', '',
    'The generator checks sRGB relative-luminance contrast for every theme: primary text on raised panels at least **4.5:1**, secondary text on panels at least **4.5:1**, focus on panels at least **3:1**, and accents on panels at least **3:1**. These checks cover only the named opaque colour pairs. They are not a complete accessibility audit or a promise of legibility for every adapter, text size, opacity or state. High Contrast is a subgroup name, not an accessibility certification. Rounded ratios below are for reference; validation uses unrounded values.', '',
  ];
  for (const group of groups) {
    lines.push(`## ${group.name}`, '', group.description, '', '| Theme | ID | Origin | Accent | Focus | Text / raised panel | Secondary / panel | Accent / panel | Focus / panel |', '| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |');
    for (const theme of themes.filter((entry) => entry.group === group.id)) {
      const c = theme.colors;
      const ratios = [['text', 'panelRaised'], ['textMuted', 'panel'], ['accent', 'panel'], ['focus', 'panel']].map(([a, b]) => `${contrast(c[a], c[b]).toFixed(2)}:1`);
      lines.push(`| [${theme.name}](../themes/${theme.group}/${theme.id}.json) | \`${theme.id}\` | ${theme.origin === 'granular-freeze' ? 'Preserved' : 'New'} | \`${c.accent}\` | \`${c.focus}\` | ${ratios.join(' | ')} |`);
    }
    lines.push('');
  }
  return `${lines.join('\n').trimEnd()}\n`;
}

async function output(relativePath, contents) {
  const file = resolve(root, relativePath);
  if (checkOnly) {
    let current;
    try { current = await readFile(file, 'utf8'); }
    catch { throw new Error(`Generated file is missing: ${relativePath}`); }
    if (current !== contents) throw new Error(`Generated file differs: ${relativePath}; run node scripts/build-catalog.mjs`);
  } else {
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, contents, 'utf8');
  }
}

validate();
await output('catalog.json', `${JSON.stringify(catalog, null, 2)}\n`);
for (const theme of themes) await output(`themes/${theme.group}/${theme.id}.json`, `${JSON.stringify(theme, null, 2)}\n`);
await output('docs/PALETTES.md', paletteDocumentation());
console.log(`${checkOnly ? 'Verified' : 'Generated'} 50 distinct themes across 10 groups; 6 preserved palettes and 44 extensions. All required contrast pairs pass.`);
