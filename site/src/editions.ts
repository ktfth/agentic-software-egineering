import { ASSETS_DIR, BOOK, COVER_ALT, EDITIONS_PATH, KINDLE_ASIN, KINDLE_URL, ORIGIN, PRINT_ASIN, PRINT_URL, REPO_URL } from './config.ts';
import { imageSize } from './images.ts';
import { breadcrumb, FOOTER, HEADER, head } from './layout.ts';
import { questionsOf, renderMarkdown } from './markdown.ts';
import type { Json } from './text.ts';

/** Perguntas sobre as edições; usadas aqui e no FAQ da apresentação. */
export const EDITIONS_FAQ = `### Posso ler o livro inteiro de graça no site?

Não. O site traz a abertura e o capítulo 1 completos, como amostra, e um guia de leitura original para cada um dos outros capítulos e laboratórios. O texto integral está na edição Kindle e no livro impresso.

### Onde leio o livro completo?

Na edição Kindle, na íntegra, incluída no Kindle Unlimited: quem assina lê sem comprar o título. Quem prefere papel encontra o livro impresso na Amazon.

### Qual a diferença entre a edição Kindle e o livro impresso?

O formato. As duas edições trazem o livro completo, com os doze capítulos, os oito laboratórios e os materiais de apoio, e remetem ao mesmo código complementar público no GitHub.`;

const DESCRIPTION =
  'Onde ler o livro completo: edição Kindle na íntegra, incluída no Kindle Unlimited, e livro impresso na Amazon. O site traz amostra grátis e guias.';

export const renderEditions = (): string => {
  const cover = imageSize(ASSETS_DIR, 'capa-700.webp');
  const title = 'Edições: Kindle e livro impresso';
  const graph: readonly Json[] = [
    {
      '@type': 'FAQPage',
      url: ORIGIN + EDITIONS_PATH,
      name: `${title} — ${BOOK}`,
      description: DESCRIPTION,
      inLanguage: 'pt-BR',
      about: { '@id': `${ORIGIN}/#livro` },
      mainEntity: questionsOf(EDITIONS_FAQ).map((q): Json => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })),
    },
    breadcrumb(title, EDITIONS_PATH),
  ];
  return `${head(title, { path: EDITIONS_PATH, description: DESCRIPTION, graph })}<body>${HEADER}<main id="conteudo" class="shell editions"><section class="editions-hero"><div><p class="eyebrow">EDIÇÕES DO LIVRO</p><h1>${BOOK}: Kindle e livro impresso.</h1><p class="subtitle">O livro completo, na íntegra, em dois formatos.</p></div><figure class="cover"><img src="/assets/capa-700.webp" alt="${COVER_ALT}" width="${cover.width}" height="${cover.height}" fetchpriority="high"></figure></section><section class="edition-grid" aria-label="Formatos"><article class="edition-card"><p class="eyebrow">EBOOK</p><h2>Edição Kindle</h2><p><strong>Na íntegra</strong>, com os doze capítulos, os oito laboratórios e os materiais de apoio. Incluída no <strong>Kindle Unlimited</strong>: assinantes leem sem comprar o título.</p><p class="micro">ASIN ${KINDLE_ASIN}</p><a class="button primary" href="${KINDLE_URL}">Ler no Kindle ↗</a></article><article class="edition-card"><p class="eyebrow">PAPEL</p><h2>Livro impresso</h2><p>O mesmo livro completo em papel, vendido pela Amazon. Para ler com caneta na mão e o terminal aberto ao lado.</p><p class="micro">ASIN ${PRINT_ASIN}</p><a class="button primary" href="${PRINT_URL}">Comprar o impresso ↗</a></article></section><section class="editions-site"><p class="eyebrow">NO SITE, SEM CADASTRO</p><h2>Amostra, guias e código.</h2><ul><li><a href="/ler/front/">Abertura e guia de leitura</a> e <a href="/ler/chapter-01/">capítulo 1</a> completos.</li><li>Um guia de leitura original para cada capítulo e laboratório, no <a href="/#sumario">sumário</a>.</li><li>O <a href="${REPO_URL}">código complementar no GitHub ↗</a>, com os oito laboratórios executáveis.</li></ul></section><section class="faq"><p class="eyebrow">PERGUNTAS FREQUENTES</p><h2>Sobre as edições</h2>${renderMarkdown(EDITIONS_FAQ)}</section></main>${FOOTER}</body></html>`;
};
