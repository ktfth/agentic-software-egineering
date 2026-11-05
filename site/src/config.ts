import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unescapeHtml } from './text.ts';

export const SITE_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
export const CONTENT_DIR = join(SITE_DIR, 'content');
export const ASSETS_DIR = join(SITE_DIR, 'assets');
export const GUIDES_DIR = join(SITE_DIR, 'guides');
export const OUT_DIR = join(SITE_DIR, 'dist');

// Origem canônica: defina SITE_ORIGIN ao publicar em outro domínio.
const DEFAULT_ORIGIN = 'https://engenharia-de-ia-v1.aldeia-viva.com.br';

const readOrigin = (raw: string | undefined): string => {
  const value = (raw ?? '').trim() || DEFAULT_ORIGIN;
  const parsed = new URL(value);
  if (parsed.protocol !== 'https:' && parsed.hostname !== 'localhost') {
    throw new Error(`SITE_ORIGIN precisa usar https: ${value}`);
  }
  if (parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error(`SITE_ORIGIN deve ser só a origem, sem caminho, query ou fragmento: ${value}`);
  }
  return value.replace(/\/+$/, '');
};

export const ORIGIN = readOrigin(process.env['SITE_ORIGIN']);

export const BOOK = 'Engenharia de Software com Agentes de IA';
export const SUBTITLE = 'Evidência, ferramentas e autonomia sob controle';
export const AUTHOR = 'Kaique Silva';
export const DEFAULT_DESCRIPTION =
  'Livro de Kaique Silva sobre engenharia de software com agentes de IA. Amostra grátis no site; obra completa no Kindle (Kindle Unlimited) e impressa.';
export const COVER_ALT =
  'Capa de Engenharia de Software com Agentes de IA, de Kaique Silva: arquitetura em gravura atravessada por um caminho cor de cobre.';
export const WORKSHOP_ALT =
  'Gravura em preto e branco: de uma prancheta com esboços, pequenas maquetes seguem por uma arcada de vidro e uma ponte até se tornarem edifícios. Metáfora do caminho da evidência.';
// Edições na Amazon. O Kindle está no KDP Select: o site publica só a amostra (SAMPLE_SLUGS, cerca de 9% do texto).
export const KINDLE_ASIN = 'B0HQF2F8Z6';
export const KINDLE_URL = `https://www.amazon.com/dp/${KINDLE_ASIN}`;
export const PRINT_ASIN = 'B0HQGBXR4S';
export const PRINT_URL = `https://www.amazon.com/dp/${PRINT_ASIN}`;
export const EDITIONS_PATH = '/edicoes/';
export const KINDLE_PITCH = 'O livro completo, na íntegra, está na edição Kindle, incluída no Kindle Unlimited, e no livro impresso.';
export const REPO_URL = 'https://github.com/ktfth/agentic-software-egineering';
export const AUTHOR_URL = 'https://github.com/ktfth';
export const SITE_SOURCE_URL = `${REPO_URL}/tree/main/site`;

/** Imagens do EPUB (assets-originais/) servidas em versão web otimizada. */
export const WEB_IMAGES: Readonly<Record<string, string>> = {
  'evidence-workshop.png': 'evidence-workshop.webp',
  'bounded-garden.png': 'bounded-garden.webp',
};

export interface Entry {
  readonly slug: string;
  readonly title: string;
}

/** Ordem de leitura do EPUB: primeiro <nav> de content/nav.xhtml. */
const readEntries = (): readonly Entry[] => {
  const nav = readFileSync(join(CONTENT_DIR, 'nav.xhtml'), 'utf8');
  const toc = /<nav\b[^>]*>([\s\S]*?)<\/nav>/.exec(nav)?.[1];
  if (!toc) throw new Error('content/nav.xhtml sem <nav>.');
  const entries = [...toc.matchAll(/<a\b[^>]*href="([^"]+)\.xhtml"[^>]*>([^<]*)<\/a>/g)].map((m) => ({
    slug: m[1] ?? '',
    title: unescapeHtml(m[2] ?? ''),
  }));
  if (entries.length === 0) throw new Error('content/nav.xhtml sem entradas.');
  return entries;
};

export const ENTRIES = readEntries();

/** Seções com texto integral no site (amostra); as demais são guias originais em guides/<slug>.md. */
export const SAMPLE_SLUGS: ReadonlySet<string> = new Set(['front', 'chapter-01']);
export const isSample = (slug: string): boolean => SAMPLE_SLUGS.has(slug);

export const readingUrl = (slug: string): string => `/ler/${slug}/`;
