# Agentic Software Engineering — executable companion

Code companion to *Engenharia de Software com Agentes de IA*, by Kaique Silva. This repository contains source code, tests and technical exercise instructions. The book's static site lives in `site/` (see [Book site](#book-site)); it publishes a sample of the text, not the full book. The complete book is sold as a [Kindle edition](https://www.amazon.com/dp/B0HQF2F8Z6) (KDP Select, Kindle Unlimited) and a [print edition](https://www.amazon.com/dp/B0HQGBXR4S). Print and Kindle publishing files (EPUB, PDFs, upload covers) are distributed separately.

## Requirements and reproduction

Node 24.22.1, npm 11.9.0. Run from the repository root:

```sh
npm ci
npm run validate
npm run sentinel -- add Example https://example.com
npm run sentinel -- list
npm run lab -- 01 solution
```

`SENTINEL_DB` optionally selects the SQLite file. Default: sentinel.sqlite in the current directory. The CLI registers monitors; it does not probe URLs or schedule jobs.

Eight exercises: 01 URL policy, 02 executable specification, 03 bounded agent loop, 04 file tool boundary, 05 transactional events, 06 regression invariants, 07 evaluation metrics, 08 revision-bound delivery gate. Use `npm run lab -- 02 starter` (and IDs 01–08); starter failures are intentional. Each lab README explains the acceptance contract and reference.

Runtime has no npm dependencies; TypeScript and Node typings are development dependencies pinned in package-lock.json. Tests and examples do not call an LLM or external network. Deterministic fake agents demonstrate orchestration boundaries, not model quality. No quality, latency, uptime or cost benchmark is claimed.

The file tool resolves symlinks before reading but is not a process sandbox: the file tree must not be concurrently controlled by an adversary (TOCTOU remains). The synchronous agent tools have no wall-clock cancellation, retry policy or process isolation; the step budget limits proposals only. Do not connect untrusted providers to production privileges without further boundaries.

All tests were executed locally on Linux, Node 24.22.1. CI definition runs the same suite; consult Actions for actual remote results. The examples are educational foundations, not a production monitoring platform.

## Book site

`site/` holds a sample of the book text (`site/content/*.xhtml`, opening and chapter 1 from the EPUB, about 9% of the book), original reading guides for the other 24 sections (`site/guides/*.md`) and a dependency-free TypeScript build that generates the static site published at https://engenharia-de-ia-v1.aldeia-viva.com.br. It sits outside the npm workspaces: `npm ci` and `npm run validate` do not read it, and the site build does not read the code.

```sh
node site/build.ts   # or: bun site/build.ts
node site/verify.ts  # links, anchors, headings, sitemap, CSP hashes
```

`vercel.json` deploys `site/dist` on Vercel with no install step; a failing `verify.ts` fails the deploy. Details in `site/README.md`; editorial history in `site/CHANGES.md`.
