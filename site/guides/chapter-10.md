---
description: Observabilidade de agentes de IA: eventos que separam observação de interpretação, orçamento de tempo e passos, timeouts incertos e custo por tarefa.
---
Quando um agente falha depois de várias chamadas de ferramenta, a resposta final quase nunca conta a história. A seção argumenta que observabilidade deve partir das perguntas operacionais que se quer responder, e não do volume de logs acumulados.

## O que a seção cobre

O texto propõe um modelo de evento para evolução futura, com campos como `runId`, `step`, `tool`, `status`, `revision` e `durationMs`, deixando claro que isso é uma proposta e não algo já presente no Sentinel. Discute o papel de cada campo, o cuidado de não registrar segredos e a diferença entre o que a ferramenta observou e o que o agente concluiu a partir disso, inclusive quando um resumo substitui o histórico.

Depois separa recursos que costumam se esconder sob uma única variável de orçamento: passos, duração, tempo por ferramenta, volume de dados e gasto. Mostra que um timeout não garante ausência de efeito e que operações de escrita em estado incerto pedem confirmação ou idempotência. Na parte de custo, explica por que o livro não traz números medidos, como montar o cálculo quando houver dados e por que o denominador da comparação precisa refletir o valor buscado. Encerra com sinais de desgaste em ciclos de agente e uma oficina de desenho de relatório.

## Ideias-chave

- Um evento útil permite reconstruir proposta, autorização, chamada, observação e conclusão sem copiar dados sensíveis.
- "Arquivo não encontrado" e "não existe documentação" são afirmações de alcance diferente, e o sistema deve manter essa distância visível.
- O orçamento do [laboratório 03](/ler/lab-03/) conta propostas; latência e cancelamento exigem controles próprios.
- Preço por token muda com modelo e política comercial, então comparações precisam registrar quantidade observada e regra de preço da época.
- Custo por chamada menor não implica custo por tarefa concluída menor quando há retentativas e revisão extensa.

## Perguntas que a seção responde

### O que registrar nos logs de um agente de IA?

O suficiente para responder qual ferramenta foi chamada, sob qual política e revisão, se houve efeito externo e se a resposta veio da ferramenta ou da interpretação do agente.

### Um timeout significa que a operação não aconteceu?

Não. O serviço remoto pode ter concluído mesmo assim, e repetir uma escrita nesse estado pode gerar inconsistência. É preciso confirmar o resultado ou usar uma chave de idempotência.

### Como comparar o custo de diferentes configurações de agente?

Escolhendo uma unidade que corresponda ao valor desejado, como tarefa aceita sob um critério definido, e incluindo revisão humana e recuperação de falhas quando pesarem na decisão.
