---
description: Visão geral da oficina do livro: oito laboratórios em sequência que transformam a leitura sobre agentes de IA em evidência executável e explicável.
---
Ler sobre agentes com fronteiras não basta; o entendimento só vira evidência quando o leitor roda o exercício, compara resultados e consegue justificar o que viu. A abertura da oficina apresenta os oito laboratórios como um percurso único, em que cada etapa acrescenta uma camada de controle sobre o que um agente pode fazer.

## O que a seção cobre

A seção explica a ordem do percurso: começar checando o que entra no sistema, passar ao controle da execução, limitar o alcance das ferramentas, conservar o estado de forma confiável e, por fim, examinar a decisão de entregar. Em seguida, define a postura esperada diante do material. Os pontos de partida vêm incompletos de propósito, e as implementações de referência são curtas o bastante para serem lidas de ponta a ponta.

Há também uma regra de conduta sobre os contratos de teste: eles não devem ser afrouxados para acomodar uma implementação parcial. Quem discordar de uma regra deve primeiro registrar a alternativa e o efeito dela. Por último, a seção mostra como os exercícios se conectam, ainda que cada um rode isoladamente, e delimita o que oito execuções bem-sucedidas realmente demonstram.

## Ideias-chave

- A sequência vai da validação de entrada à decisão de entrega, passando por execução, ferramentas e estado.
- Os starters falham por desenho; o trabalho é fazê-los cumprir o contrato, não reescrever o contrato.
- Discordar de um teste é legítimo, desde que a alternativa e seu efeito sejam escritos antes de qualquer mudança.
- Conceitos voltam: a política do [laboratório 01](/ler/lab-01/) reaparece na especificação e no lote, e a separação entre propor e agir reaparece nas ferramentas e no [gate de entrega](/ler/lab-08/).
- Todos os laboratórios aprovados provam os percursos locais descritos, não a prontidão para produção.

## Perguntas que a seção responde

### Em que ordem devo fazer os laboratórios do livro?

A oficina sugere a progressão que começa na validação de entradas, avança para controle de execução, restrição de ferramentas e preservação de estado, e termina na análise da decisão de entrega. Cada exercício roda sozinho, mas os conceitos se acumulam.

### Posso mudar um teste se achar a regra errada?

Pode, mas não para encobrir uma implementação incompleta. A orientação é descrever antes a alternativa proposta e o que ela muda no comportamento, e só então mexer no teste.

### Passar nos oito laboratórios significa que o sistema está pronto para produção?

Não. Os comandos verdes mostram apenas que os percursos locais de cada exercício funcionam como descrito; prontidão para produção é uma afirmação maior, que os laboratórios não sustentam.
