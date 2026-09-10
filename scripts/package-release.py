#!/usr/bin/env python3
"""Build a reproducible archive from an explicit public-file allowlist."""
import hashlib
import json
import re
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parent.parent
VERSION = json.loads((ROOT / 'package.json').read_text())['version']
DEST = ROOT / 'dist'
DEST.mkdir(exist_ok=True)
archive = DEST / f'gabriel-bitwig-themes-{VERSION}.zip'
root_files = ['README.md', 'LICENSE', 'CONTRIBUTING.md', 'package.json', 'catalog.json', 'index.html', '.nojekyll']
public_files = root_files + [
    'docs/INSTALL.md', 'docs/PALETTES.md', 'docs/PROVENANCE.md', 'docs/VALIDATION.md',
    'assets/gallery.css', 'assets/gallery.js', 'assets/previews/overview.svg',
    'scripts/build-catalog.mjs', 'scripts/build-previews.mjs', 'scripts/validate.mjs',
    'scripts/bitwig.mjs', 'scripts/export-bitwig.mjs', 'scripts/package-release.py',
    'tests/bitwig.test.mjs', 'tests/catalog.test.mjs',
]
catalog = json.loads((ROOT / 'catalog.json').read_text())
for theme in catalog['themes']:
    if not all(re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', theme[key]) for key in ['group', 'id']):
        raise ValueError('Invalid theme path component')
    public_files.extend([f"themes/{theme['group']}/{theme['id']}.json",
                         f"assets/previews/{theme['id']}.svg"])
files = [ROOT / name for name in public_files]
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as package:
    for source in sorted(files):
        relative = source.relative_to(ROOT).as_posix()
        if source.is_symlink() or not source.resolve().is_relative_to(ROOT):
            raise ValueError(f'Symlinks are not packaged: {relative}')
        entry = zipfile.ZipInfo(f'gabriel-bitwig-themes-{VERSION}/{relative}', (2026, 9, 10, 0, 0, 0))
        entry.compress_type = zipfile.ZIP_DEFLATED
        entry.external_attr = 0o100644 << 16
        package.writestr(entry, source.read_bytes())
with zipfile.ZipFile(archive) as package:
    assert package.testzip() is None
    assert not any(n.endswith('.bte') or '/.git/' in n for n in package.namelist())
digest = hashlib.sha256(archive.read_bytes()).hexdigest()
(DEST / 'SHA256SUMS').write_text(f'{digest}  {archive.name}\n')
print(f'{archive.name}: {len(files)} files, {archive.stat().st_size} bytes, archive integrity passed')
print(f'SHA-256 {digest}')
