// app/lib/sanitizeText.ts

export function sanitizeText(text: string | null | undefined): string {
  if (!text) return '';

  return text
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
    // Numeric HTML entities e.g. &#160; &#8203;
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    // Zero-width characters (common in copy-paste from Word/Google Docs)
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
    // Normalise multiple spaces/newlines left behind
    .trim();
}