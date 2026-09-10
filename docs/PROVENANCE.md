# Palette provenance

The collection begins with the current local Granular Freeze appearance catalogue, inspected on 10 September 2026: `mini-vsts/drum-common/include/drumcommon/VstThemeCatalog.hpp`, included by `src/GranularFreezeAppearance.h`.

Source file SHA-256 at extraction:

```text
3672fe335c56497ede1827811b54c32cca015a123c39aa1bd493614a7127a6b9
```

This is a file-level source observation, not an identification of a released or host-tested plug-in binary. The plug-in source tree and binary are not included here.

The source exposed seven names: Black, Graphite, Obsidian, Ember, Ultraviolet, Moss and Terminal / Bitwig. Graphite and Terminal had identical values in all 17 colour fields. This collection preserves their six unique palettes exactly and adds 44 original variations. The `graphite` alias resolves to `terminal`; it does not inflate the count. Moss retains its historical name and exact cool blue-grey colours.

All 50 entries have distinct complete token palettes. Colour themes are appearance data only. This repository does not change Granular Freeze's audio parameters, geometry, texture controls, accepted finish or native theme catalogue, and does not assert that its 44 extensions are available inside the plug-in.

Original colours and code are released under MIT with the copyright notices in [LICENSE](../LICENSE). No competitor skins, artwork, fonts, plug-in imagery or Bitwig factory default files are distributed. The exporter maps original tokens to publicly observable Theme Editor key names and preserves the user's own remaining default values locally.

The SVG previews and HTML gallery render these exact colour tokens. They are illustrative palette studies, not evidence of installation, Bitwig screenshots or Granular Freeze runtime captures.

Upstream tools are obtained separately:

- [Bitwig Theme Editor](https://github.com/Berikai/bitwig-theme-editor), by Berikai and contributors, MIT.
- [Theme Editor 2.3.2 exact-key fix](https://github.com/Berikai/bitwig-theme-editor/releases/tag/2.3.2).

The Bitwig application is proprietary and is not covered by this repository's licence. Bitwig is a trademark of Bitwig GmbH. This is an independent community project.
