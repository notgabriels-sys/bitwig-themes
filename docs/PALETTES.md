# Palette reference

This collection contains **50 distinct palettes in 10 groups of 5**. Six palettes preserve the current Granular Freeze source colours exactly; 44 are new collection extensions. The default is **Terminal / Graphite** (`terminal`).

These are reusable interface colour tokens. They do not imply that Bitwig Studio accepts a theme file or that the collection has been tested in Bitwig Studio. See the repository compatibility notes before using an adapter.

## Source preservation

The source catalog has seven named entries: Black, Graphite, Obsidian, Ember, Ultraviolet, Moss, and Terminal / Bitwig. Graphite and Terminal have identical values for all 17 colour tokens, so this collection counts them once as **Terminal / Graphite**, with `graphite` as an alias. The other five preserved palettes keep their source names and all colour values. **Moss is historically named: its actual original accent is blue steel (`#8FA8C0`), so it belongs in Blue Steel rather than Botanical.** Obsidian also preserves its original neutral warning colour (`#A0A4AB`).

Preserved palettes use `origin: "granular-freeze"`; extensions use `origin: "collection"`. This records colour provenance, not plugin or host validation. New variants are not added to the Granular Freeze plugin by this repository.

## Files and regeneration

- `catalog.json` contains the entire catalog, its default and group metadata.
- `themes/<group>/<id>.json` contains one theme object with the same schema.
- `scripts/build-catalog.mjs` holds the editable definitions and generates both JSON forms and this document with no external dependencies.
- Run `node scripts/build-catalog.mjs` to regenerate; run `node scripts/build-catalog.mjs --check` to verify generated content without writing.

## Token roles

| Token | Intended use |
| --- | --- |
| `canvas` | Outer application or plugin background. |
| `panel` | Main panel surface. |
| `panelRaised` | Raised sections and inset content surfaces. |
| `control` | Control surface from the source contract. |
| `controlHover` | Hover surface from the source contract; intentionally darker than `control`. |
| `line` | Subtle decorative dividers; not a sufficient state indicator alone. |
| `lineStrong` | Stronger edges; validate their contrast in the actual component. |
| `text` | Primary text. |
| `textMuted` | Secondary text. |
| `accent` | Sparse selected or active musical controls. |
| `accentBright` | Brighter emphasis within the same accent family. |
| `accentMuted` | Decorative accent fills; not body text or the only state indicator. |
| `focus` | Visible keyboard focus indicator. |
| `meter` | Measured values, with real data supplied by the application. |
| `success`, `warning`, `record` | Semantic states; pair colour with labels or recognizable shapes. |

## Contrast and restraint

Every palette retains the original neutral canvas, panel, raised panel and control surfaces. High Contrast variants brighten `text`, `textMuted`, and `lineStrong`; their remaining surfaces are unchanged. Colour belongs on small active controls, focus rings, measured signals and labelled semantic states. Keep non-neutral colour at or below 22% of the visible interface as a design target; token data alone cannot enforce screen coverage.

The generator checks sRGB relative-luminance contrast for every theme: primary text on raised panels at least **4.5:1**, secondary text on panels at least **4.5:1**, focus on panels at least **3:1**, and accents on panels at least **3:1**. These checks cover only the named opaque colour pairs. They are not a complete accessibility audit or a promise of legibility for every adapter, text size, opacity or state. High Contrast is a subgroup name, not an accessibility certification. Rounded ratios below are for reference; validation uses unrounded values.

## Graphite

Neutral silver, ash and charcoal signals on the original graphite surfaces.

| Theme | ID | Origin | Accent | Focus | Text / raised panel | Secondary / panel | Accent / panel | Focus / panel |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| [Terminal / Graphite](../themes/graphite/terminal.json) | `terminal` | Preserved | `#C9CFD6` | `#D2D7DD` | 13.53:1 | 7.10:1 | 11.32:1 | 12.27:1 |
| [Black](../themes/graphite/black.json) | `black` | Preserved | `#81858D` | `#A0A4AB` | 13.53:1 | 7.10:1 | 4.80:1 | 7.10:1 |
| [Obsidian](../themes/graphite/obsidian.json) | `obsidian` | Preserved | `#D2D7DD` | `#E9EAEC` | 13.53:1 | 7.10:1 | 12.27:1 | 14.76:1 |
| [Slate](../themes/graphite/slate.json) | `slate` | New | `#A5ADB8` | `#C5CDD6` | 13.53:1 | 7.10:1 | 7.84:1 | 11.06:1 |
| [Ash](../themes/graphite/ash.json) | `ash` | New | `#AAA79F` | `#D2CFC6` | 13.53:1 | 7.10:1 | 7.39:1 | 11.41:1 |

## Violet

Restrained violet and lavender signals, led by the original Ultraviolet palette.

| Theme | ID | Origin | Accent | Focus | Text / raised panel | Secondary / panel | Accent / panel | Focus / panel |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| [Ultraviolet](../themes/violet/ultraviolet.json) | `ultraviolet` | Preserved | `#A78BFA` | `#B8A2FF` | 13.53:1 | 7.10:1 | 6.53:1 | 8.16:1 |
| [Iris](../themes/violet/iris.json) | `iris` | New | `#9596D6` | `#BABCEF` | 13.53:1 | 7.10:1 | 6.44:1 | 9.75:1 |
| [Dusk](../themes/violet/dusk.json) | `dusk` | New | `#AF92BF` | `#D0B7DD` | 13.53:1 | 7.10:1 | 6.50:1 | 9.73:1 |
| [Violet Glass](../themes/violet/violet-glass.json) | `violet-glass` | New | `#8F9DE7` | `#B9C2F4` | 13.53:1 | 7.10:1 | 6.89:1 | 10.22:1 |
| [Lilac](../themes/violet/lilac.json) | `lilac` | New | `#BAA5CE` | `#D8C7E7` | 13.53:1 | 7.10:1 | 7.92:1 | 11.20:1 |

## Ember

Muted red-orange, amber and warm clay signals.

| Theme | ID | Origin | Accent | Focus | Text / raised panel | Secondary / panel | Accent / panel | Focus / panel |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| [Ember](../themes/ember/ember.json) | `ember` | Preserved | `#B97A6C` | `#F0B86E` | 13.53:1 | 7.10:1 | 5.13:1 | 9.97:1 |
| [Furnace](../themes/ember/furnace.json) | `furnace` | New | `#CA8778` | `#E6B09C` | 13.53:1 | 7.10:1 | 6.13:1 | 9.35:1 |
| [Hearth](../themes/ember/hearth.json) | `hearth` | New | `#CA9670` | `#E7BC91` | 13.53:1 | 7.10:1 | 6.86:1 | 10.15:1 |
| [Cinder](../themes/ember/cinder.json) | `cinder` | New | `#B48A80` | `#D9B2A6` | 13.53:1 | 7.10:1 | 5.83:1 | 9.20:1 |
| [Amber](../themes/ember/amber.json) | `amber` | New | `#C7A46B` | `#E8CA92` | 13.53:1 | 7.10:1 | 7.57:1 | 11.25:1 |

## Blue Steel

Desaturated steel blues, including the historically named Moss palette.

| Theme | ID | Origin | Accent | Focus | Text / raised panel | Secondary / panel | Accent / panel | Focus / panel |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| [Moss](../themes/blue-steel/moss.json) | `moss` | Preserved | `#8FA8C0` | `#D2D7DD` | 13.53:1 | 7.10:1 | 7.22:1 | 12.27:1 |
| [Blueprint](../themes/blue-steel/blueprint.json) | `blueprint` | New | `#829FCB` | `#ADC5E9` | 13.53:1 | 7.10:1 | 6.57:1 | 10.10:1 |
| [Harbor](../themes/blue-steel/harbor.json) | `harbor` | New | `#92A9B6` | `#BCD0D9` | 13.53:1 | 7.10:1 | 7.25:1 | 11.14:1 |
| [Steel](../themes/blue-steel/steel.json) | `steel` | New | `#8B9DB3` | `#B8C7D9` | 13.53:1 | 7.10:1 | 6.41:1 | 10.33:1 |
| [Dusk Blue](../themes/blue-steel/dusk-blue.json) | `dusk-blue` | New | `#909CC1` | `#B9C4E2` | 13.53:1 | 7.10:1 | 6.52:1 | 10.20:1 |

## Polar

Pale icy blues and cool mineral signals.

| Theme | ID | Origin | Accent | Focus | Text / raised panel | Secondary / panel | Accent / panel | Focus / panel |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| [Frost](../themes/polar/frost.json) | `frost` | New | `#B4CEDB` | `#D6E8EF` | 13.53:1 | 7.10:1 | 10.82:1 | 14.08:1 |
| [Glacier](../themes/polar/glacier.json) | `glacier` | New | `#9DC7DA` | `#C5E2EF` | 13.53:1 | 7.10:1 | 9.83:1 | 13.11:1 |
| [Icefield](../themes/polar/icefield.json) | `icefield` | New | `#B4D2D1` | `#D7E9E7` | 13.53:1 | 7.10:1 | 11.07:1 | 14.13:1 |
| [Quartz](../themes/polar/quartz.json) | `quartz` | New | `#C4C4D7` | `#E1E0ED` | 13.53:1 | 7.10:1 | 10.34:1 | 13.61:1 |
| [Moonlight](../themes/polar/moonlight.json) | `moonlight` | New | `#B8C4E0` | `#D8E1F4` | 13.53:1 | 7.10:1 | 10.16:1 | 13.53:1 |

## Teal

Quiet blue-green signals with a cool studio character.

| Theme | ID | Origin | Accent | Focus | Text / raised panel | Secondary / panel | Accent / panel | Focus / panel |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| [Petrol](../themes/teal/petrol.json) | `petrol` | New | `#78B2B8` | `#A4D6D9` | 13.53:1 | 7.10:1 | 7.49:1 | 11.17:1 |
| [Lagoon](../themes/teal/lagoon.json) | `lagoon` | New | `#80BDB1` | `#AEDCCF` | 13.53:1 | 7.10:1 | 8.32:1 | 11.79:1 |
| [Sonar](../themes/teal/sonar.json) | `sonar` | New | `#7FAFC5` | `#ADD3E4` | 13.53:1 | 7.10:1 | 7.48:1 | 11.18:1 |
| [Tidepool](../themes/teal/tidepool.json) | `tidepool` | New | `#93B9AE` | `#BDD8CF` | 13.53:1 | 7.10:1 | 8.28:1 | 11.75:1 |
| [Deep Water](../themes/teal/deep-water.json) | `deep-water` | New | `#87ABAF` | `#B1CDD0` | 13.53:1 | 7.10:1 | 7.17:1 | 10.59:1 |

## Botanical

Greyed leaf, sage and lichen greens.

| Theme | ID | Origin | Accent | Focus | Text / raised panel | Secondary / panel | Accent / panel | Focus / panel |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| [Sage](../themes/botanical/sage.json) | `sage` | New | `#A2B49A` | `#CAD6C2` | 13.53:1 | 7.10:1 | 8.06:1 | 11.77:1 |
| [Lichen](../themes/botanical/lichen.json) | `lichen` | New | `#ADB68A` | `#D2D9B1` | 13.53:1 | 7.10:1 | 8.32:1 | 12.10:1 |
| [Fern](../themes/botanical/fern.json) | `fern` | New | `#88B49A` | `#B2D6BD` | 13.53:1 | 7.10:1 | 7.65:1 | 11.21:1 |
| [Willow](../themes/botanical/willow.json) | `willow` | New | `#B1B49C` | `#D6D8C3` | 13.53:1 | 7.10:1 | 8.36:1 | 12.24:1 |
| [Eucalyptus](../themes/botanical/eucalyptus.json) | `eucalyptus` | New | `#9BBBAD` | `#C3DCCD` | 13.53:1 | 7.10:1 | 8.55:1 | 12.22:1 |

## Copper

Earthy copper, bronze and ochre signals.

| Theme | ID | Origin | Accent | Focus | Text / raised panel | Secondary / panel | Accent / panel | Focus / panel |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| [Copper](../themes/copper/copper.json) | `copper` | New | `#BE947C` | `#DEBCA4` | 13.53:1 | 7.10:1 | 6.53:1 | 10.01:1 |
| [Bronze](../themes/copper/bronze.json) | `bronze` | New | `#B5A17B` | `#D7C7A3` | 13.53:1 | 7.10:1 | 7.06:1 | 10.65:1 |
| [Ochre](../themes/copper/ochre.json) | `ochre` | New | `#C0AA75` | `#E1CD9B` | 13.53:1 | 7.10:1 | 7.82:1 | 11.34:1 |
| [Patina](../themes/copper/patina.json) | `patina` | New | `#A9AD87` | `#CFD0AF` | 13.53:1 | 7.10:1 | 7.63:1 | 11.25:1 |
| [Burnished](../themes/copper/burnished.json) | `burnished` | New | `#B79B90` | `#D9BEB1` | 13.53:1 | 7.10:1 | 6.86:1 | 10.11:1 |

## Rose

Soft rose, plum and mauve signals.

| Theme | ID | Origin | Accent | Focus | Text / raised panel | Secondary / panel | Accent / panel | Focus / panel |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| [Dusty Rose](../themes/rose/dusty-rose.json) | `dusty-rose` | New | `#C094A4` | `#E0BAC8` | 13.53:1 | 7.10:1 | 6.78:1 | 10.18:1 |
| [Mulberry](../themes/rose/mulberry.json) | `mulberry` | New | `#B48EAE` | `#D8B4D0` | 13.53:1 | 7.10:1 | 6.28:1 | 9.61:1 |
| [Mauve](../themes/rose/mauve.json) | `mauve` | New | `#B6A0B9` | `#D8C4DB` | 13.53:1 | 7.10:1 | 7.38:1 | 10.86:1 |
| [Blossom](../themes/rose/blossom.json) | `blossom` | New | `#C89FA8` | `#E7C4C9` | 13.53:1 | 7.10:1 | 7.60:1 | 11.11:1 |
| [Velvet](../themes/rose/velvet.json) | `velvet` | New | `#AE8C9C` | `#D3B3C1` | 13.53:1 | 7.10:1 | 5.95:1 | 9.30:1 |

## High Contrast

Brighter signals and stronger text and boundary tokens on neutral black surfaces.

| Theme | ID | Origin | Accent | Focus | Text / raised panel | Secondary / panel | Accent / panel | Focus / panel |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| [Phosphor](../themes/high-contrast/phosphor.json) | `phosphor` | New | `#C3E8B8` | `#E0F5D8` | 14.92:1 | 10.01:1 | 13.16:1 | 15.42:1 |
| [Porcelain](../themes/high-contrast/porcelain.json) | `porcelain` | New | `#F0F0E9` | `#FFFFFF` | 14.92:1 | 10.01:1 | 15.52:1 | 17.77:1 |
| [Signal Gold](../themes/high-contrast/signal-gold.json) | `signal-gold` | New | `#F0D29A` | `#FFE8BC` | 14.92:1 | 10.01:1 | 12.17:1 | 14.82:1 |
| [Ice Signal](../themes/high-contrast/ice-signal.json) | `ice-signal` | New | `#BEE7F5` | `#E4F6FC` | 14.92:1 | 10.01:1 | 13.48:1 | 15.98:1 |
| [Violet Signal](../themes/high-contrast/violet-signal.json) | `violet-signal` | New | `#D7C5FF` | `#EEE4FF` | 14.92:1 | 10.01:1 | 11.27:1 | 14.53:1 |
