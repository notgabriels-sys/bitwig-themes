#!/usr/bin/env node
/** Render deterministic colour charts from catalogue tokens. These are not DAW captures. */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(resolve(root, "catalog.json"), "utf8"));
const output = resolve(root, "assets/previews");
await mkdir(output, { recursive: true });
const escape = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const family = (theme) => catalog.groups.find((group) => group.id === theme.group)?.name || theme.group;
const rect = (x, y, w, h, fill, stroke = "none") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}"/>`;
const text = (x, y, content, { size = 14, fill = "#e4e6ed", mono = false, weight = 400, spacing = 0 } = {}) => `<text x="${x}" y="${y}" fill="${fill}" font-family="${mono ? "ui-monospace,monospace" : "Arial,Helvetica,sans-serif"}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}">${escape(content)}</text>`;
const svg = (width, height, title, description, contents) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description"><title id="title">${escape(title)}</title><desc id="description">${escape(description)}</desc>${contents}</svg>\n`;

for (const [index, theme] of catalog.themes.entries()) {
  const c = theme.colors;
  const chips = [["CANVAS", "canvas"], ["PANEL", "panel"], ["RAISED", "panelRaised"], ["ACCENT", "accent"], ["TEXT", "text"]];
  let content = rect(0, 0, 800, 500, c.canvas);
  content += text(40, 43, "BITWIG THEMES / PALETTE STUDY", { size: 10, mono: true, fill: c.textMuted, spacing: 1 });
  content += text(609, 43, "PREVIEW ONLY", { size: 10, mono: true, fill: c.accentBright, spacing: 1 });
  content += rect(40, 65, 720, 1, c.line);
  content += text(40, 115, family(theme).toUpperCase(), { size: 10, mono: true, fill: c.accentBright, spacing: 1.1 });
  content += text(40, 183, theme.name, { size: theme.name.length > 20 ? 39 : 49, fill: c.text });
  content += text(40, 222, "Graphite surfaces. Clear type. Room for colour.", { size: 16, fill: c.textMuted });
  const states = [["DEFAULT", c.control, c.line, c.text], ["HOVER", c.controlHover, c.lineStrong, c.text], ["SELECTED", c.accentMuted, c.accent, c.accentBright], ["FOCUS", c.control, c.focus, c.text]];
  for (const [stateIndex, [label, fill, line, ink]] of states.entries()) {
    const x = 40 + stateIndex * 184;
    content += text(x, 278, label, { size: 8, mono: true, fill: c.textMuted, spacing: 1 });
    content += rect(x, 290, 164, 39, fill, line);
    content += text(x + 15, 314, "Control state", { size: 11, fill: ink });
  }
  content += rect(40, 355, 720, 1, c.line);
  for (const [chipIndex, [label, token]] of chips.entries()) {
    const x = 40 + chipIndex * 146;
    content += rect(x, 379, 136, 32, c[token], c.line);
    content += text(x, 432, label, { size: 8, mono: true, fill: c.textMuted, spacing: .5 });
    content += text(x, 451, c[token].toUpperCase(), { size: 10, mono: true, fill: c.text });
  }
  content += text(40, 481, `${String(index + 1).padStart(2, "0")} / ${catalog.themes.length} · ${theme.id}`, { size: 8, mono: true, fill: c.textMuted });
  content += text(471, 481, "COLOUR CHART · NOT A DAW SCREENSHOT", { size: 8, mono: true, fill: c.textMuted, spacing: .4 });
  await writeFile(resolve(output, `${theme.id}.svg`), svg(800, 500, `${theme.name} palette`, `Illustrative palette study for ${theme.name}, ${family(theme)} family. Not a DAW screenshot. Theme has not been host-verified.`, content));
}

const width = 1440, margin = 48, gap = 15, columns = 5, cardWidth = (width - margin * 2 - gap * (columns - 1)) / columns;
const top = 208, cardHeight = 115, rowGap = 16, rows = Math.ceil(catalog.themes.length / columns), height = top + rows * (cardHeight + rowGap) + 76;
let overview = rect(0, 0, width, height, "#101115");
overview += text(margin, 47, "BITWIG THEMES / OPEN COLLECTION", { size: 11, mono: true, fill: "#a0a5b2", spacing: 1.2 });
overview += text(margin, 119, "Fifty palettes. Ten families.", { size: 51, fill: "#e4e6ed" });
overview += text(margin, 156, "Colour studies drawn from Granular Freeze. Preview only — not DAW screenshots.", { size: 15, fill: "#a0a5b2" });
overview += rect(margin, 181, width - margin * 2, 1, "#2c3039");
for (const [index, theme] of catalog.themes.entries()) {
  const c = theme.colors;
  const x = margin + (index % columns) * (cardWidth + gap), y = top + Math.floor(index / columns) * (cardHeight + rowGap);
  overview += rect(x, y, cardWidth, cardHeight, c.canvas, "#333640");
  overview += text(x + 13, y + 23, theme.name, { size: 12, fill: c.text });
  overview += text(x + 13, y + 42, family(theme), { size: 9, fill: c.textMuted });
  const swatches = ["panel", "panelRaised", "accentMuted", "accent", "accentBright", "text"];
  const chipWidth = (cardWidth - 26 - 5 * 5) / 6;
  for (const [chipIndex, token] of swatches.entries()) overview += rect(x + 13 + chipIndex * (chipWidth + 5), y + 58, chipWidth, 25, c[token], c.line);
  overview += text(x + 13, y + 101, `${String(index + 1).padStart(2, "0")} / ${theme.id}`, { size: 7, mono: true, fill: c.textMuted });
}
overview += text(margin, height - 40, "UNOFFICIAL COMMUNITY PROJECT · NEW THEME SET NOT HOST-VERIFIED", { size: 10, mono: true, fill: "#a0a5b2", spacing: .6 });
overview += text(959, height - 40, "github.com/notgabriels-sys/bitwig-themes", { size: 10, mono: true, fill: "#bea0f4" });
await writeFile(resolve(output, "overview.svg"), svg(width, height, "Bitwig Themes — 50 palettes in 10 families", "An index of all 50 palette studies. Each chart shows actual catalogue colours. These are illustrative colour charts, not DAW screenshots or evidence of host verification.", overview));
console.log(`Generated ${catalog.themes.length} palette SVGs and assets/previews/overview.svg`);
