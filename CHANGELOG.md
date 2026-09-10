# Changelog

## 0.1.1 · 10 September 2026

- Generate a complete `.bte` directly in the gallery from your own local `default.bte`; no Node.js installation is required for this route.
- Keep file contents in the browser. Validate size and structure, regenerate downloads when themes change, and clear invalid or superseded input.
- Reuse the CLI renderer in the browser and add 14 regression tests for local export and file-selection races.
- Update installation guidance and include the browser exporter in the downloadable package.

The collection remains a public preview. Visual compatibility inside Bitwig is pending; the 50 palettes and six preserved source palettes are unchanged.

## 0.1.0 · 10 September 2026

- Publish 50 distinct palettes in 10 groups, with six exact Granular Freeze source palettes and 44 original variations.
- Add the interactive gallery, palette SVGs, local CLI exporter, MIT licence and contribution guidance.
- Validate 100 exports against Bitwig 6.1 and 6.1.1 defaults and add 20 initial regression tests.
