/**
 * Asset and URL Validation Utilities for Portfolio CMS
 *
 * Accepts BOTH:
 * 1. Absolute external URLs:
 *    http://example.com/image.jpg
 *    https://example.com/image.jpg
 *
 * 2. Legitimate local portfolio asset paths:
 *    /src/assets/...
 *    /assets/...
 *    src/assets/...
 *    assets/...
 *
 * Rejects clearly malformed strings (random text, invalid schemes, spaces, etc.)
 */

export const isValidAssetUrlOrPath = (value: string | null | undefined): boolean => {
  if (!value) return true;
  const trimmed = value.trim();
  if (!trimmed) return true;

  // 1. Check local portfolio asset paths
  if (
    trimmed.startsWith('/src/assets/') ||
    trimmed.startsWith('/assets/') ||
    trimmed.startsWith('src/assets/') ||
    trimmed.startsWith('assets/')
  ) {
    const relativePath = trimmed.replace(/^\/?(src\/)?assets\//, '');
    return relativePath.length > 0 && !/\s/.test(trimmed);
  }

  // 2. Check absolute http/https URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      return (
        (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
        parsed.hostname.length > 0 &&
        !/\s/.test(trimmed)
      );
    } catch {
      return false;
    }
  }

  return false;
};

/**
 * Validates document or web URLs (for resume, verification links, external demos, etc.)
 * Accepts http/https URLs, local document paths, or section anchors (#contact)
 */
export const isValidWebOrDocumentUrl = (value: string | null | undefined): boolean => {
  if (!value) return true;
  const trimmed = value.trim();
  if (!trimmed) return true;

  if (trimmed.startsWith('#')) return true;

  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('src/assets/') ||
    trimmed.startsWith('assets/')
  ) {
    return !/\s/.test(trimmed);
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      return (
        (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
        parsed.hostname.length > 0 &&
        !/\s/.test(trimmed)
      );
    } catch {
      return false;
    }
  }

  return false;
};
