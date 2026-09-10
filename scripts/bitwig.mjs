/** Original semantic mappings for Bitwig Theme Editor 2.x. No factory colours. */
export const COLOR_ROLES = Object.freeze({
  'Window background': 'canvas',
  'Grey 0': 'canvas', 'Grey 1': 'panel', 'Grey 2': 'panelRaised',
  'Grey 3': 'controlHover', 'Grey 4': 'line', 'Grey 5': 'control', 'Grey 6': 'lineStrong',
  'Panel Stroke (focused)': 'focus', 'Selected Dashboard Tree': 'controlHover',
  'Popup insert': 'lineStrong', 'Brighter': 'lineStrong',
  'Color of unselected tabs': 'canvas', 'Color of stroke between tabs': 'line',
  'Button stroke': 'line',
  'Accent (default)': 'accent', 'Implicit On (subtle)': 'accentMuted', 'Accent (hitech)': 'accentBright',
  'Warning': 'warning',
  'Menu background': 'panelRaised', 'Menu stroke': 'line', 'Menu text': 'text',
  'Menu Icon': 'textMuted', 'Menu description text': 'textMuted', 'Menu separator': 'lineStrong',
  'Scrollbar': 'lineStrong', 'Scrollbar background': 'canvas',
  'Modern Scrollbar Handle (active)': 'textMuted', 'Modern Scrollbar Handle (inactive)': 'lineStrong',
  'Modern Scrollbar Background (active)': 'control',
  'Subtle Light Text': 'text', 'Subtler Light Text': 'text', 'Medium Light Text': 'text',
  'Light Text': 'text', 'Lighter Text': 'text', 'Error Text': 'record',
  'Light Separator Line': 'lineStrong', 'Dark Panel Sub-frame Stroke': 'line',
  'Dark Panel Sub-frame Fill': 'panelRaised',
  'Knob Body': 'control', 'Knob Body Darkest': 'canvas', 'Knob Line': 'text',
  'Knob Stroke': 'lineStrong', 'Knob Emboss Highlight': 'text', 'Knob Emboss Shadow': 'canvas',
  'Knob Value Background': 'control', 'Knob Value Background (dark)': 'canvas',
  'Knob Value Color': 'accent', 'Led On': 'accentBright', 'Led Off': 'lineStrong',
  'Meter Normal': 'meter', 'Meter Yellow': 'warning', 'Meter Red': 'record',
  'Meter Gain Reduction': 'accentMuted', 'Meter Hitech': 'accentBright',
  'Meter Hitech Background': 'accentMuted', 'Meter Clipping': 'record', 'Meter Muted': 'textMuted',
  'Display Background': 'canvas', 'Display Stroke': 'line', 'Grey Display Background': 'panel',
  'Display Waveform': 'text',
  'Normal Toggle Icon': 'textMuted', 'Mouse Over Toggle Icon': 'text',
  'Active Toggle Icon (Playing)': 'success', 'Pressed Toggle Icon': 'text',
  'Tooltip Background': 'panelRaised', 'Tooltip Stroke': 'lineStrong',
  'Progress bar': 'accentBright', 'Progress background': 'panelRaised',
  'Hitcount background': 'panelRaised', 'Hitcount text color': 'text',
  'Close button mouse over background': 'controlHover', 'Close button pressed background': 'control',
  'Drop Indicator': 'focus', 'Popup overlay background color': 'panel',
  'Record button color': 'record', 'Record text color': 'record',
  'Dark tree background (selected)': 'controlHover', 'Dark tree selection frame': 'focus',
  'Dark tree background (standby selected)': 'panelRaised', 'Dark tree separator': 'line',
  'Dark tree text': 'text', 'Dark tree text (selected)': 'text',
  'Dark tree hover background change': 'text',
  'Audio Event Boundary': 'lineStrong', 'Audio Event Background': 'panel', 'Audio Event Waveform': 'textMuted',
  'Popup Notification Background': 'canvas',
  'Abstract Button Stroke': 'lineStrong', 'Abstract Button Selected Background': 'controlHover',
  'Abstract Button Unselected Background': 'control', 'Abstract Button Pressed Background': 'panelRaised',
  'Timeline edit tool chooser background': 'panelRaised',
  'Device Header': 'panelRaised', 'Device Header (selected)': 'controlHover',
  'The Grid (background)': 'canvas', 'The Grid (stroke)': 'line',
  'Background color of the modular environment.': 'canvas',
  'Record button color implicit': 'record', 'Record button glow color': 'record',
  'Automation button glow color': 'success', 'Plugin missing': 'record',
  'Timeline Tooltip Background': 'panelRaised', 'Timeline Tooltip Text': 'text',
  'Timeline Cue Marker': 'textMuted',
  'Time Selection Fill': 'accentMuted', 'Time Selection Implicit Fill': 'accentMuted',
  'Time Selection Stroke': 'focus', 'Time Selection Not Selected Fill': 'accentMuted',
  'Time Selection Not Selected Stroke': 'lineStrong', 'Time Selection Standby Fill': 'text',
  'Time Selection Standby Stroke': 'lineStrong', 'Time Selection Inactive Fill': 'text',
  'Time Selection Inactive Stroke': 'textMuted', 'Time Selection Across All Lanes Fill': 'accentMuted',
  'Time Selection Across All Lanes Stroke': 'focus', 'Time Selection Cursor Stroke': 'focus',
  'Time Selection Standby Cursor Stroke': 'textMuted',
  'Timeline Header Background Pattern': 'text', 'Timeline Header Tooltip Background': 'panelRaised',
  'Timeline Header Tooltip Text': 'text', 'Timeline Header Cue Marker': 'textMuted',
  'Header Time Selection Fill': 'accentMuted', 'Header Time Selection Stroke': 'focus',
  'Header Time Selection Standby Fill': 'text', 'Header Time Selection Standby Stroke': 'textMuted',
  'Header Time Selection Across All Lanes Fill': 'accentMuted',
  'Header Time Selection Across All Lanes Stroke': 'focus', 'Header Time Selection Cursor Stroke': 'focus',
  'Header Time Selection Standby Cursor Stroke': 'textMuted',
  'Clip Expression Background Color': 'panelRaised',
  'Invoke Action Background': 'panelRaised', 'Invoke Action Category': 'textMuted', 'Invoke Action Text': 'text',
  'Notification Button Background': 'control', 'Color bar button fill color': 'control',
  'Unselected Filled Automation Type Icon': 'textMuted', 'Unselected Empty Automation Type Icon': 'textMuted',
  'Loop Region Fill': 'panelRaised', 'Loop Region Stroke': 'lineStrong',
  'Loop Region Selected Fill': 'controlHover', 'Loop Region Selected Stroke': 'focus',
});

// Shared dark text, bright fields/lists, inverted icons, clip identity, mapping,
// connection colours and arbitrary future keys deliberately retain local values.
export const REQUIRED_BASE_KEYS = Object.freeze([
  'Default text', 'Dark Text', 'Light Text', 'Window background',
  'Grey 0', 'Grey 1', 'Grey 2', 'Grey 3', 'Grey 4', 'Grey 5', 'Grey 6',
  'Menu background', 'Menu text', 'Field background', 'List Item Background',
  'Tree Item Background', 'Display Background', 'Device Header', 'Meter Normal', 'Record button color',
]);

const HEX = /^#[\da-f]{6}(?:[\da-f]{2})?$/i;
const RGB = /^#[\da-f]{6}$/i;

/** Parse only the current flat BTE syntax; reject ambiguous or broken input. */
export function parseBte(text, { requireComplete = false } = {}) {
  if (typeof text !== 'string' || text.includes('\0')) throw new Error('BTE must be text without NUL bytes.');
  const entries = [];
  const keys = new Set();
  for (const [index, raw] of text.replace(/^\uFEFF/, '').split(/\r?\n/).entries()) {
    const line = raw.split('//', 1)[0].trim();
    if (!line) continue;
    const match = /^([^:]+): (\S+)$/.exec(line);
    if (!match) throw new Error(`Malformed BTE entry at line ${index + 1}: expected Key: value.`);
    const key = match[1].trim();
    const value = match[2];
    if (!key || key !== match[1]) throw new Error(`Malformed key at line ${index + 1}.`);
    if (keys.has(key)) throw new Error(`Duplicate BTE key: ${key}`);
    keys.add(key);
    if (key === 'Gradient') {
      if (!['true', 'false'].includes(value)) throw new Error('Gradient must be true or false.');
      entries.push({ key, value, type: 'setting' });
    } else {
      if (!HEX.test(value)) throw new Error(`Invalid colour for ${key}: expected #RRGGBB or #RRGGBBAA.`);
      entries.push({ key, value, type: 'color' });
    }
  }
  if (requireComplete) {
    const colorCount = entries.filter(entry => entry.type === 'color').length;
    if (colorCount < 200) throw new Error(`Base must be a complete local default.bte (at least 200 colour keys); got ${colorCount}.`);
    if (!keys.has('Gradient')) throw new Error('Base default.bte is missing Gradient.');
    const missing = REQUIRED_BASE_KEYS.filter(key => !keys.has(key));
    if (missing.length) throw new Error(`Base default.bte is missing required keys: ${missing.join(', ')}`);
  }
  return entries;
}

/** Merge original tokens into a user's complete local default, retaining alpha. */
export function renderBte(baseText, theme) {
  const entries = parseBte(baseText, { requireComplete: true });
  if (!theme || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(theme.id ?? '')) throw new Error('Invalid theme id.');
  if (typeof theme.name !== 'string' || !theme.name.trim() || /[\r\n\0]/.test(theme.name)) throw new Error('Invalid theme name.');
  for (const role of new Set(Object.values(COLOR_ROLES))) {
    if (!RGB.test(theme.colors?.[role] ?? '')) throw new Error(`Invalid or missing theme token: ${role}`);
  }
  let mapped = 0;
  const lines = entries.map(({ key, value, type }) => {
    const role = Object.hasOwn(COLOR_ROLES, key) ? COLOR_ROLES[key] : undefined;
    if (type !== 'color' || !role) return `${key}: ${value}`;
    mapped += 1;
    const alpha = value.length === 9 ? value.slice(7) : '';
    return `${key}: ${theme.colors[role].toUpperCase()}${alpha}`;
  });
  return {
    text: [
      `// Gabriel Bitwig Themes: ${theme.name} (${theme.id})`,
      '// Exported from a user-supplied local default.bte; this is a custom theme.',
      '// Original key order, unmapped values, Gradient and alpha bytes are retained.',
      '// Static export only; visual compatibility must be checked in your Bitwig version.',
      ...lines, '',
    ].join('\n'),
    colorCount: entries.filter(entry => entry.type === 'color').length,
    mappedCount: mapped,
    preservedCount: entries.filter(entry => entry.type === 'color').length - mapped,
  };
}
