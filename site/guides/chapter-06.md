---
description: Como garantir atomicidade ao gravar eventos em SQLite, verificar o estado após falhas e entender por que chave única não equivale a idempotência.
---
Quando uma operação quebra no meio do caminho, o que sobra no banco pode ser uma mistura de tentativas que não corresponde a nenhuma execução bem-sucedida. A seção argumenta que a garantia de tudo ou nada precisa ser conferida consultando o estado, e não aceita a partir do relato do agente.

## O que a seção cobre

O fio condutor é o [laboratório 05](/ler/lab-05/), com a função `appendEvents`, que grava um lote de eventos numa conexão SQLite sob a regra de que ou todos entram ou nenhum entra. A seção mostra como o contrato provoca uma duplicata no segundo elemento e confere que o primeiro também sumiu, e explica por que observar apenas a exceção não demonstra atomicidade. Descreve a transação da referência (`BEGIN IMMEDIATE`, inserções preparadas, `COMMIT` ao final, `ROLLBACK` em caso de erro) e a decisão de deixar a criação da tabela fora do lote.

Depois aborda consultas parametrizadas e seus limites, a diferença entre detectar uma chave repetida e definir semântica de idempotência, e o motivo pelo qual retries em várias camadas tornam isso urgente com agentes. Discute ainda o SQLite como escolha didática e não como arquitetura universal, a posse da conexão e o par formado por falha e recuperação, terminando com uma oficina de contagem de estado.

## Ideias-chave

- Uma frase do agente dizendo que desfez a alteração não substitui uma consulta ao banco depois da falha.
- Parâmetros ligados protegem valores, mas não autorizam montar nomes de tabela a partir de entrada externa.
- Chave única identifica repetição; sozinha, não define como reagir quando um pedido com a mesma chave traz conteúdo diferente.
- Sem uma identidade compartilhada, retries do modelo, do executor e do cliente HTTP podem multiplicar um mesmo efeito.
- Testar recuperação significa confirmar que a conexão segue utilizável após o rollback, não apenas que o erro aconteceu.

## Perguntas que a seção responde

### Como testar se uma inserção em lote é realmente atômica?

Grave um evento inicial, tente um lote cujo segundo item repete uma chave e consulte o banco para ver se o primeiro item desse lote também ficou de fora.

### Uma restrição de chave única torna minha API idempotente?

Não. A referência apenas recusa duplicatas; uma API idempotente precisa definir se devolve o resultado anterior, como trata conflito de conteúdo e por quanto tempo a chave vale.

### SQLite serve como base para produção com agentes?

A seção o usa para estudar transações sem serviço externo e lembra que backup, migração, durabilidade em queda de energia e concorrência exigem avaliações próprias.
