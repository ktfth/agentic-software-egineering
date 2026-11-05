---
description: Laboratório 07: calcular precisão e recall sobre fixtures rotuladas com denominador explícito, devolvendo null em vez de inventar porcentagens.
---
Antes de discutir se um agente acerta, é preciso garantir que a conta está certa. O sétimo laboratório treina a aritmética de avaliação isolada de qualquer modelo, com atenção especial ao caso em que o denominador é zero e uma porcentagem simplesmente não existe.

## O que a seção cobre

A função é `scoreDecisions`, em `labs/07-evaluation`, verificada a partir de `npm run lab -- 07 starter`. As entradas são fixtures rotuladas, e os números produzidos servem para demonstrar o cálculo, não para medir inteligência. O contrato pede a contagem das quatro categorias da matriz de confusão (TP, FP, FN e TN), precisão e recall pelas fórmulas usuais e `null` quando não houver base para a métrica, inclusive em um conjunto vazio.

A leitura da referência descreve uma fixture sintética com um caso de cada categoria, além de cenários vazio e sem acerto positivo, e reforça que nenhum desses valores avalia um provedor. A extensão de estudo desloca o foco para a avaliação real: escolher uma tarefa, definir a classe positiva, pesar o custo de cada tipo de erro e escrever um protocolo de coleta e revisão de rótulos.

## Ideias-chave

- Métrica sem denominador declarado esconde de onde o número veio.
- Devolver `null` quando não há base é mais honesto do que exibir zero ou cem por cento.
- Números calculados sobre fixtures demonstram aritmética, não desempenho de modelo.
- O protocolo de coleta e revisão de rótulos deve existir antes de qualquer tabela de resultados.

## Perguntas que a seção responde

### Como calcular precisão e recall quando não há positivos?

O contrato determina que, se o denominador da métrica for zero, o resultado seja `null`. Assim, um conjunto vazio ou sem predições positivas não gera uma porcentagem fictícia.

### Os números deste laboratório medem a qualidade de algum modelo?

Não. Nenhum modelo é chamado; as entradas são booleanos rotulados à mão, e os valores obtidos servem apenas para conferir a conta.

### O que a calculadora não verifica?

Ela não confere se os rótulos estão corretos e deixa de fora a coleta de tarefas, a auditoria dos rótulos, intervalos de confiança, execuções repetidas do modelo e qualquer julgamento de qualidade. Seu escopo é a aritmética sobre os dados que recebe.
