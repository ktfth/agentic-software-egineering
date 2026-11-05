import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ASSETS_DIR, BOOK, CONTENT_DIR, COVER_ALT, EDITIONS_PATH, type Entry, ENTRIES, GUIDES_DIR, KINDLE_URL, ORIGIN, PRINT_URL, readingUrl, REPO_URL, WORKSHOP_ALT } from './config.ts';
import { EDITIONS_FAQ } from './editions.ts';
import { imageSize } from './images.ts';
import { FOOTER, HEADER, head } from './layout.ts';
import { questionsOf, renderMarkdown } from './markdown.ts';
import { escapeHtml, type Json, unescapeHtml } from './text.ts';

const QUOTE_HEADING = 'Três afirmações diferentes';

/** Parágrafo que segue o título "Três afirmações diferentes" no capítulo 1. */
const readQuote = (): string => {
  const chapter = readFileSync(join(CONTENT_DIR, 'chapter-01.xhtml'), 'utf8');
  const match = new RegExp(`<h2>${QUOTE_HEADING}</h2>\\s*<p>([^<]*)`).exec(chapter);
  if (!match?.[1]) throw new Error(`Trecho "${QUOTE_HEADING}" não encontrado em chapter-01.xhtml.`);
  return unescapeHtml(match[1]);
};

const rows = (items: readonly Entry[]): string =>
  items
    .map(
      ({ slug, title }, i) =>
        `<li><a href="${readingUrl(slug)}"><span class="number">${String(i + 1).padStart(2, '0')}</span><span>${escapeHtml(title.replace(/^(\d+\. |Laboratório \d+ - )/, ''))}</span><span aria-hidden="true">→</span></a></li>`,
    )
    .join('');

export const renderHome = (): string => {
  const chapters = ENTRIES.slice(1, 13);
  const labs = ENTRIES.slice(14, 22);
  const support = [...ENTRIES.slice(0, 1), ...ENTRIES.slice(22)];
  const cover = imageSize(ASSETS_DIR, 'capa-700.webp');
  const workshop = imageSize(ASSETS_DIR, 'evidence-workshop.webp');
  const faq = `${readFileSync(join(GUIDES_DIR, '_faq.md'), 'utf8').trim()}\n\n${EDITIONS_FAQ}`;
  const faqPage: Json = {
    '@type': 'FAQPage',
    url: `${ORIGIN}/`,
    inLanguage: 'pt-BR',
    about: { '@id': `${ORIGIN}/#livro` },
    mainEntity: questionsOf(faq).map((q): Json => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })),
  };
  return `${head(BOOK, { graph: [faqPage] })}<body>${HEADER}<main id="conteudo"><section class="hero shell"><div class="hero-copy"><p class="eyebrow">PRIMEIRA EDIÇÃO EM PORTUGUÊS · 2026</p><h1>Engenharia de Software<br>com Agentes de IA<span class="period">.</span></h1><p class="subtitle">Evidência, ferramentas e<br>autonomia sob controle</p><p class="byline">Um livro de <strong>Kaique Silva</strong></p><div class="actions"><a class="button primary" href="${KINDLE_URL}">Ler na íntegra no Kindle ↗</a><a class="text-link" href="${PRINT_URL}">Livro impresso ↗</a><a class="text-link" href="/ler/chapter-01/">Ler a amostra grátis →</a></div><a class="resume" hidden href="/ler/chapter-01/">Continuar de onde parei →</a><p class="micro">INCLUÍDO NO KINDLE UNLIMITED · AMOSTRA GRÁTIS NO SITE, SEM CADASTRO</p></div><figure class="cover"><img src="/assets/capa-700.webp" alt="${COVER_ALT}" width="${cover.width}" height="${cover.height}" fetchpriority="high"></figure></section><section class="premise shell editorial"><p class="eyebrow">01 / A PREMISSA</p><h2>Autonomia precisa<br>de algo que a sustente.</h2><div><p>Código executável é a principal evidência de uma alegação funcional.</p><p>Uma base de julgamento para delegar melhor a agentes: transformar propostas em mudanças que podem ser verificadas, revisadas e recuperadas, sem eliminar a revisão humana.</p></div></section><section class="map shell" id="sumario"><div class="section-head"><div><p class="eyebrow">02 / O MAPA DO LIVRO</p><h2>Da intenção à evidência.<br>Da evidência à entrega.</h2></div><p>12 capítulos · 8 laboratórios<br>Capítulo 1 completo no site; guias de leitura dos demais.</p></div><p class="sequence">Evidência → ambiente → especificação → execução → ferramentas → dados → testes → avaliação → revisão → operação</p><div class="map-grid"><div><h3>Leitura</h3><ol class="chapter-list">${rows(chapters)}</ol></div><div class="workshop"><p class="eyebrow">OFICINA</p><h3>Execute. Compare. Explique.</h3><p>Oito exercícios independentes para investigar os limites de cada conclusão.</p><ol class="lab-list">${rows(labs)}</ol><a class="text-link" href="/ler/labs/">Abrir a oficina →</a><details><summary>Abertura e materiais de apoio</summary><ul>${support.map(({ slug, title }) => `<li><a href="${readingUrl(slug)}">${escapeHtml(title)}</a></li>`).join('')}</ul></details></div></div></section><section class="excerpt"><div class="shell excerpt-grid"><figure><img src="/assets/evidence-workshop.webp" alt="${WORKSHOP_ALT}" width="${workshop.width}" height="${workshop.height}" loading="lazy" decoding="async"><figcaption>O caminho da evidência · ilustração metafórica</figcaption></figure><div><p class="eyebrow">03 / UM TRECHO DO CAPÍTULO 01</p><h2>Três afirmações<br>diferentes.</h2><blockquote><p>${escapeHtml(readQuote())}</p></blockquote><a class="text-link" href="/ler/chapter-01/#tres-afirmacoes-diferentes">Ler o trecho no capítulo →</a></div></div></section><section class="shell editions-home" id="edicoes"><p class="eyebrow">04 / O LIVRO COMPLETO</p><h2>Na íntegra no Kindle.<br>E também impresso.</h2><div class="edition-grid"><article class="edition-card"><h3>Edição Kindle</h3><p>O livro completo, incluído no <strong>Kindle Unlimited</strong>: quem assina lê sem comprar o título.</p><a class="button primary" href="${KINDLE_URL}">Ler no Kindle ↗</a></article><article class="edition-card"><h3>Livro impresso</h3><p>O mesmo livro completo em papel, vendido pela Amazon.</p><a class="button primary" href="${PRINT_URL}">Comprar o impresso ↗</a></article></div><a class="text-link" href="${EDITIONS_PATH}">Comparar as edições →</a></section><section class="shell editorial audience"><p class="eyebrow">05 / PARA QUEM É</p><h2>Para quem já constrói.<br>E quer delegar melhor.</h2><div><p>Para quem já navega em um projeto JavaScript ou TypeScript, usa o terminal e reconhece testes básicos.</p><p>Não exige assinatura de API de modelo nem banco externo. O Sentinel é uma aplicação local mínima, com SQLite e CLI.</p></div></section><section class="code-section shell" id="codigo"><div><p class="eyebrow">06 / CÓDIGO COMPLEMENTAR</p><h2>A explicação encontra<br>o terminal.</h2><p>Ambiente de referência<br><strong>Node.js 24.22.1 · npm 11.9.0</strong></p><a class="text-link" href="${REPO_URL}">Abrir repositório no GitHub ↗</a></div><div><p class="micro">NA RAIZ DO REPOSITÓRIO</p><pre><code>npm ci\nnpm run validate</code></pre><p>A instalação inicial requer acesso ao registry npm. Depois, os exemplos e testes executam localmente.</p></div></section><section class="transparency shell"><p class="eyebrow">07 / TRANSPARÊNCIA EDITORIAL</p><h2>Os limites também fazem parte da evidência.</h2><p>O texto e as ilustrações foram produzidos com ferramentas de inteligência artificial. A execução dos exemplos técnicos foi verificada na preparação desta edição.</p><p>Não houve avaliação de desempenho de modelos nem revisão técnica humana independente. Os agentes dos testes são simuladores determinísticos. O Sentinel é uma aplicação local mínima: cadastra e lista monitores; não visita URLs, não oferece monitoramento contínuo e não integra um provedor de IA.</p><a class="text-link" href="/ler/front/">Ler a nota completa desta edição →</a></section><section class="author shell editorial"><p class="eyebrow">08 / O AUTOR</p><h2>Kaique Silva</h2><div><p>Kaique Silva é engenheiro de software e fundador da Aldeia Viva. Sua atuação conecta implementação, validação e entrega de sistemas.</p><p>Neste livro, seu foco é uma prática de engenharia em que a colaboração com agentes permanece ligada a resultado observável e responsabilidade pelo produto.</p><a class="text-link" href="https://github.com/ktfth">github.com/ktfth ↗</a></div></section><section class="faq shell" id="perguntas"><p class="eyebrow">09 / PERGUNTAS FREQUENTES</p><h2>Perguntas sobre o livro</h2>${renderMarkdown(faq)}</section><section class="closing shell"><p class="eyebrow">A PRÓXIMA LINHA É SUA.</p><h2>Comece pela evidência.</h2><div class="actions"><a class="button primary" href="${KINDLE_URL}">Ler na íntegra no Kindle ↗</a><a class="text-link" href="/ler/chapter-01/">Ler a amostra grátis →</a></div></section></main>${FOOTER}</body></html>`;
};
