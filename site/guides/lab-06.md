---
description: Laboratório 06: canonicalizar e deduplicar um lote de URLs mantendo a ordem, e usar a idempotência como propriedade de regressão nos testes.
---
Duas strings diferentes podem apontar para a mesma URL depois de normalizadas, e uma deduplicação ingênua não percebe isso. O sexto laboratório treina a composição de pequenas transformações e a observação de uma propriedade entre execuções: rodar a função de novo sobre a saída não deve mudar nada.

## O que a seção cobre

A função é `canonicalizeBatch`, em `labs/06-regression`, e o ponto de partida falha em `npm run lab -- 06 starter`. O contrato pede que URLs equivalentes após a normalização apareçam uma única vez, que a primeira ordem canônica se mantenha, que a query não se perca, que entrada inválida gere erro, que o array recebido continue intacto e que um lote vazio produza lote vazio. A normalização reaproveita a política já construída no [laboratório 01](/ler/lab-01/).

Antes de implementar, o leitor é convidado a explicar por que comparar as strings originais não resolve a equivalência e por que o teste inclui uma URL com fragmento. A leitura da referência insiste que o valor didático está na ordem das operações, e a extensão propõe uma propriedade adicional de contagem, com o que ela pega e o que deixa escapar.

## Ideias-chave

- Equivalência canônica depende da normalização; comparar o texto bruto não basta.
- A ordem das etapas importa mais do que a quantidade de linhas da solução.
- Reaplicar a função à própria saída é uma forma barata de detectar regressões.
- Retornar um array novo, sem tocar no recebido, faz parte do contrato.

## Perguntas que a seção responde

### O que é teste por propriedade neste laboratório?

Em vez de só conferir uma saída esperada, o teste verifica uma relação entre execuções: aplicar a função duas vezes deve dar o mesmo resultado que aplicar uma. Isso observa idempotência para aquela fixture.

### Qual é o papel da URL com fragmento no teste?

O fragmento faz duas entradas textualmente diferentes virarem a mesma URL depois da normalização, o que expõe uma deduplicação feita sobre as strings originais.

### A idempotência observada vale para qualquer entrada?

Não. A seção deixa claro que um conjunto finito de casos não prova a propriedade para todas as strings possíveis, nem demonstra que dois recursos web sejam equivalentes em sentido geral.
