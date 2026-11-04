# Laboratório 01 — Política de URLs

## Objetivo e pré-requisitos

Implemente uma fronteira de validação para o cadastro de monitores do Sentinel. Use Node.js 24.22.1, npm 11.9.0 e o repositório completo. Nenhuma chave de API, rede de aplicação ou serviço externo é necessário. A instalação de dependências requer acesso ao registry npm.

Execute todos os comandos na raiz do repositório:

```sh
npm ci
npm run lab -- 01 starter
```

O segundo comando deve falhar inicialmente: o starter aceita protocolos e credenciais indevidos e preserva fragmentos. Isso não é uma falha da instalação.

## Tarefa

Edite `labs/01-url-policy/starter/src/policy.ts`. Preserve a função exportada `validateMonitorUrl(input: string): string`. Use a API URL do Node, permita somente HTTP/HTTPS, rejeite credenciais, remova fragmentos e devolva a URL normalizada. Não use acesso à rede.

## Critérios de aceite

- HTTP e HTTPS válidos são aceitos e retornados como string normalizada.
- URL inválida e URL relativa geram erro.
- file, ftp e javascript geram erro.
- Usuário ou senha na URL geram erro.
- Fragmento é removido; caminho e query são preservados.
- `npm run lab -- 01 starter` termina com código zero e todos os contratos.
- `npm run validate` continua passando.

O contrato executável está em `tests/lab-contracts.ts` e é compartilhado entre as variantes. Não o altere para fazer a implementação passar.

## Referência e integração

Consulte `labs/01-url-policy/solution/src/policy.ts` somente depois da tentativa. Execute `npm run lab -- 01 solution` para validar a referência. O pacote de produção está em `packages/url-policy/src/index.ts`; `npm test` cobre sua integração com SQLite e CLI.

Para reproduzir a solução no starter, copie o corpo da função da referência para o starter e execute novamente os dois comandos de aceite. A aplicação não carrega o starter: a alteração é isolada para estudo.

## Limitações e revisão

A política valida sintaxe e protocolo; não impede SSRF, DNS rebinding ou endereços privados. Sentinel ainda não faz requisições HTTP. Antes de adicionar sondagens, será necessária outra fronteira de segurança. Descreva na revisão quais testes falhavam, qual mudança os fez passar e o que eles não demonstram.
