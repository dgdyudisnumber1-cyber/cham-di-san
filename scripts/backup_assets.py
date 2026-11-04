#!/usr/bin/env python3
"""Back up image URLs in docs/migration/assets_manifest.json into public/assets.

Run with --download for network access. Existing local copies are reused.
Unreachable URLs are left untouched; the website uses remote originals as fallback.
"""
import argparse
import concurrent.futures
import json
import os
from pathlib import Path
import re
import tempfile
from urllib.parse import urlparse, parse_qs
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'docs/migration/assets_manifest.json'
MAP_PATH = ROOT / 'src/lib/downloaded-asset-map.json'
REPORT = ROOT / 'docs/migration/assets-download-report.json'
PUBLIC = ROOT / 'public'
EXT = {'jpeg': '.jpg', 'png': '.png', 'gif': '.gif', 'webp': '.webp', 'avif': '.avif'}


def kind(data):
    if data.startswith(b'\xff\xd8\xff'): return 'jpeg'
    if data.startswith(b'\x89PNG\r\n\x1a\n'): return 'png'
    if data[:6] in (b'GIF87a', b'GIF89a'): return 'gif'
    if data.startswith(b'RIFF') and data[8:12] == b'WEBP': return 'webp'
    if len(data) >= 12 and data[4:12] in (b'ftypavif', b'ftypavis'): return 'avif'
    return None


def dest_prefix(asset):
    rel = Path(asset['suggested_path'])
    if rel.is_absolute() or '..' in rel.parts or rel.parts[0] != 'assets':
        raise ValueError('Unsafe suggested_path for ' + asset['id'])
    name = re.sub('[^A-Za-z0-9_.-]+', '-', rel.stem)
    return PUBLIC / rel.parent / name


def existing_file(asset):
    prefix = dest_prefix(asset)
    for extension in EXT.values():
        path = prefix.with_suffix(extension)
        if path.is_file() and path.stat().st_size > 0:
            # Verify header rather than treating a downloaded HTML error as an image.
            with path.open('rb') as f: header = f.read(24)
            if kind(header): return path
    return None


def download_one(asset, timeout, limit):
    found = existing_file(asset)
    if found: return {'id': asset['id'], 'status': 'cached', 'path': found.relative_to(PUBLIC).as_posix()}
    url = asset['url']
    parts = urlparse(url)
    allowed = {'readdy.ai', 'public.readdy.ai', 'storage.helloreaddy.io', 'i.pinimg.com'}
    if parts.scheme != 'https' or parts.hostname not in allowed:
        return {'id': asset['id'], 'status': 'failed', 'error': 'Unexpected initial image host'}
    try:
        request = Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (compatible; HeritageAssetBackup/1.0)',
            'Accept': 'image/avif,image/webp,image/png,image/jpeg,image/gif,*/*;q=0.6',
        })
        with urlopen(request, timeout=timeout) as response:
            # Read no more than the configured cap, including for streaming responses.
            data = response.read(limit + 1)
        if len(data) > limit:
            raise ValueError('Image exceeds byte limit')
        detected = kind(data)
        if not detected:
            raise ValueError('Response is not a recognized image (possibly HTML)')
        prefix = dest_prefix(asset)
        prefix.parent.mkdir(parents=True, exist_ok=True)
        target = prefix.with_suffix(EXT[detected])
        fd, temp_name = tempfile.mkstemp(prefix='.partial-', dir=target.parent)
        try:
            with os.fdopen(fd, 'wb') as f: f.write(data)
            os.replace(temp_name, target)
        finally:
            if os.path.exists(temp_name): os.unlink(temp_name)
        return {'id': asset['id'], 'status': 'downloaded', 'path': target.relative_to(PUBLIC).as_posix(), 'bytes': len(data)}
    except Exception as exc:
        return {'id': asset['id'], 'status': 'failed', 'error': str(exc)[:220]}


def generate_map(assets):
    mapping = {}
    present = []
    for asset in assets:
        file = existing_file(asset)
        if file is None: continue
        local = file.relative_to(PUBLIC).as_posix()
        mapping[asset['url']] = local
        parsed = urlparse(asset['url'])
        if parsed.hostname == 'readdy.ai' and parsed.path == '/api/search-image':
            seqs = parse_qs(parsed.query).get('seq', [])
            if seqs: mapping['seq:' + seqs[0]] = local
        present.append(asset['id'])
    MAP_PATH.write_text(json.dumps(mapping, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    return present


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--download', action='store_true', help='Download images; requires internet')
    parser.add_argument('--jobs', type=int, default=5, help='Parallel downloads (default: 5)')
    parser.add_argument('--timeout', type=int, default=18, help='HTTP timeout per image in seconds')
    parser.add_argument('--limit-mb', type=int, default=24, help='Maximum file size per image')
    args = parser.parse_args()
    if args.jobs < 1 or args.jobs > 12: parser.error('--jobs must be between 1 and 12')
    assets = json.loads(MANIFEST.read_text(encoding='utf8'))['assets']
    print('Manifest assets:', len(assets), '| references:', sum(a['reference_count'] for a in assets))
    results = []
    if args.download:
        with concurrent.futures.ThreadPoolExecutor(max_workers=args.jobs) as pool:
            futures = [pool.submit(download_one, asset, args.timeout, args.limit_mb * 1024 * 1024) for asset in assets]
            for f in concurrent.futures.as_completed(futures):
                result = f.result()
                results.append(result)
                print(result['status'].upper(), result['id'], result.get('error', ''))
    present = generate_map(assets)
    print('Local images:', len(present), '/', len(assets))
    if args.download:
        REPORT.write_text(json.dumps({
            'assets_total': len(assets), 'assets_local': len(present),
            'results': sorted(results, key=lambda x: x['id'])
        }, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
        print('Wrote report:', REPORT.relative_to(ROOT))
    print('Wrote mapping:', MAP_PATH.relative_to(ROOT))
    if not args.download:
        print('Run with --download to fetch the images. Remote images remain as fallback.')


if __name__ == '__main__': main()
