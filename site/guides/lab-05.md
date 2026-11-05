---
description: Laboratório 05: gravar um lote de eventos de agente de forma atômica, com rollback comprovado pelo estado do banco depois de uma falha no meio.
---
Um agente muitas vezes produz várias gravações que só têm sentido em conjunto; se metade fica no banco e metade não, o estado mente. O quinto laboratório treina a escrita de um lote atômico e, sobretudo, a verificação do que sobra depois de uma falha.

## O que a seção cobre

A função trabalhada é `appendEvents`, em `labs/05-migrations`, com o ponto de partida falhando em `npm run lab -- 05 starter`. O contrato exige que um lote válido seja gravado, que as chaves sejam únicas e que um conflito no segundo evento faça desaparecer também o primeiro do mesmo lote. Exige ainda que o sistema continue aceitando gravações depois do erro.

A seção comenta como o contrato prova isso: conferindo a contagem de linhas em cada etapa, e não apenas a ocorrência de uma exceção. Também observa que a tabela nasce fora da transação do lote e que a conexão recebida pertence a quem chamou. A extensão de estudo pede uma semântica para chave repetida, separando conteúdo igual de conteúdo diferente, antes de qualquer mudança no código.

## Ideias-chave

- Atomicidade se demonstra observando o estado persistido, não confiando no fato de que um erro foi lançado.
- Depois de uma falha, o sistema precisa seguir funcional para a próxima chamada válida.
- Quem recebe uma conexão de fora não decide seu ciclo de vida.
- Detectar duplicação com chave única não é o mesmo que tratar a repetição de forma idempotente.

## Perguntas que a seção responde

### Como provar que um lote de gravações é realmente atômico?

O laboratório força um conflito no meio do lote e consulta quantas linhas existem antes e depois. Só a ausência do primeiro evento confirma que o rollback desfez tudo, e uma inserção posterior mostra a recuperação.

### Uma chave única torna a gravação idempotente?

Não. Ela impede a duplicata, mas não reconhece sozinha que um conteúdo já foi processado. A extensão propõe pensar quais consultas e restrições distinguiriam repetição legítima de conflito.

### O que este laboratório não cobre sobre persistência?

A referência não traz migrações versionadas, não avalia concorrência e não garante durabilidade em caso de queda de energia; a evidência se limita ao percurso observado.
