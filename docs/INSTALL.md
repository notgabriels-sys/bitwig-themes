# Installing a theme

The JSON palettes in this repository are source files for the exporter. Bitwig does not import them directly. The exporter generates a complete `.bte` for the unofficial [Bitwig Theme Editor](https://github.com/Berikai/bitwig-theme-editor).

## 1. Prepare Theme Editor and your version's default

Save your session and follow the upstream Theme Editor setup instructions. Obtain its release from the [upstream releases page](https://github.com/Berikai/bitwig-theme-editor/releases). The editor patches Bitwig's `bitwig.jar`; this repository does not do that step. Keep the original application backup created by the editor.

The upstream 2.3.2 release fixes exact colour-key matching, including keys starting with `Clip`. When upgrading from an older patched version, follow [its repatching note](https://github.com/Berikai/bitwig-theme-editor/releases/tag/2.3.2) using an original, unpatched JAR.

Once Theme Editor has prepared Bitwig and Bitwig has generated the defaults, locate `default.bte` for the installed version. Version storage can vary by Theme Editor release and global/per-version settings. In the locally inspected 2.x configuration:

- macOS / Linux: `~/.bitwig-theme-editor/versions/<version>/default.bte`
- Windows: `%APPDATA%\.bitwig-theme-editor\versions\<version>\default.bte`

The upstream README also shows older paths without the `versions` component. Use the **actual file created by your installation**. Do not create a short substitute, download somebody else's default, or reuse a default from before an application update.

## 2. Generate your choice

Install Node.js 22 or later, then download the repository ZIP or clone it. In a terminal opened at the repository folder, run:

```sh
node scripts/export-bitwig.mjs --list
node scripts/export-bitwig.mjs --theme ultraviolet --base /path/to/default.bte --out ./exports/ultraviolet.bte
```

For example, **only if your installed version is 6.1.1** and that file exists, macOS users can run:

```sh
node scripts/export-bitwig.mjs --theme ultraviolet --base "$HOME/.bitwig-theme-editor/versions/6.1.1/default.bte" --out ./exports/ultraviolet.bte
```

Windows PowerShell, with the same version caveat:

```powershell
node scripts/export-bitwig.mjs --theme ultraviolet --base "$env:APPDATA\.bitwig-theme-editor\versions\6.1.1\default.bte" --out ./exports/ultraviolet.bte
```

To generate all 50, use `--all` instead of `--theme ultraviolet`, and make `--out` a directory. Outputs are grouped as `<output>/<family>/<theme-id>.bte`. Existing output files are protected: choose a new output location for a fresh export.

The exporter prints how many actual colour keys it replaced. It rejects sparse or malformed defaults, duplicate keys, invalid colours and unknown theme names. Unmapped colours, alpha values and the `Gradient` setting are preserved. Token contrast checks do not establish contrast across every Bitwig surface or alpha blend.

## 3. Apply and inspect

Back up your existing `theme.bte`. Use Theme Editor's import workflow to load the newly generated `.bte` into the correct active version. If you manage files manually, use the active location reported by your editor; the exporter itself never writes there.

Reopen Bitwig as instructed by Theme Editor. In a blank test project, inspect the browser, menus, tooltips, device controls, selection states, arrangement and launcher. Check recorded/armed states and level warnings as well as the overall appearance. Theme changes should not be evaluated in the middle of a live performance or while unsaved work is open.

This release has structural export validation, with **visual host validation pending**. If a label becomes unreadable or an area is unexpected, restore the backed-up theme and report the exact version, theme and surface through the compatibility issue template.

## Recovery and application updates

If the theme is unreadable, quit Bitwig, restore the previous `theme.bte`, then reopen. For a patching problem, follow upstream recovery instructions with the original `bitwig.jar` backup. Do not delete the application or overwrite its JAR with a file from this repository; none is supplied.

After updating Bitwig, generate a fresh default through the compatible Theme Editor and export again. A structurally valid theme for one version is not proof of visual compatibility with another. Windows and Linux installation steps are documented from upstream source; they have not been executed as part of this release.
