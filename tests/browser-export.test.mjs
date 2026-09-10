import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolveObjectURL } from 'node:buffer';
import { MAX_BASE_BYTES, readDefaultFile, initBrowserExport } from '../assets/browser-export.js';
import { COLOR_ROLES, REQUIRED_BASE_KEYS, renderBte } from '../scripts/bitwig.mjs';

const { themes } = JSON.parse(await readFile(new URL('../catalog.json', import.meta.url), 'utf8'));
const terminal = themes.find(theme => theme.id === 'terminal');
const ultraviolet = themes.find(theme => theme.id === 'ultraviolet');

// Invented complete-format test data, never a Bitwig factory colour file.
function fixture(unmapped = '#7295B3') {
  const colors = Object.fromEntries([...new Set([...REQUIRED_BASE_KEYS, ...Object.keys(COLOR_ROLES)])].map(key => [key, '#27496B']));
  Object.assign(colors, { 'Browser test future key': unmapped, 'Time Selection Fill': '#6294A83c' });
  while (Object.keys(colors).length < 220) colors[`Browser synthetic key ${Object.keys(colors).length}`] = '#819AB6';
  return `// Invented browser test fixture\nGradient: false\n${Object.entries(colors).map(([key, value]) => `${key}: ${value}`).join('\n')}\n`;
}

const asFile = (text, name = 'default.bte') => new File([text], name, { type: 'text/plain' });
const settle = () => new Promise(resolve => setImmediate(resolve));
function deferred() {
  let resolve, reject;
  const promise = new Promise((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
}

// Only the platform APIs used by these controls are represented. A textContent
// sink is supported; an accidental switch to an HTML sink fails immediately.
class Control extends EventTarget {
  attributes = new Map();
  files = [];
  dataset = {};
  disabled = false;
  textContent = '';
  currentValue = '';
  set value(value) { this.currentValue = value; if (value === '') this.files = []; }
  get value() { return this.currentValue; }
  set href(value) { this.setAttribute('href', value); }
  get href() { return this.getAttribute('href') ?? ''; }
  set download(value) { this.setAttribute('download', value); }
  get download() { return this.getAttribute('download') ?? ''; }
  set innerHTML(_value) { throw new Error('File-derived content must not use an HTML sink'); }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  removeAttribute(name) { this.attributes.delete(name); }
}

function harness(t, selected = terminal) {
  const controls = Object.fromEntries(['fileInput', 'downloadLink', 'status', 'clearButton'].map(name => [name, new Control()]));
  const controller = initBrowserExport(controls);
  if (selected) controller.setTheme(selected);
  t.after(() => controller.clear());
  const choose = (file) => {
    controls.fileInput.value = file ? `C:\\fakepath\\${file.name}` : '';
    controls.fileInput.files = file ? [file] : [];
    controls.fileInput.dispatchEvent(new Event('change'));
  };
  const disabled = () => {
    assert.equal(controls.downloadLink.getAttribute('href'), null);
    assert.equal(controls.downloadLink.getAttribute('aria-disabled'), 'true');
    const click = new Event('click', { cancelable: true });
    controls.downloadLink.dispatchEvent(click);
    assert.ok(click.defaultPrevented, 'Disabled export must not navigate');
  };
  const output = async () => {
    assert.notEqual(controls.downloadLink.getAttribute('aria-disabled'), 'true');
    const blob = resolveObjectURL(controls.downloadLink.href);
    assert.ok(blob, 'Export URL must refer to a live Blob');
    return blob.text();
  };
  return { ...controls, controller, choose, disabled, output };
}

test('local file reader rejects missing, empty, malformed and sparse defaults', async () => {
  await assert.rejects(readDefaultFile(null), /Choose/);
  await assert.rejects(readDefaultFile(asFile('')), /empty/);
  await assert.rejects(readDefaultFile(asFile('not a theme')), /Malformed/);
  await assert.rejects(readDefaultFile(asFile('Gradient: true\nWindow background: #27496B')), /complete local default/);
});

test('2 MiB limit is checked before file contents are read', async () => {
  assert.equal(MAX_BASE_BYTES, 2 * 1024 * 1024);
  const oversized = asFile('x'.repeat(MAX_BASE_BYTES + 1));
  let reads = 0;
  oversized.text = async () => { reads += 1; return fixture(); };
  await assert.rejects(readDefaultFile(oversized), /too large/);
  assert.equal(reads, 0);
});

test('reader accepts exactly 2 MiB and preserves validated source text', async () => {
  const source = fixture();
  const atLimit = `${source}//${'x'.repeat(MAX_BASE_BYTES - Buffer.byteLength(source) - 2)}`;
  const file = asFile(atLimit);
  assert.equal(file.size, MAX_BASE_BYTES);
  assert.equal(await readDefaultFile(file), atLimit);
});

test('browser export uses the shared renderer and current selected theme without network access', async t => {
  const network = t.mock.method(globalThis, 'fetch', async () => { throw new Error('Local file export must not use the network'); });
  const h = harness(t);
  h.disabled();
  const source = fixture();
  h.choose(asFile(source));
  await settle();
  assert.equal(await h.output(), renderBte(source, terminal).text);
  assert.equal(h.downloadLink.download, 'terminal.bte');
  const firstUrl = h.downloadLink.href;
  h.controller.setTheme(ultraviolet);
  assert.equal(await h.output(), renderBte(source, ultraviolet).text);
  assert.equal(h.downloadLink.download, 'ultraviolet.bte');
  assert.equal(resolveObjectURL(firstUrl), undefined, 'Replaced Blob must be released');
  assert.equal(network.mock.callCount(), 0);
});

test('a file selected before catalog readiness exports only after a theme is provided', async t => {
  const h = harness(t, null), source = fixture();
  h.choose(asFile(source));
  await settle();
  h.disabled();
  h.controller.setTheme(ultraviolet);
  assert.equal(await h.output(), renderBte(source, ultraviolet).text);
});

test('theme changes during a pending file read are reflected in the completed download', async t => {
  const h = harness(t), reading = deferred(), source = fixture();
  h.choose({ name: 'pending.bte', size: source.length, text: () => reading.promise });
  h.controller.setTheme(ultraviolet);
  h.disabled();
  reading.resolve(source);
  await settle();
  assert.equal(await h.output(), renderBte(source, ultraviolet).text);
});

for (const lateResult of ['success', 'failure']) {
  test(`a later file selection wins over an earlier read's late ${lateResult}`, async t => {
    const h = harness(t), earlier = deferred();
    const oldSource = fixture('#AB819C'), newSource = fixture('#79B28C');
    h.choose({ name: 'earlier.bte', size: oldSource.length, text: () => earlier.promise });
    h.choose(asFile(newSource, 'latest.bte'));
    await settle();
    const latestUrl = h.downloadLink.href;
    const latestStatus = h.status.textContent;
    if (lateResult === 'success') earlier.resolve(oldSource);
    else earlier.reject(new Error('late read failure'));
    await settle();
    assert.equal(h.downloadLink.href, latestUrl);
    assert.equal(h.status.textContent, latestStatus);
    assert.equal(await h.output(), renderBte(newSource, terminal).text);
  });
}

test('an invalid replacement immediately removes the old download and permits retrying the same filename', async t => {
  const h = harness(t), source = fixture();
  h.choose(asFile(source));
  await settle();
  const oldUrl = h.downloadLink.href;
  h.choose(asFile('invalid', 'default.bte'));
  h.disabled();
  assert.equal(resolveObjectURL(oldUrl), undefined);
  await settle();
  h.disabled();
  assert.equal(h.fileInput.value, '');
  assert.equal(h.clearButton.disabled, true);
  assert.equal(h.status.dataset.state, 'error');
  h.choose(asFile(source, 'default.bte'));
  await settle();
  assert.equal(await h.output(), renderBte(source, terminal).text);
});

test('clearing a loaded file revokes its Blob and removes file chooser state', async t => {
  const h = harness(t);
  h.choose(asFile(fixture()));
  await settle();
  const oldUrl = h.downloadLink.href;
  h.clearButton.dispatchEvent(new Event('click'));
  h.disabled();
  assert.equal(resolveObjectURL(oldUrl), undefined);
  assert.equal(h.fileInput.value, '');
  assert.equal(h.clearButton.disabled, true);
  h.controller.setTheme(ultraviolet);
  h.disabled();
});

for (const lateResult of ['success', 'failure']) {
  test(`clear during a pending read survives its late ${lateResult}`, async t => {
    const h = harness(t), reading = deferred(), source = fixture();
    h.choose({ name: 'pending.bte', size: source.length, text: () => reading.promise });
    h.controller.clear();
    const clearedStatus = h.status.textContent;
    if (lateResult === 'success') reading.resolve(source);
    else reading.reject(new Error('late read failure'));
    await settle();
    h.disabled();
    assert.equal(h.status.textContent, clearedStatus);
    assert.equal(h.fileInput.value, '');
  });
}

test('cancelled file selection clears the previous generated download', async t => {
  const h = harness(t);
  h.choose(asFile(fixture()));
  await settle();
  const oldUrl = h.downloadLink.href;
  h.choose(null);
  h.disabled();
  assert.equal(resolveObjectURL(oldUrl), undefined);
  assert.equal(h.clearButton.disabled, true);
});

test('untrusted filenames and parser errors are rendered only as text', async t => {
  const h = harness(t);
  const filename = '<img src=x onerror=alert(1)>.bte';
  h.choose(asFile(fixture(), filename));
  await settle();
  assert.ok(h.status.textContent.includes(filename));
  assert.equal(h.status.dataset.state, 'ready');
  h.choose(asFile('<script>alert(1)</script>: invalid'));
  await settle();
  h.disabled();
  assert.equal(h.status.dataset.state, 'error');
  assert.ok(h.status.textContent.includes('<script>'));
});
