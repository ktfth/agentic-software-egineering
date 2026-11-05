import {
  AUTHOR,
  AUTHOR_URL,
  BOOK,
  DEFAULT_DESCRIPTION,
  EDITIONS_PATH,
  ENTRIES,
  KINDLE_ASIN,
  KINDLE_URL,
  ORIGIN,
  PRINT_ASIN,
  PRINT_URL,
  readingUrl,
  SITE_SOURCE_URL,
  SUBTITLE,
} from './config.ts';
import { escapeHtml, type Json, toJsonLine } from './text.ts';

/** Aplica o tema antes da primeira pintura. Seu hash entra na CSP de vercel.json (conferido por verify.ts). */
export const THEME_BOOT =
  "<script>(function(){var t=null;try{t=JSON.parse(localStorage.getItem('evidence-theme'))}catch(e){}if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')})()</script>";

export const BOOK_ID = `${ORIGIN}/#livro`;
const AUTHOR_ID = `${ORIGIN}/#autor`;
const SITE_ID = `${ORIGIN}/#site`;

const asin = (value: string): Json => ({ '@type': 'PropertyValue', propertyID: 'ASIN', value });

/** Entidades compartilhadas por todas as páginas: site, autor, obra e suas edições na Amazon. */
const BASE_GRAPH: readonly Json[] = [
  { '@type': 'WebSite', '@id': SITE_ID, url: `${ORIGIN}/`, name: BOOK, inLanguage: 'pt-BR', about: { '@id': BOOK_ID }, author: { '@id': AUTHOR_ID } },
  {
    '@type': 'Person',
    '@id': AUTHOR_ID,
    name: AUTHOR,
    url: AUTHOR_URL,
    sameAs: [AUTHOR_URL],
    jobTitle: 'Engenheiro de software',
    worksFor: { '@type': 'Organization', name: 'Aldeia Viva' },
  },
  {
    '@type': 'Book',
    '@id': BOOK_ID,
    name: BOOK,
    alternativeHeadline: SUBTITLE,
    description: DEFAULT_DESCRIPTION,
    author: { '@id': AUTHOR_ID },
    inLanguage: 'pt-BR',
    bookEdition: 'Primeira edição em português',
    copyrightYear: 2026,
    image: `${ORIGIN}/assets/capa.jpg`,
    url: `${ORIGIN}/`,
    genre: 'Engenharia de software',
    about: ['Engenharia de software', 'Agentes de IA', 'Testes de software', 'Avaliação de agentes', 'Integração contínua', 'TypeScript', 'Node.js'].map(
      (name): Json => ({ '@type': 'Thing', name }),
    ),
    workExample: [
      {
        '@type': 'Book',
        '@id': `${ORIGIN}/#kindle`,
        name: `${BOOK} (Kindle)`,
        bookFormat: 'https://schema.org/EBook',
        url: KINDLE_URL,
        identifier: asin(KINDLE_ASIN),
        inLanguage: 'pt-BR',
        author: { '@id': AUTHOR_ID },
      },
      {
        '@type': 'Book',
        '@id': `${ORIGIN}/#impresso`,
        name: `${BOOK} (livro impresso)`,
        url: PRINT_URL,
        identifier: asin(PRINT_ASIN),
        inLanguage: 'pt-BR',
        author: { '@id': AUTHOR_ID },
      },
    ],
  },
];

/** Trilha Apresentação → página atual, para BreadcrumbList. */
export const breadcrumb = (name: string, path: string): Json => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: BOOK, item: `${ORIGIN}/` },
    { '@type': 'ListItem', position: 2, name, item: ORIGIN + path },
  ],
});

interface HeadOptions {
  readonly path?: string;
  readonly description?: string;
  readonly reader?: boolean;
  readonly graph?: readonly Json[];
}

export const head = (title: string, { path = '/', description = DEFAULT_DESCRIPTION, reader = false, graph = [] }: HeadOptions = {}): string => {
  const home = title === BOOK;
  const full = home ? `${BOOK} — livro de ${AUTHOR}` : `${title} — ${BOOK}`;
  const ld: Json = { '@context': 'https://schema.org', '@graph': [...BASE_GRAPH, ...graph] };
  return (
    '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    (reader ? THEME_BOOT : '') +
    `<title>${escapeHtml(full)}</title>` +
    `<meta name="description" content="${escapeHtml(description)}">` +
    `<meta name="author" content="${AUTHOR}">` +
    '<meta name="theme-color" content="#061722"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">' +
    `<link rel="canonical" href="${ORIGIN + path}">` +
    `<meta property="og:type" content="${home ? 'book' : 'article'}"><meta property="og:locale" content="pt_BR">` +
    `<meta property="og:site_name" content="${escapeHtml(BOOK)}">` +
    `<meta property="og:title" content="${escapeHtml(full)}">` +
    `<meta property="og:description" content="${escapeHtml(description)}">` +
    `<meta property="og:image" content="${ORIGIN}/assets/og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">` +
    `<meta property="og:image:alt" content="${escapeHtml(BOOK)} — ${escapeHtml(SUBTITLE)}. ${AUTHOR}.">` +
    `<meta property="og:url" content="${ORIGIN + path}"><meta name="twitter:card" content="summary_large_image">` +
    '<link rel="stylesheet" href="/style.css"><script src="/reader.js" defer></script>' +
    `<script type="application/ld+json">${toJsonLine(ld).replaceAll('<', '\\u003c')}</script></head>`
  );
};

export const FOOTER = `<footer><span>© 2026 ${AUTHOR}</span><p>Marcas e nomes de produtos pertencem a seus respectivos titulares. Sem patrocínio, certificação ou aprovação das organizações mencionadas.</p><p class="footer-links"><a href="${EDITIONS_PATH}">Edições do livro →</a><a href="${KINDLE_URL}">Kindle ↗</a><a href="${PRINT_URL}">Livro impresso ↗</a><a href="${AUTHOR_URL}">Kaique no GitHub ↗</a><a href="${SITE_SOURCE_URL}">Código-fonte do site ↗</a></p></footer>`;

export const HEADER = `<a class="skip" href="#conteudo">Pular para o conteúdo</a><header class="site-header"><a class="brand" href="/">KAIQUE SILVA <span>/ LIVRO 01</span></a><nav aria-label="Principal"><a href="/#sumario">Sumário</a><a href="/#codigo">Código</a><a href="${EDITIONS_PATH}">Kindle e impresso</a></nav></header>`;

export const toc = (current = ''): string =>
  '<ol class="toc">' +
  ENTRIES.map(
    ({ slug, title }) =>
      `<li><a ${slug === current ? 'aria-current="page" ' : ''}href="${readingUrl(slug)}">${escapeHtml(title)}</a></li>`,
  ).join('') +
  '</ol>';
