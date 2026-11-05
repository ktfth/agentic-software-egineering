---
description: Laboratório 03: executor de agente com orçamento de passos que separa a proposta do modelo da execução de ferramentas, testado com um simulador.
---
Quando o modelo decide e executa no mesmo gesto, não sobra lugar para controle. O terceiro laboratório treina a construção de um ciclo de agente em que a proposta passa por validação antes de virar ação, e em que o número de passos tem teto.

## O que a seção cobre

O alvo é `runAgent`, em `labs/03-planning`, e o ponto de partida falha em `npm run lab -- 03 starter`. No lugar de um modelo real entra um simulador determinístico, o que torna cada execução repetível sem conta de IA. O contrato prevê dois tipos de proposta, chamar uma ferramenta ou encerrar, exige que a ferramenta esteja de fato registrada na tabela permitida, fixa uma faixa para o orçamento e determina que um ciclo sem conclusão dentro dele termine em erro.

A leitura da referência mostra dois cenários de teste, um que chama uma ferramenta e encerra, outro que nunca para e precisa esgotar o limite, e lembra que encerrar não prova que a resposta é boa. A extensão pede para especificar, sem implementar, timeout e cancelamento, distinguindo ação não iniciada, concluída e de desfecho incerto.

## Ideias-chave

- Separar proposta de capacidade de agir é o que permite validar antes de executar.
- Um simulador determinístico troca o modelo por algo repetível, e isso torna o ciclo testável.
- O orçamento conta todos os passos, inclusive o de encerramento.
- Encerrar o ciclo e entregar uma boa resposta são questões diferentes, avaliadas em camadas diferentes.

## Perguntas que a seção responde

### Como testar um loop de agente sem chamar um modelo de IA?

O laboratório substitui o agente por um simulador determinístico que ocupa a mesma interface. Assim, o percurso se repete igual a cada execução e o contrato pode verificar o comportamento do executor.

### O que acontece se o agente pedir uma ferramenta que não existe?

A chamada é recusada: a ferramenta precisa constar como propriedade própria da tabela permitida, e saídas de ferramenta acima do tamanho admitido também são rejeitadas.

### O limite de passos é um limite completo de recursos?

Não. O orçamento não cancela promessas pendentes nem ferramentas travadas, e as ferramentas rodam de forma síncrona, sem isolamento, timeout ou retry. A seção alerta contra ligar essa base a privilégios de produção.
