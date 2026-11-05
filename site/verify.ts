// Confere site/dist antes de publicar. Sai com código 1 se alguma regra falhar.
// Uso: `bun site/verify.ts` ou `node site/verify.ts`, depois do build e com o mesmo SITE_ORIGIN.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { CONTENT_DIR, EDITIONS_PATH, ENTRIES, GUIDES_DIR, isSample, KINDLE_URL, ORIGIN, OUT_DIR, PRINT_URL, readingUrl, SAMPLE_SLUGS, SITE_DIR } from './src/config.ts';

const failures: string[] = [];
const fail = (message: string): void => {
  failures.push(message);
};

const walk = (dir: string): readonly string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const urlPathOf = (file: string): string => {
  const rel = '/' + relative(OUT_DIR, file).split(sep).join('/');
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;
};

/** Caminho público → arquivo em dist, como a hospedagem estática resolve. */
const resolveUrlPath = (path: string): string | null => {
  const decoded = decodeURIComponent(path);
  const candidates = decoded.endsWith('/') ? [join(OUT_DIR, decoded, 'index.html')] : [join(OUT_DIR, decoded), join(OUT_DIR, decoded, 'index.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
};

const idsOf = (html: string): readonly string[] => [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1] ?? '');
const attr = (html: string, pattern: RegExp): readonly string[] => [...html.matchAll(pattern)].map((m) => m[1] ?? '');
const count = (html: string, pattern: RegExp): number => [...html.matchAll(pattern)].length;

if (!existsSync(OUT_DIR)) {
  process.stderr.write('site/dist não existe; rode o build antes.\n');
  process.exit(1);
}

const files = walk(OUT_DIR);
const pages = files.filter((f) => f.endsWith('.html'));
const htmlByPath = new Map(pages.map((f) => [urlPathOf(f), readFileSync(f, 'utf8')] as const));
const inlineScripts = new Set<string>();

// 1. Cada seção do sumário tem página: a amostra com o mesmo número de parágrafos da fonte; as demais com guia original.
for (const { slug } of ENTRIES) {
  const html = htmlByPath.get(readingUrl(slug));
  if (!html) {
    fail(`Seção sem página: ${slug}`);
    continue;
  }
  if (!html.includes(`href="${KINDLE_URL}"`) || !html.includes(`href="${PRINT_URL}"`)) fail(`${slug}: sem chamada para Kindle e impresso.`);
  if (!isSample(slug)) {
    if (!existsSync(join(GUIDES_DIR, `${slug}.md`))) fail(`${slug}: fora da amostra e sem guides/${slug}.md.`);
    if (!html.includes('"@type": "FAQPage"')) fail(`${slug}: guia sem FAQPage no JSON-LD.`);
    continue;
  }
  const source = readFileSync(join(CONTENT_DIR, `${slug}.xhtml`), 'utf8');
  const article = /<article>([\s\S]*)<\/article>/.exec(html)?.[1] ?? '';
  const expected = count(source, /<p>/g);
  const actual = count(article, /<p>/g);
  if (expected !== actual) fail(`${slug}: ${expected} parágrafos na fonte, ${actual} na página.`);
}

// 1b. KDP Select: o texto integral fica fora do repositório. Em content/ só o sumário, a capa e a amostra.
const allowedContent = new Set(['nav.xhtml', 'cover.xhtml', ...[...SAMPLE_SLUGS].map((slug) => `${slug}.xhtml`)]);
for (const file of readdirSync(CONTENT_DIR)) if (!allowedContent.has(file)) fail(`content/${file}: fora da amostra; o texto integral não deve ser publicado (KDP Select).`);
const sectionSlugs = new Set(ENTRIES.map(({ slug }) => slug));
for (const file of readdirSync(GUIDES_DIR)) {
  const slug = file.replace(/\.md$/, '');
  if (file !== '_faq.md' && (!sectionSlugs.has(slug) || isSample(slug))) fail(`guides/${file}: não corresponde a uma seção fora da amostra.`);
}

for (const [path, html] of htmlByPath) {
  // 2. Estrutura: um h1, ids únicos, imagens com alt e dimensões.
  const h1 = count(html, /<h1[\s>]/g);
  if (h1 !== 1) fail(`${path}: ${h1} elementos <h1>.`);
  const ids = idsOf(html);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length > 0) fail(`${path}: ids duplicados ${[...new Set(dupes)].join(', ')}.`);
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\salt="[^"]+"/.test(img) || !/\swidth="\d+"/.test(img) || !/\sheight="\d+"/.test(img)) fail(`${path}: imagem sem alt/width/height: ${img}`);
  }

  // 3. Metadados apontam para a origem configurada.
  for (const url of [...attr(html, /<link rel="canonical" href="([^"]+)"/g), ...attr(html, /property="og:(?:url|image)" content="([^"]+)"/g)]) {
    if (!url.startsWith(ORIGIN + '/')) fail(`${path}: metadado fora de ${ORIGIN}: ${url}`);
  }
  if (path !== '/404.html' && !html.includes(`<link rel="canonical" href="${ORIGIN}${path}">`)) fail(`${path}: canonical diferente do caminho.`);

  // 4. Links e recursos locais existem, inclusive âncoras.
  for (const ref of attr(html, /\s(?:href|src)="([^"]+)"/g)) {
    if (/\.xhtml(?:#|$)/.test(ref)) fail(`${path}: link para XHTML do EPUB: ${ref}`);
    if (/^(?:[a-z]+:)?\/\//i.test(ref) || /^(?:mailto|tel):/.test(ref)) continue;
    const [target = '', hash] = ref.split('#');
    const file = target === '' ? (path === '/404.html' ? join(OUT_DIR, '404.html') : resolveUrlPath(path)) : resolveUrlPath(target);
    if (!file) {
      fail(`${path}: recurso local inexistente: ${ref}`);
      continue;
    }
    if (hash && file.endsWith('.html') && !idsOf(readFileSync(file, 'utf8')).includes(hash)) fail(`${path}: âncora inexistente: ${ref}`);
  }

  // 5. Nada inline que a CSP bloquearia: estilos, handlers, javascript: ou scripts com outros atributos.
  if (/<[a-z][^>]*\sstyle=|<style[\s>]/i.test(html)) fail(`${path}: estilo inline (bloqueado por style-src 'self').`);
  if (/<[a-z][^>]*\son[a-z]+=|<[a-z][^>]*\s(?:href|src)="\s*javascript:/i.test(html)) fail(`${path}: handler inline ou javascript: (bloqueado pela CSP).`);
  for (const tag of html.match(/<script\b[^>]*>/g) ?? []) {
    if (tag !== '<script>' && !/^<script src="\/[^"]+"(?: defer)?>$/.test(tag) && tag !== '<script type="application/ld+json">') fail(`${path}: script não previsto pela CSP: ${tag}`);
  }
  for (const url of attr(html, /property="og:image" content="([^"]+)"/g)) {
    if (url.startsWith(ORIGIN + '/') && !resolveUrlPath(new URL(url).pathname)) fail(`${path}: og:image inexistente em dist: ${url}`);
  }
  for (const script of html.match(/<script>[\s\S]*?<\/script>/g) ?? []) inlineScripts.add(script.slice('<script>'.length, -'</script>'.length));

  // 5b. JSON-LD válido, com o livro no grafo.
  for (const json of attr(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const graph = (JSON.parse(json) as { '@graph'?: { '@type'?: string }[] })['@graph'] ?? [];
      if (!graph.some((node) => node['@type'] === 'Book')) fail(`${path}: JSON-LD sem Book.`);
    } catch {
      fail(`${path}: JSON-LD inválido.`);
    }
  }
}

// 6. Mapa do site e robots.
const sitemap = existsSync(join(OUT_DIR, 'sitemap.xml')) ? readFileSync(join(OUT_DIR, 'sitemap.xml'), 'utf8') : '';
const expectedUrls = ['/', EDITIONS_PATH, ...ENTRIES.map(({ slug }) => readingUrl(slug))].map((p) => ORIGIN + p);
const listed = attr(sitemap, /<loc>([^<]+)<\/loc>/g);
if (listed.length !== expectedUrls.length || expectedUrls.some((u) => !listed.includes(u))) fail('sitemap.xml não lista exatamente a apresentação, as edições e as seções.');
const robots = existsSync(join(OUT_DIR, 'robots.txt')) ? readFileSync(join(OUT_DIR, 'robots.txt'), 'utf8') : '';
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) fail('robots.txt sem a URL do sitemap.');
const llms = existsSync(join(OUT_DIR, 'llms.txt')) ? readFileSync(join(OUT_DIR, 'llms.txt'), 'utf8') : '';
for (const url of expectedUrls.filter((u) => u !== `${ORIGIN}/`)) if (!llms.includes(`(${url})`)) fail(`llms.txt sem ${url}.`);
if (!llms.includes(KINDLE_URL) || !llms.includes(PRINT_URL)) fail('llms.txt sem as edições Kindle e impressa.');

// 7. A CSP de vercel.json autoriza cada script inline (e só por hash).
const vercelPath = join(SITE_DIR, '..', 'vercel.json');
const vercel = existsSync(vercelPath) ? (JSON.parse(readFileSync(vercelPath, 'utf8')) as { headers?: { headers: { key: string; value: string }[] }[] }) : {};
const csp = vercel.headers?.flatMap((h) => h.headers).find((h) => h.key.toLowerCase() === 'content-security-policy')?.value ?? '';
if (!csp) fail('vercel.json sem Content-Security-Policy.');
if (csp.includes("'unsafe-inline'")) fail("CSP não deve usar 'unsafe-inline'.");
for (const script of inlineScripts) {
  const hash = `'sha256-${createHash('sha256').update(script).digest('base64')}'`;
  if (!csp.includes(hash)) fail(`CSP sem o hash do script inline ${hash}.`);
}

if (failures.length > 0) {
  process.stderr.write(`Verificação do site falhou (${failures.length}):\n- ${failures.join('\n- ')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Site verificado: ${pages.length} páginas, ${files.length} arquivos, origem ${ORIGIN}.\n`);
}
