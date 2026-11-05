---
description: Entrega de software com agentes de IA: gate de release ligado à revisão, limites da evidência, registro de decisões e uma definição prática de concluído.
---
É possível testar uma versão do código e publicar outra, aceitar um relatório antigo ou um teste ignorado. A seção fecha o livro defendendo que uma decisão de entrega só se sustenta quando as evidências pertencem à revisão avaliada e cobrem todos os critérios obrigatórios.

## O que a seção cobre

O ponto de partida é o [laboratório 08](/ler/lab-08/), em que `releaseGate` devolve uma decisão booleana sem publicar nada, separando avaliar prontidão de executar a publicação. A seção descreve em termos gerais o que o gate aceita e recusa, por que uma lista de critérios vazia não pode significar sucesso e como tratar evidências extras. Logo depois mostra o limite desse controle: comparar identificadores verifica coerência dos dados recebidos, não a procedência de quem os produziu.

Na sequência, o texto lembra que testes verdes não respondem se o produto resolve um problema real, usando o Sentinel mínimo como exemplo de base de aprendizagem e não de serviço completo. Trata de como evoluir o código sem perder a versão descrita pelo livro, da separação entre código e editorial, do momento certo de traduzir, de quais decisões merecem registro e de uma definição de concluído em níveis. Termina com uma oficina final que percorre contrato, proposta do agente, evidência e relatório.

## Ideias-chave

- Ausência, duplicação, status ignorado ou revisão diferente não devem contar como verificação aprovada.
- Igualdade de identificadores de revisão não prova autenticidade; um gate pequeno é só uma peça de uma cadeia de confiança maior.
- Capacidades futuras como sondagem HTTP, agendamento, histórico e alertas devem entrar como incrementos separados, cada um com seus critérios.
- Uma boa decisão registrada inclui a condição que levaria a reavaliá-la e não se apoia em métricas que ninguém mediu.
- Concluído significa comportamento definido, implementação, verificação, limitações comunicadas e artefato recuperável.

## Perguntas que a seção responde

### O que é um release gate e o que ele não garante?

É uma função que decide se um conjunto de evidências autoriza a entrega de uma revisão específica. Ela não executa a publicação nem comprova que as evidências vieram de uma infraestrutura confiável.

### Por que um array vazio de verificações não deve aprovar uma entrega?

Porque a operação lógica pode devolver verdadeiro sem critério algum, e no domínio de entrega esse sucesso vazio não faz sentido.

### Qual é a habilidade central ao trabalhar com agentes de IA?

Ligar de forma confiável o que se pretendia, o que o agente fez e o que se obteve, o que permite ampliar a delegação com critério, saber quando interrompê-la e continuar responsável pelo software entregue.
