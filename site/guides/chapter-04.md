---
description: Como projetar o laço de um agente de IA com orçamento de passos, separação entre proposta e autoridade e falha explícita quando o limite acaba.
---
Planos de agentes costumam falhar não por falta de ideias, mas por falta de um critério de parada: sem ele, a busca por mais um ajuste vira um laço que gasta tempo, dinheiro e privilégios. A seção sustenta que o planejamento precisa carregar a regra que o encerra e usa um executor pequeno para mostrar onde fica cada responsabilidade.

## O que a seção cobre

A base é o [laboratório 03](/ler/lab-03/), um ciclo em que o agente sugere acionar uma ferramenta ou encerrar com uma resposta e o executor decide o que fazer com isso. O texto mostra por que a interface do agente não toca banco nem sistema de arquivos, como a tabela de ferramentas autorizadas é definida por quem configura a execução e por que `Object.hasOwn` aparece na checagem. Em seguida detalha o que `maxSteps` conta de fato e, sobretudo, o que ele não controla: duração, tokens, cancelamento e isolamento de processo.

Depois a seção trata o plano como hipótese que deve mudar diante de novas observações, discute o crescimento do histórico e o teto de tamanho das respostas de ferramenta, e lembra que chamar algo de observação não o torna verdadeiro. Fecha distinguindo tipos de falha, os riscos de retry sem idempotência e uma oficina para desenhar as sequências de parada antes de rodar o laboratório.

## Ideias-chave

- Pedir uma ferramenta não a faz existir: só o que foi registrado por quem configura a execução pode ser acionado.
- Um orçamento de passos limita quantas propostas acontecem, não quanto tempo cada uma consome.
- Um bom primeiro passo é aquele que pode falhar de modo informativo e reduzir a incerteza mais importante.
- Ferramenta proibida, proposta malformada e orçamento esgotado são falhas distintas e merecem estados auditáveis.
- O executor controla o percurso; atestar a qualidade do raciocínio exige outro contrato.

## Perguntas que a seção responde

### Limitar o número de passos de um agente basta para garantir segurança?

Não. O limite conta propostas, mas uma chamada pode travar sem fim, e a referência não implementa timeout, cancelamento, orçamento de tokens nem isolamento de processo.

### Por que separar quem propõe a ação de quem a executa?

Porque assim o agente apenas devolve propostas, o executor confere o nome contra a tabela autorizada e o fluxo pode ser testado com um simulador, sem depender de uma API de modelo.

### Repetir automaticamente uma chamada que falhou é uma boa ideia?

Só depois de definir idempotência ou uma chave que identifique a operação. Novas tentativas consomem orçamento, podem duplicar efeitos de escrita e não resolvem uma recusa de política.
