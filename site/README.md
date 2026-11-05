# Engenharia de Software com Agentes de IA — site oficial

Site estático do livro, publicado em <https://engenharia-de-ia-v1.aldeia-viva.com.br>. O Kindle está no KDP Select, que exige exclusividade digital: o site publica só uma amostra (abertura e capítulo 1, cerca de 9% do texto, em `content/`) e um guia de leitura original para cada uma das outras 24 seções (`guides/`). O texto integral fica fora deste repositório; o leitor o encontra na [edição Kindle](https://www.amazon.com/dp/B0HQF2F8Z6), incluída no Kindle Unlimited, e no [livro impresso](https://www.amazon.com/dp/B0HQGBXR4S). Não há serviços de análise, cadastro ou chamadas de modelo.

O site fica fora dos workspaces do npm: `npm ci` e `npm run validate` na raiz não dependem desta pasta, e o build do site não depende do código complementar.

## Executar

TypeScript sem dependências, executado diretamente pelo runtime (Bun ou Node.js 24+, que remove os tipos ao carregar):

```sh
bun site/build.ts                 # gera site/dist
bun site/verify.ts                # confere o resultado
bunx serve site/dist              # ou qualquer servidor estático
```

Com Node.js: `node site/build.ts && node site/verify.ts`.

`SITE_ORIGIN` define a origem usada em canonical, `og:url`, `og:image`, JSON-LD, `sitemap.xml`, `robots.txt` e `llms.txt`. Padrão: `https://engenharia-de-ia-v1.aldeia-viva.com.br`. O build apaga e recria `dist/`.

Checagem de tipos (usa o TypeScript fixado na raiz): `bun install` e depois `./node_modules/.bin/tsc -p site/tsconfig.json`.

## Publicação na Vercel

`vercel.json`, na raiz do repositório, já define tudo: sem etapa de instalação, build `node site/build.ts && node site/verify.ts`, saída `site/dist`, barra final nas URLs e cabeçalhos de segurança (CSP por hash, `nosniff`, HSTS, `Referrer-Policy`, `Permissions-Policy`). Se `verify.ts` falhar, o deploy falha.

1. O projeto Vercel `engenharia-de-ia-aldeia-viva-com-br` (time `kaeyosthaerons-projects`) está conectado a este repositório, com Root Directory na raiz e framework "Other"; merges no `main` publicam em produção e cada PR gera um preview. Não há variáveis a configurar.
2. Em *Domains*, o projeto `engenharia-de-ia-aldeia-viva-com-br` já tem `engenharia-de-ia-v1.aldeia-viva.com.br` (o domínio `aldeia-viva.com.br` usa o DNS da Vercel).
3. Para um domínio diferente, defina `SITE_ORIGIN` nas variáveis do projeto.

## O que `verify.ts` confere

- cada seção do sumário do EPUB tem página: as da amostra com o mesmo número de parágrafos da fonte; as demais com `guides/<slug>.md` e `FAQPage` no JSON-LD;
- `content/` só contém `nav.xhtml`, `cover.xhtml` e a amostra (`SAMPLE_SLUGS` em `src/config.ts`); um XHTML a mais falha a verificação, para o texto integral não voltar ao site por engano;
- toda seção liga para o Kindle e para o impresso; o JSON-LD de toda página é JSON válido e contém o `Book`;
- um `<h1>` por página, ids únicos, imagens com `alt`, `width` e `height`;
- canonical, `og:url` e `og:image` na origem configurada;
- todos os links, recursos e âncoras locais existem; nenhum link `.xhtml` sobrou;
- `sitemap.xml` lista exatamente a apresentação, `/edicoes/` e as 26 seções; `robots.txt` aponta para ele; `llms.txt` lista as mesmas páginas e as duas edições;
- a CSP de `vercel.json` autoriza cada script inline pelo hash, sem `'unsafe-inline'`.

## Estrutura

- `content/*.xhtml`: amostra do EPUB (abertura e capítulo 1) e o sumário (`nav.xhtml`), que define a ordem das 26 seções.
- `guides/*.md`: guias de leitura originais das outras 24 seções (resumo, ideias-chave, perguntas e respostas) e `_faq.md`, o FAQ da apresentação. Markdown mínimo, convertido por `src/markdown.ts`: `##`, `###`, parágrafos, listas `- `, `**negrito**`, `código` e links locais; outra construção falha o build. O front matter traz a `description` (80–160 caracteres). Cada `### Pergunta?` seguido de parágrafo vira um item do `FAQPage`.
- `assets/`: imagens servidas — `capa.jpg` (alta resolução, JSON-LD), `capa-700.webp` (exibição), `og.jpg` (cartão 1200×630), gravuras em WebP e `favicon.svg`.
- `assets-originais/`: imagens originais do EPUB (PNGs das gravuras e dos diagramas). Não são publicadas.
- `build.ts` e `src/`: conversão (`reader.ts`), página inicial (`home.ts`), edições Kindle e impressa (`editions.ts`, em `/edicoes/`), guias (`markdown.ts`), cabeçalho e metadados, com o grafo JSON-LD de site, autor, livro e edições (`layout.ts`), configuração (`config.ts`), leitura de dimensões de imagem (`images.ts`) e utilitários de texto (`text.ts`). Diagramas do EPUB viram uma sequência HTML gerada do texto alternativo (`Relação conceitual: A, depois B, …`).
- `style.css`: paleta, layout responsivo, leitor e foco.
- `reader.js`: fonte 17–27 px, tema (salvo ou do sistema), posição relativa, progresso e cópia. Preferências ficam só no navegador (localStorage). Sem JS, a leitura funciona e os controles ficam ocultos.

Ao alterar o script inline de tema (`THEME_BOOT` em `src/layout.ts`), atualize o hash na CSP de `vercel.json`; `verify.ts` mostra o valor esperado.

## Histórico editorial

Ver `CHANGES.md`.
