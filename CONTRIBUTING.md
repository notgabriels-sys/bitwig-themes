# Contributing

Clear compatibility reports, legibility fixes and restrained colour variations are welcome. Start with an issue for a new family or a change to one of the six Granular Freeze source palettes.

## Work locally

Use Node.js 22 or later. There are no npm dependencies.

```sh
npm run build
npm run check
npm test
```

Palette definitions live in `scripts/build-catalog.mjs`. Edit the definitions and regenerate the catalogue, individual JSON files, palette index and SVG previews. Commit both the source change and generated files. Keep the 50-entry/10-family contract unless a future release deliberately revises it.

## Colour contract

- Retain dark neutral surfaces and readable text. Large saturated backgrounds do not belong in this collection.
- Keep the 17 semantic tokens and unique stable IDs. Never repurpose a saved theme ID for an unrelated look.
- Text on raised panels and muted text on panels must reach 4.5:1 in the token check; focus and accent on panels must reach 3:1. These are token checks, not certification of a complete DAW interface.
- Preserve the exact six inherited source palettes. Their provenance matters; propose changes with a reason and visible evidence.
- Keep record, warning and success separate from decorative accents. Avoid changing clip colours, routing semantics or alpha values without specific evidence and a reviewed mapping change.

## Screenshots and compatibility

Report the exact Bitwig version, Theme Editor version, OS, theme name and affected control or area. An authentic screenshot can be useful: remove personal project names, file paths and unreleased material before sharing. State whether it is a real DAW capture or a palette study. Never submit generated/fake host images as installation evidence.

Test in a saved or blank session, preserve your original theme and follow upstream recovery steps. Windows and Linux reports are especially welcome because this repository's live validation started on macOS.

## Review

Keep changes focused. Explain the problem, expected behaviour and checks you actually ran. Respect other contributors and keep reports specific. Include appropriate attribution for code you reuse. Third-party fonts, skins, DAW defaults and proprietary binaries do not belong in a palette contribution.
