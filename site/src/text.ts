// Utilitários de texto e HTML usados pelo build. Sem dependências externas.

const ESCAPES: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

const ENTITIES: Readonly<Record<string, string>> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

export const escapeHtml = (text: string): string => text.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);

export const unescapeHtml = (text: string): string =>
  text.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (whole, ref: string) => {
    if (ref.startsWith('#x') || ref.startsWith('#X')) return String.fromCodePoint(parseInt(ref.slice(2), 16));
    if (ref.startsWith('#')) return String.fromCodePoint(parseInt(ref.slice(1), 10));
    return ENTITIES[ref.toLowerCase()] ?? whole;
  });

export const stripTags = (text: string): string => text.replace(/<[^>]+>/g, '');

export const slugify = (text: string): string =>
  stripTags(text)
    .normalize('NFKD')
    .replace(/[^\x00-\x7f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Primeiro parágrafo com ao menos 80 caracteres, truncado em 155 na fronteira de palavra. */
export const summarize = (body: string, fallback: string): string => {
  for (const match of body.matchAll(/<p>([\s\S]*?)<\/p>/g)) {
    const text = unescapeHtml(stripTags(match[1] ?? '')).replace(/\s+/g, ' ').trim();
    const chars = Array.from(text);
    if (chars.length < 80) continue;
    if (chars.length <= 155) return text;
    const cut = chars.slice(0, 155).join('');
    const space = cut.lastIndexOf(' ');
    return (space === -1 ? cut : cut.slice(0, space)).replace(/[,;:]+$/, '') + '…';
  }
  return fallback;
};

export type Json = string | number | boolean | null | readonly Json[] | { readonly [key: string]: Json };

/** JSON legível em uma linha (", " e ": "), sem escapar caracteres não ASCII. */
export const toJsonLine = (value: Json): string => {
  if (Array.isArray(value)) return '[' + value.map(toJsonLine).join(', ') + ']';
  if (value !== null && typeof value === 'object') {
    return '{' + Object.entries(value).map(([k, v]) => `${JSON.stringify(k)}: ${toJsonLine(v)}`).join(', ') + '}';
  }
  return JSON.stringify(value);
};
