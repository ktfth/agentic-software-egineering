// Markdown mínimo dos guias (guides/*.md): front matter `chave: valor`, ##, ###, parágrafos, listas com "- ",
// **negrito**, `código` e links locais [texto](/caminho/). Qualquer outra construção falha o build.
import { escapeHtml, slugify } from './text.ts';

export interface MarkdownDoc {
  readonly meta: Readonly<Record<string, string>>;
  readonly body: string;
}

export interface Question {
  readonly question: string;
  readonly answer: string;
}

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;

export const parseFrontMatter = (source: string): MarkdownDoc => {
  const match = FRONT_MATTER.exec(source);
  if (!match) return { meta: {}, body: source };
  const meta = Object.fromEntries(
    (match[1] ?? '').split(/\r?\n/).map((line) => {
      const separator = line.indexOf(':');
      if (separator < 1) throw new Error(`Front matter inválido: "${line}"`);
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
    }),
  );
  return { meta, body: source.slice(match[0].length) };
};

/** Inline: escapa HTML e só então aplica código, negrito e links locais. */
export const inline = (text: string): string => {
  const parts = text.split(/(`[^`]+`)/);
  return parts
    .map((part, i) => {
      if (i % 2 === 1) return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
      return escapeHtml(part)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_whole, label: string, href: string) => {
          if (!href.startsWith('/')) throw new Error(`Guia com link externo ou relativo não previsto: ${href}`);
          return `<a href="${href}">${label}</a>`;
        });
    })
    .join('');
};

const blocksOf = (body: string): readonly string[] =>
  body
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean);

const renderBlock = (block: string): string => {
  const heading = /^(#{2,3}) (.+)$/.exec(block);
  if (heading) {
    const level = (heading[1] ?? '').length;
    const html = inline(heading[2] ?? '');
    return `<h${level} id="${slugify(html)}">${html}</h${level}>`;
  }
  const lines = block.split(/\r?\n/);
  if (lines.every((line) => line.startsWith('- '))) return `<ul>${lines.map((line) => `<li>${inline(line.slice(2))}</li>`).join('')}</ul>`;
  if (/^(#|```|\||<|!\[|\d+\. )/.test(block)) throw new Error(`Construção Markdown não suportada: ${block.slice(0, 60)}`);
  return `<p>${inline(lines.join(' '))}</p>`;
};

export const renderMarkdown = (body: string): string => blocksOf(body).map(renderBlock).join('');

/** Pares pergunta/resposta: cada "### Pergunta?" seguido do primeiro parágrafo. Texto puro, para JSON-LD. */
export const questionsOf = (body: string): readonly Question[] => {
  const blocks = blocksOf(body);
  return blocks.flatMap((block, i) => {
    const question = /^### (.+\?)$/.exec(block)?.[1];
    const answer = blocks[i + 1];
    if (!question || !answer || answer.startsWith('#')) return [];
    const plain = (text: string): string => text.replace(/`([^`]+)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    return [{ question: plain(question), answer: plain(answer.replace(/\r?\n/g, ' ')) }];
  });
};
