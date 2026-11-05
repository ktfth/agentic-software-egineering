---
description: Como avaliar agentes de IA com honestidade: matriz de confusão, precisão e recall indefinidos, rótulos com procedência e protocolo antes do resultado.
---
Um caso que deu certo, um benchmark e uma demonstração ensaiada produzem tipos diferentes de evidência, e misturá-los abre caminho para números enganosos. A seção defende que medir agentes exige primeiro entender o que cada número significa, e que um livro sobre avaliação não deve publicar resultados que não mediu.

## O que a seção cobre

O texto parte de uma tarefa binária, decidir se uma mudança merece revisão extra, para explicar as quatro contagens da matriz de confusão e lembrar que "positivo" depende da pergunta, não de um juízo de valor. Em seguida apresenta precisão e recall, mostra por que um denominador vazio deve gerar `null` em vez de zero e insiste que relatórios separem "não definido" de "medido e ruim". O [laboratório 07](/ler/lab-07/) implementa apenas esse cálculo sobre uma fixture sintética, sem executar agente algum.

Depois a seção questiona a origem dos rótulos, discute os riscos de usar um modelo como juiz e exige verificações executáveis quando a alegação é funcional. Termina com o desenho de um experimento futuro (tarefas fixas, separação entre casos de ajuste e de avaliação, registro de falhas de infraestrutura, repetições), com o custo desigual dos erros e com uma oficina em que o leitor escreve o protocolo antes de rodar qualquer modelo.

## Ideias-chave

- Positivo e negativo são classes definidas pela pergunta da avaliação, e a mesma contagem pode ter consequências muito diferentes conforme essa definição.
- Quando não há base para calcular precisão ou recall, o correto é declarar a métrica indefinida em vez de reportar zero.
- O rótulo de referência também é um produto de um procedimento e precisa de registro de regras, divergências e casos ambíguos.
- Critérios de sucesso, severidade e agregação de falhas devem ser fixados antes de olhar os resultados.
- Testes de uma calculadora de métricas validam a aritmética, não o desempenho de nenhum modelo.

## Perguntas que a seção responde

### Por que a precisão de um agente pode aparecer como nula em vez de zero?

Porque, sem nenhuma decisão positiva, a fórmula não tem denominador. Trocar essa ausência por zero confundiria falta de informação com desempenho observado ruim.

### Usar outro LLM como juiz resolve a avaliação de agentes?

Ajuda a escalar, mas o julgamento precisa ser calibrado. Um juiz que premia estilo ou que enxerga a resposta esperada pode inflar a métrica enquanto o comportamento real piora.

### O que um teste de métricas com fixture sintética permite afirmar?

Permite dizer que `scoreDecisions` calcula corretamente as contagens e quocientes para aqueles dados. Não autoriza nenhuma afirmação sobre a precisão de um modelo real.
