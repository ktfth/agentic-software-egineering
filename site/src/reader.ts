import { ASSETS_DIR, DEFAULT_DESCRIPTION, EDITIONS_PATH, ENTRIES, KINDLE_PITCH, KINDLE_URL, ORIGIN, PRINT_URL, readingUrl, SUBTITLE, WEB_IMAGES } from './config.ts';
import { imageSize } from './images.ts';
import { BOOK_ID, breadcrumb, FOOTER, HEADER, head, toc } from './layout.ts';
import { type Question, renderMarkdown } from './markdown.ts';
import { escapeHtml, type Json, slugify, summarize } from './text.ts';

const FIGURE = /<figure><img src="([^"]+)" alt="([^"]*)"\/><figcaption>([\s\S]*?)<\/figcaption><\/figure>/g;
const DIAGRAM_ALT = /^Relação conceitual: (.+)\.$/;

/** Diagrama PNG do EPUB vira uma sequência HTML gerada do texto alternativo. */
const flowFigure = (slug: string, alt: string): string => {
  const steps = DIAGRAM_ALT.exec(alt)?.[1]?.split(', depois ');
  if (!steps || steps.length < 2) throw new Error(`Diagrama sem sequência reconhecível em ${slug}: ${alt}`);
  const items = steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('');
  return `<figure class="flow"><ol aria-label="Relação conceitual do capítulo">${items}</ol><figcaption>Diagrama conceitual do capítulo; siga a sequência.</figcaption></figure>`;
};

const renderFigures = (slug: string, body: string): string => {
  let first = true;
  return body.replace(FIGURE, (_whole, src: string, alt: string, caption: string) => {
    if (src.startsWith('diagram-')) return flowFigure(slug, alt);
    const web = WEB_IMAGES[src] ?? src;
    const { width, height } = imageSize(ASSETS_DIR, web);
    const lazy = first ? '' : ' loading="lazy"';
    first = false;
    return `<figure><img src="/assets/${web}" alt="${alt}" width="${width}" height="${height}" decoding="async"${lazy}><figcaption>${caption}</figcaption></figure>`;
  });
};

/** Um único h1 por página: o subtítulo vira lede e os h1 seguintes viram h2. */
const normalizeHeadings = (body: string): string => {
  let h1Count = 0;
  return body
    .replace(`<h2>${SUBTITLE}</h2>`, () => `<p class="lede">${SUBTITLE}</p>`)
    .replace(/<h1>([\s\S]*?)<\/h1>/g, (whole, inner: string) => (++h1Count === 1 ? whole : `<h2>${inner}</h2>`));
};

/** Ids estáveis e únicos para h1–h3, derivados do texto. */
const addHeadingIds = (body: string): string => {
  const seen = new Map<string, number>();
  return body.replace(/<h([123])>([\s\S]*?)<\/h\1>/g, (_whole, level: string, inner: string) => {
    const base = slugify(inner) || 'secao';
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    const id = count > 1 ? `${base}-${count}` : base;
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
};

export const renderBody = (slug: string, raw: string): string => {
  const withFigures = renderFigures(slug, raw)
    .replace(/src="(?!\/)([^"]+)"/g, (_whole, src: string) => `src="/assets/${WEB_IMAGES[src] ?? src}"`)
    .replace(/href="([^"#]+)\.xhtml(#[^"]*)?"/g, (_whole, target: string, hash?: string) => `href="${readingUrl(target)}${hash ?? ''}"`);
  const normalized = normalizeHeadings(withFigures);
  const listings =
    slug === 'listings'
      ? normalized.replace(/<h2>([\s\S]*?)<\/h2>/g, (_whole, inner: string) => `<h2><code>${inner.replaceAll('/', '/<wbr>')}</code></h2>`)
      : normalized;
  return addHeadingIds(listings);
};

const pagination = (index: number): string =>
  (
    [
      [index - 1, 'prev', '← Anterior'],
      [index + 1, 'next', 'Próximo →'],
    ] as const
  )
    .map(([j, rel, label]) => {
      const entry = ENTRIES[j];
      return entry ? `<a href="${readingUrl(entry.slug)}" rel="${rel}"><small>${label}</small>${escapeHtml(entry.title)}</a>` : '';
    })
    .join('');

/** Chamada para as edições completas; fica fora de <article> para não alterar a contagem de parágrafos da amostra. */
export const editionCta = (lead: string): string =>
  `<aside class="edition-cta" aria-label="Livro completo"><p class="eyebrow">LIVRO COMPLETO</p><p>${escapeHtml(lead)}</p><p class="cta-actions"><a class="button primary" href="${KINDLE_URL}">Ler na íntegra no Kindle ↗</a><a class="text-link" href="${PRINT_URL}">Livro impresso ↗</a><a class="text-link" href="${EDITIONS_PATH}">Comparar edições →</a></p></aside>`;

const guideKind = (slug: string): string => (slug.startsWith('chapter-') ? 'capítulo' : slug.startsWith('lab-') ? 'laboratório' : 'material');

interface Section {
  readonly title: string;
  readonly description: string;
  readonly notice: string;
  readonly article: string;
  readonly graph: readonly Json[];
}

const renderPage = (index: number, { title, description, notice, article, graph }: Section): string => {
  const entry = ENTRIES[index];
  if (!entry) throw new Error(`Seção inexistente: ${index}`);
  const { slug } = entry;
  const path = readingUrl(slug);
  return `${head(title, { path, description, reader: true, graph: [...graph, breadcrumb(title, path)] })}<body class="reader" data-chapter="${slug}" data-title="${escapeHtml(title)}">${HEADER}<div class="reading-progress" role="progressbar" aria-label="Progresso nesta seção" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><div class="reader-layout"><aside><details class="reader-toc" open><summary>Sumário do livro</summary><nav aria-label="Sumário">${toc(slug)}</nav></details></aside><main id="conteudo"><div class="reader-tools"><a href="/">← Apresentação</a><div class="reader-prefs" role="group" aria-label="Preferências de leitura" hidden><button id="font-down" aria-label="Diminuir fonte">A−</button><button id="font-up" aria-label="Aumentar fonte">A+</button><button id="theme" aria-pressed="false">Tema escuro</button></div></div><p class="eyebrow">ENGENHARIA DE SOFTWARE COM AGENTES DE IA</p><p class="notice">${notice}</p><article>${article}</article>${editionCta(KINDLE_PITCH)}<nav class="pagination" aria-label="Sequência de leitura">${pagination(index)}</nav><a class="text-link" href="#conteudo">Voltar ao início ↑</a></main></div><p class="sr-only" role="status" id="status"></p>${FOOTER}</body></html>`;
};

/** Seção da amostra: texto integral do EPUB. */
export const renderSamplePage = (index: number, body: string): string => {
  const entry = ENTRIES[index];
  if (!entry) throw new Error(`Seção inexistente: ${index}`);
  const { slug, title } = entry;
  return renderPage(index, {
    title,
    description: summarize(body, DEFAULT_DESCRIPTION),
    notice: `<strong>Amostra grátis.</strong> Esta seção está completa no site. O restante do livro está na íntegra no <a href="${KINDLE_URL}">Kindle ↗</a> e no <a href="${PRINT_URL}">livro impresso ↗</a>.`,
    article: body,
    graph: [{ '@type': 'Chapter', name: title, url: ORIGIN + readingUrl(slug), isPartOf: { '@id': BOOK_ID }, inLanguage: 'pt-BR', isAccessibleForFree: true }],
  });
};

/** Seção fora da amostra: guia original escrito para o site, com o título da seção como h1. */
export const renderGuidePage = (index: number, guide: { readonly description: string; readonly body: string; readonly questions: readonly Question[] }): string => {
  const entry = ENTRIES[index];
  if (!entry) throw new Error(`Seção inexistente: ${index}`);
  const { slug, title } = entry;
  const kind = guideKind(slug);
  const url = ORIGIN + readingUrl(slug);
  return renderPage(index, {
    title,
    description: guide.description,
    notice: `<strong>Guia de leitura do ${kind}.</strong> Texto original do site, que resume o ${kind} e as perguntas que ele responde. O texto completo está no <a href="${KINDLE_URL}">Kindle ↗</a> e no <a href="${PRINT_URL}">livro impresso ↗</a>.`,
    article: `<h1 id="${slugify(title)}">${escapeHtml(title)}</h1><p class="lede">Guia de leitura · ${escapeHtml(SUBTITLE)}</p>${renderMarkdown(guide.body)}`,
    graph: [
      {
        '@type': 'FAQPage',
        url,
        name: `${title} — guia de leitura`,
        description: guide.description,
        inLanguage: 'pt-BR',
        about: { '@type': 'Chapter', name: title, isPartOf: { '@id': BOOK_ID } },
        mainEntity: guide.questions.map((q): Json => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })),
      },
    ],
  });
};
