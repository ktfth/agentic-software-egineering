---
description: Apêndice com o código do Sentinel, do runtime de agentes, dos contratos dos oito laboratórios e da CI, todo fixado em uma única revisão do repositório.
---
Explicar um comportamento em prosa sempre deixa espaço para dúvida sobre o que o programa de fato faz. Este apêndice fecha essa lacuna ao reunir, em forma de leitura, os arquivos que sustentam os exemplos e os exercícios do livro, todos tirados de um mesmo commit do repositório público.

## O que a seção cobre

A abertura do apêndice define como ler o material: as listagens correspondem à revisão `be005f2f334740f02d0c647361f0698f2edeed11`, o repositório continua sendo a referência para executar qualquer coisa, e algumas quebras de linha do impresso existem só por causa da diagramação. O código foi escrito para esta distribuição e não é trecho copiado de biblioteca de terceiros.

Depois vêm os arquivos, agrupados por papel. Primeiro a aplicação mínima do Sentinel: a política de URL em `packages/url-policy`, o armazenamento com `node:sqlite` e a CLI. Em seguida, o pacote `packages/agent-runtime`, com as funções de referência discutidas nos capítulos, como `runAgent` e `releaseGate`. O apêndice termina com os testes, o arquivo de contratos dos oito [laboratórios](/ler/labs/), os scripts de execução e verificação e o workflow de integração contínua.

## Ideias-chave

- A revisão fixa permite comparar cada explicação dos capítulos com o programa exato que foi executado, sem depender do estado atual da branch.
- As listagens servem para leitura e consulta; para executar, o caminho indicado é obter o repositório, e não redigitar o texto impresso.
- Os contratos de todos os laboratórios ficam reunidos em um único arquivo de testes, o que deixa explícito o comportamento que cada exercício precisa demonstrar.
- O script de verificação confirma que cada starter falha antes de receber a referência, passa depois dela e volta ao estado original ao final.
- A integração contínua roda a mesma validação recomendada ao leitor.

## Perguntas que a seção responde

### Onde encontro o código completo do Sentinel usado no livro?

O apêndice de listagens reproduz a aplicação, o runtime de agentes, os testes, os scripts e a configuração de CI. Para executar, use o repositório público indicado na [abertura](/ler/front/), na revisão `be005f2f334740f02d0c647361f0698f2edeed11`.

### Como o livro verifica se um laboratório foi resolvido?

Cada exercício tem um contrato de aceite em `tests/lab-contracts.ts`, acionado pelo comando `npm run lab` com o número do laboratório e a variante starter ou solution. O starter deve falhar nesse contrato até que a regra seja implementada.

### Posso copiar o código do texto impresso para rodar?

O próprio apêndice aponta o repositório como fonte de execução e avisa que quebras de linha no impresso podem ser apenas gráficas. O uso indicado é ler as listagens para comparar e rodar o código a partir do repositório.
