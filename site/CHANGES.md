# Amostra, guias, edição impressa e SEO/GEO — 05/11/2026

Resolve a pendência **KDP Select × leitura integral gratuita**: o Kindle está no KDP Select (exclusividade digital, amostra fora da Amazon de até cerca de 10%). O site deixou de publicar o texto integral. Nenhum arquivo de código, teste ou lab foi alterado.

## Conteúdo

- **Amostra:** só a abertura (`front`) e o capítulo 1 seguem integrais, com cerca de 1.870 de 20.600 palavras (~9%). Uma faixa avisa que é amostra e liga para o Kindle e o impresso.
- **Guias originais:** as outras 24 seções (capítulos 2–12, oficina, laboratórios 1–8, caderno de decisões, listagens, glossário e referências) viraram guias de leitura em `guides/*.md`, com resumo, ideias-chave e três perguntas com resposta, escritos a partir do texto. Conferência: nenhuma sequência de 8 palavras igual à fonte; 17 sequências de 7 palavras, quase todas termos técnicos (`time of check to time of use`, nomes de tópicos). As URLs `/ler/<slug>/` foram mantidas.
- **Texto integral removido do repositório:** 24 arquivos `content/*.xhtml` saíram da árvore de trabalho. O histórico do Git ainda os contém; não foi reescrito.
- **front, 1 parágrafo:** "O texto desta edição e o código-fonte do site ficam no mesmo repositório, na pasta site/" → código do site com a abertura, o capítulo 1 e guias; texto completo nas edições Kindle e impressa.
- **Edição impressa:** nova página `/edicoes/` com Kindle (na íntegra, incluída no Kindle Unlimited, ASIN `B0HQF2F8Z6`) e impresso (ASIN `B0HQGBXR4S`). Chamada "Ler na íntegra no Kindle" na apresentação, em cada seção e no rodapé. O link do Kindle passou de `a.co/d/03y9dVMC` para `amazon.com/dp/B0HQF2F8Z6`, o destino do redirecionamento conferido em 04/11.
- **Apresentação:** botão principal leva ao Kindle; "LEITURA INTEGRAL NO SITE" → "INCLUÍDO NO KINDLE UNLIMITED · AMOSTRA GRÁTIS NO SITE"; nova seção "O livro completo"; FAQ (`guides/_faq.md` + perguntas sobre as edições).

## SEO e GEO

- JSON-LD em `@graph`: `WebSite`, `Person` (autor, `sameAs` GitHub), `Book` com `workExample` para as duas edições (ASIN como `identifier`); `Chapter` nas páginas da amostra; `FAQPage` nos guias, em `/edicoes/` e na apresentação; `BreadcrumbList` nas páginas internas.
- Títulos: "<seção> — Engenharia de Software com Agentes de IA"; apresentação "… — livro de Kaique Silva". `meta description` própria em cada guia. `og:site_name`, `meta author`, `og:type` `article` nas páginas internas.
- `llms.txt` (resumo do site para assistentes de IA: edições, amostra, guias com descrição, código). `sitemap.xml` inclui `/edicoes/`.

## Verificações

`node site/build.ts`, `node site/verify.ts` (29 páginas) e `tsc -p site/tsconfig.json` sem erro. Chrome headless: apresentação, edições e guia em 1440 px; rolagem horizontal medida em 390 px em 10 páginas, sem excedente depois de quebrar o SHA longo no FAQ.

## Pendências

1. **Dados do impresso:** ISBN, número de páginas, formato (capa comum ou dura) e dimensões não foram incluídos. A página da Amazon não pôde ser lida automaticamente e nada disso foi inventado. Com os dados, dá para acrescentar `isbn`, `numberOfPages` e `bookFormat` ao JSON-LD.
2. **Marketplace:** os links usam `amazon.com`, como informado. Considerar `amazon.com.br` para leitores no Brasil.
3. `AGENTS.md` ainda diz que "the book text and its static site live in site/"; hoje lá fica só a amostra.
4. O EPUB/PDF do KDP não refletem as alterações de texto do site (como antes).

# Integração ao repositório e à Vercel — 04/11/2026

O site passou a morar em `site/` do repositório `ktfth/agentic-software-egineering`, fora dos workspaces do npm. O commit de referência do código (`be005f2…`) não mudou: nenhum arquivo de código, teste ou lab foi alterado.

## Conferências

| Verificação | Resultado |
|---|---|
| Nome do repositório × livro | O livro (EPUB, manuscrito, guia KDP) usa sempre `agentic-software-egineering` e pede ao leitor que preserve essa grafia; o repositório tem exatamente esse nome. Mantido. |
| Listagens do livro × código | As 10 listagens de `source-listings.md` do pacote KDP são idênticas aos arquivos de `be005f2`. |
| Testes do código | `tsc -p tsconfig.json` + `node --test dist/tests/*.test.js`: 12/12 aprovados (Windows, Node 24.15.0). GitHub Actions `validate`: sucesso em `be005f2` (run 41876058866) e em `a53dbfc`. |
| Port do build para TypeScript | Com a origem antiga, `build.ts` gera `dist/` byte a byte idêntico ao do `build.py` (Bun 1.2.15 e Node 24.15.0). |
| Link Kindle `a.co/d/03y9dVMC` | Redireciona (301) para `amazon.com/dp/B0HQF2F8Z6`. A página do produto não pôde ser lida automaticamente (HTTP 500 para o robô); conferir o título no navegador. |
| Domínio | `engenharia-de-ia-v1.aldeia-viva.com.br`, vinculado ao projeto Vercel `engenharia-de-ia-aldeia-viva-com-br`; `aldeia-viva.com.br` usa o DNS da Vercel. |
| Navegador | Chrome headless sob a CSP de produção: apresentação, capítulos, listagens e 404 em 1440 px e 390 px, sem rolagem horizontal. |

## Mudanças

- `build.py` → `build.ts` + `src/` (TypeScript sem dependências; Bun ou Node 24). Python deixou de ser necessário.
- `verify.ts`: conferência automática do `dist/` (integridade das 26 seções, links, âncoras, `<h1>`, ids, imagens, origem, sitemap, CSP). Roda no build da Vercel e na CI.
- `SITE_ORIGIN` padrão: `https://engenharia-de-ia-v1.aldeia-viva.com.br`.
- `sitemap.xml`, `robots.txt` e `favicon.svg`.
- Rodapé com "Código-fonte do site ↗" (`/tree/main/site`).
- `aria-current="page"` com aspas e sem espaço duplo no sumário.
- `vercel.json` na raiz: sem instalação, build + verificação, saída `site/dist`, `trailingSlash`, CSP com hash do script de tema, `nosniff`, HSTS, `Referrer-Policy`, `Permissions-Policy`, cache de 1 dia para `/assets/`.
- CI: job `site` separado (o job `code` não mudou).

## Texto — 5 parágrafos alterados

| Arquivo | Mudança | Motivo |
|---|---|---|
| chapter-09 | "não havia execução de Actions registrada para o commit de referência" → registra a execução bem-sucedida do workflow `validate` | Fato desatualizado: há run com sucesso para `be005f2` |
| chapter-09 | "O código complementar foi separado do produto editorial para que suas alterações não publiquem inadvertidamente o manuscrito…" → código e texto no mesmo repositório, em fronteiras separadas (`site/` fora dos workspaces) | O texto agora é publicado no repositório |
| chapter-09 | "os arquivos editoriais guardam a referência da versão usada" → o texto em `site/` registra a referência | Idem |
| chapter-12 | "o repositório público contenha apenas o material de execução" → a separação impede que site e código alterem um ao outro | Idem |
| front | Acrescenta que o texto e o código-fonte do site ficam em `site/` | O leitor precisa saber onde está o texto |

## Pendências atualizadas

1. **KDP Select × leitura integral gratuita** — continua em aberto e ficou mais relevante: o texto integral agora está no site *e* no GitHub público. Com o Select (exclusividade digital), isso não é permitido.
2. ~~Domínio final~~ — resolvido.
3. **Link Kindle** — redireciona para o ASIN `B0HQF2F8Z6`; falta só confirmar visualmente o título na Amazon.
4. **Renomear o repositório** — não recomendado agora: o EPUB e o PDF do pacote KDP imprimem `egineering` e pedem ao leitor que preserve a grafia. Renomear exigiria regerar EPUB/PDF e mudar o texto da abertura.
5. Pasta `labs/05-migrations`, `Invalid proposal` × `Forbidden tool` e repetição nos laboratórios — como antes (itens 4 e 5 da revisão abaixo).
6. O pacote KDP (`RELATORIO-ENTREGA.md`) ainda diz que não havia workflow run registrado e que o manuscrito não foi enviado ao GitHub; ambos deixaram de ser verdade. O EPUB e o PDF do KDP não incluem as 5 alterações de texto acima nem as 9 da revisão anterior.

# Revisão de 04/11/2026 (pacote do site) — mudanças aplicadas e pendências

Referência do código complementar: `ktfth/agentic-software-egineering` @ `be005f2f334740f02d0c647361f0698f2edeed11` (HEAD na data da revisão). As alegações do livro foram conferidas por leitura estática desse commit; `npm ci` / `npm run validate` não foram executados nesta revisão.

## Texto (`content/*.xhtml`) — 9 parágrafos alterados, nenhum outro tocado

| Arquivo | Mudança | Motivo |
|---|---|---|
| front | "o manuscrito, a composição gráfica e os arquivos de publicação são distribuídos separadamente" → "não depende dos arquivos editoriais" | Contradizia o site que publica o manuscrito |
| front | Removida a frase "Quem publica permanece responsável pela leitura editorial final…" | Instrução ao editor, não ao leitor |
| front | "apresentada nos arquivos de acompanhamento" → SHA explícito `be005f2…` | O leitor não recebe pacote de acompanhamento |
| references | "Consulte o arquivo de informações de publicação que acompanha o pacote…" → SHA explícito | Idem |
| chapter-09 | "O envio por ferramenta de integração não tinha…" → "No momento da verificação, não havia execução de Actions registrada para o commit de referência." | Linguagem de bastidor. **Reconfirmar o fato no GitHub Actions antes de publicar.** |
| chapter-12 | "Nesta entrega editorial, o manuscrito completo é em português." → "Esta edição é publicada em português." | Linguagem de bastidor |
| chapter-04 | Esclarece que `runAgent` agrupa propostas-objeto malformadas sob `Forbidden tool`; `Invalid proposal` só para não-objeto | Texto dizia que havia erros distintos; o código não distingue |
| lab-01 | Extensão: porta padrão já é coberta (`:443`); propõe somente senha e IPv6 | Extensão pedia caso já coberto pelo contrato |
| lab-04 | "executado em Linux" → "executado fora do Windows; a verificação ocorreu em Linux" | Código usa `platform !== 'win32'` |
| chapter-01, cover | Alt das imagens corrigidos/unificados | Alt da gravura descrevia a capa |

## Site

- `SITE_ORIGIN` configurável no build.
- Imagens: gravuras 3,3–3,8 MB PNG → ~300–370 KB WebP (1200 px); capa exibida 615 KB → 41 KB; `og.jpg` 1200×630 dedicado (a capa em retrato era cortada no cartão). `dist/` caiu de ~8,4 MB para ~1,4 MB.
- `width`/`height` em todas as imagens; `loading="lazy"` exceto a primeira de cada página.
- Diagramas PNG (texto ilegível no celular, rótulo duplicado com a legenda, bloco branco no tema escuro) → sequência HTML acessível (`<ol>`), horizontal no desktop e vertical no celular.
- Tema escuro sem flash: script inline no `<head>`; sem preferência salva, segue `prefers-color-scheme`. Classe `dark` agora no `<html>`.
- Controles A−/A+/Tema ocultos sem JS.
- Um `<h1>` por página (abertura e referências tinham 6 e 3); subtítulo da abertura vira `.lede`; ids de títulos deduplicados.
- `meta description` e `og:description` por seção (primeiro parágrafo); `og:title` inclui o nome do livro; JSON-LD com `url`.
- Contraste não textual (WCAG 1.4.11): borda dos botões 1,68:1 → 3,81:1 (claro) / 4,42:1 (escuro); barra de progresso 2,96:1 → 3,86:1 / 4,67:1.
- Setas: `↗` só em links externos; internos usam `→`. Removida a legenda da capa que repetia o texto impresso nela.
- Acessibilidade: `aria-label` saiu da `div` sem papel e do `<pre>` (que substituía o código para leitores de tela); `<pre>` agora é `role="group"`; preferências em `role="group"`.
- Títulos das listagens em `<code>` com quebra após `/` (antes quebravam no meio da palavra no celular).
- Gravação da posição de leitura com debounce de 500 ms (antes a cada frame de rolagem).
- 404 com alvo do "pular para o conteúdo" e rodapé.

Verificações feitas: build sem erro; sintaxe JS; 26 seções com mesma contagem de parágrafos e só os 9 intencionais alterados; zero links/âncoras locais quebrados; um `<h1>` por página; ids únicos; inspeção visual em 1440×900 e 390×844, tema escuro por sistema, alternância persistida, sem JS; sem erros de console; sem rolagem horizontal.

## Decisões pendentes (não aplicadas)

1. **KDP Select × leitura integral gratuita.** O Select exige exclusividade digital da Amazon (até 10% de amostra fora). Ou não aderir ao Select, ou reduzir o site a uma amostra (ex.: abertura + capítulo 1) e ajustar "LEITURA INTEGRAL NO SITE · SEM CADASTRO".
2. **Domínio final.** Definir e passar em `SITE_ORIGIN`.
3. **Link Kindle `https://a.co/d/03y9dVMC`.** Não foi possível abri-lo na revisão; confirmar que aponta para o ASIN correto e que o livro está publicado.
4. **Repositório (fora deste pacote):**
   - Renomear `agentic-software-egineering` → `agentic-software-engineering` antes do impresso (GitHub redireciona o nome antigo); depois atualizar URLs em `front`, `references`, `site/src/config.ts` e remover o parágrafo sobre a grafia.
   - Pasta `labs/05-migrations` não corresponde ao conteúdo (lote transacional); renomear exige atualizar slugs em `tests/lab-contracts.ts`, `scripts/verify-labs.mjs`, `lab-05.xhtml` e listagens.
   - Opcional: separar `Invalid proposal` de `Forbidden tool` em `runAgent` (se fizer, reverter a frase nova do cap. 4 e atualizar a listagem/SHA).
5. **Repetição nos laboratórios.** "Preparação", 2º/3º parágrafos de "Leitura da referência" e "Registro de conclusão" são idênticos nos 8 labs; candidatos a ir para a introdução da oficina (decisão editorial).
