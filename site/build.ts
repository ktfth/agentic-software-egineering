// Gera o site estático em site/dist a partir da amostra (site/content, XHTML do EPUB) e dos guias (site/guides).
// Sem dependências: `bun site/build.ts` ou `node site/build.ts` (Node 24+).
import { copyFileSync, cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ASSETS_DIR,
  BOOK,
  CONTENT_DIR,
  DEFAULT_DESCRIPTION,
  EDITIONS_PATH,
  ENTRIES,
  GUIDES_DIR,
  isSample,
  KINDLE_ASIN,
  KINDLE_PITCH,
  KINDLE_URL,
  ORIGIN,
  OUT_DIR,
  PRINT_ASIN,
  PRINT_URL,
  readingUrl,
  REPO_URL,
  SITE_DIR,
  AUTHOR,
} from './src/config.ts';
import { renderEditions } from './src/editions.ts';
import { renderHome } from './src/home.ts';
import { FOOTER, HEADER, head } from './src/layout.ts';
import { parseFrontMatter, questionsOf } from './src/markdown.ts';
import { renderBody, renderGuidePage, renderSamplePage } from './src/reader.ts';

const STATIC_FILES = ['style.css', 'reader.js'] as const;
const DESCRIPTION_LIMIT = 160;

interface Guide {
  readonly description: string;
  readonly body: string;
  readonly questions: ReturnType<typeof questionsOf>;
}

const write = (relative: string, html: string): void => {
  const target = join(OUT_DIR, relative);
  mkdirSync(join(target, '..'), { recursive: true });
  writeFileSync(target, html);
};

const readBody = (slug: string): string => {
  const raw = readFileSync(join(CONTENT_DIR, `${slug}.xhtml`), 'utf8');
  const body = /<body>([\s\S]*)<\/body>/.exec(raw)?.[1];
  if (body === undefined) throw new Error(`content/${slug}.xhtml sem <body>.`);
  return body;
};

const readGuide = (slug: string): Guide => {
  const { meta, body } = parseFrontMatter(readFileSync(join(GUIDES_DIR, `${slug}.md`), 'utf8'));
  const description = meta['description'] ?? '';
  if (description.length < 80 || description.length > DESCRIPTION_LIMIT) {
    throw new Error(`guides/${slug}.md: description precisa ter de 80 a ${DESCRIPTION_LIMIT} caracteres (tem ${description.length}).`);
  }
  const questions = questionsOf(body);
  if (questions.length === 0) throw new Error(`guides/${slug}.md sem perguntas (### Pergunta?).`);
  return { description, body, questions };
};

const notFound = (): string =>
  `${head('Página não encontrada')}<body>${HEADER}<main class="shell notfound" id="conteudo"><h1>Página não encontrada.</h1><p><a class="text-link" href="/">Voltar à apresentação →</a></p></main>${FOOTER}</body></html>`;

const PAGES = ['/', EDITIONS_PATH, ...ENTRIES.map(({ slug }) => readingUrl(slug))];

const sitemap = (): string =>
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  PAGES.map((path) => `  <url><loc>${ORIGIN}${path}</loc></url>\n`).join('') +
  '</urlset>\n';

const robots = (): string => `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`;

/** Resumo do site para assistentes e mecanismos de resposta (convenção llms.txt). */
const llms = (guides: ReadonlyMap<string, Guide>): string => {
  const line = (slug: string, title: string): string => {
    const note = guides.get(slug)?.description;
    return `- [${title}](${ORIGIN}${readingUrl(slug)})${note ? `: ${note}` : ''}`;
  };
  const sample = ENTRIES.filter(({ slug }) => isSample(slug));
  const rest = ENTRIES.filter(({ slug }) => !isSample(slug));
  return [
    `# ${BOOK}`,
    '',
    `> ${DEFAULT_DESCRIPTION}`,
    '',
    `Livro de ${AUTHOR}, primeira edição em português (2026). ${KINDLE_PITCH} Este site publica a abertura e o capítulo 1 completos, como amostra, e um guia de leitura original para cada uma das demais seções.`,
    '',
    '## Edições',
    '',
    `- [Edição Kindle](${KINDLE_URL}): livro completo, na íntegra, incluído no Kindle Unlimited. ASIN ${KINDLE_ASIN}.`,
    `- [Livro impresso](${PRINT_URL}): livro completo em papel. ASIN ${PRINT_ASIN}.`,
    `- [Comparar as edições](${ORIGIN}${EDITIONS_PATH})`,
    '',
    '## Amostra (texto integral)',
    '',
    ...sample.map(({ slug, title }) => line(slug, title)),
    '',
    '## Guias de leitura',
    '',
    ...rest.map(({ slug, title }) => line(slug, title)),
    '',
    '## Código complementar',
    '',
    `- [Repositório no GitHub](${REPO_URL}): aplicação Sentinel e oito laboratórios executáveis (Node.js 24, TypeScript, SQLite).`,
    '',
  ].join('\n');
};

const build = (): void => {
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
  cpSync(ASSETS_DIR, join(OUT_DIR, 'assets'), { recursive: true });
  for (const file of STATIC_FILES) copyFileSync(join(SITE_DIR, file), join(OUT_DIR, file));

  const guides = new Map(ENTRIES.filter(({ slug }) => !isSample(slug)).map(({ slug }) => [slug, readGuide(slug)] as const));

  write('index.html', renderHome());
  write(join(...EDITIONS_PATH.split('/').filter(Boolean), 'index.html'), renderEditions());
  ENTRIES.forEach(({ slug }, index) => {
    const guide = guides.get(slug);
    const html = guide ? renderGuidePage(index, guide) : renderSamplePage(index, renderBody(slug, readBody(slug)));
    write(join('ler', slug, 'index.html'), html);
  });
  write('404.html', notFound());
  write('sitemap.xml', sitemap());
  write('robots.txt', robots());
  write('llms.txt', llms(guides));

  process.stdout.write(`Geradas ${ENTRIES.length - guides.size} seções da amostra, ${guides.size} guias, edições e apresentação. Origem: ${ORIGIN}\n`);
};

try {
  build();
} catch (error: unknown) {
  process.stderr.write(`Falha no build do site: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
