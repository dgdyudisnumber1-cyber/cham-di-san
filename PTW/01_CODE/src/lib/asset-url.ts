import downloaded from './downloaded-asset-map.json';

const localAssets = downloaded as Record<string, string>;

/** Prefer downloaded images; use original URL when an asset has not been backed up. */
export function assetUrl(original: string | null | undefined): string {
  if (!original) return '';
  let local = localAssets[original];
  if (!local && original.startsWith('https://readdy.ai/api/search-image?')) {
    try {
      const seq = new URL(original).searchParams.get('seq');
      if (seq) local = localAssets[`seq:${seq}`];
    } catch {
      // An invalid URL is passed through unchanged.
    }
  }
  return local ? `${import.meta.env.BASE_URL}${local}` : original;
}
