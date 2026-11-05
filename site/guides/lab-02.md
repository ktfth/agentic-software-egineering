---
description: Laboratório 02: validar em runtime um objeto externo contra a especificação de monitor, sem coerção silenciosa e reaproveitando a política de URL.
---
Um tipo TypeScript some na compilação e não protege o programa de um JSON mal formado vindo de fora. O segundo laboratório treina a passagem do valor desconhecido para um objeto tipado, recusando tudo o que não puder ser interpretado de forma inequívoca.

## O que a seção cobre

O exercício gira em torno de `parseMonitorSpec`, editada em `labs/02-specifications` e verificada a partir de `npm run lab -- 02 starter`. O contrato define três campos, nome, URL e intervalo em segundos, com limites claros para cada um, e proíbe propriedades desconhecidas. A URL não ganha regra nova: ela passa pela mesma política construída no [laboratório 01](/ler/lab-01/), para que não existam duas versões divergentes.

A leitura da referência destaca a recusa de conversões implícitas, como transformar texto em número ou arredondar valores fracionários, e abre uma discussão de revisão: rejeitar campos extras é uma escolha, e uma API que evolui poderia preferir outra. A extensão de estudo propõe testar valores na fronteira e logo depois dela, e usar uma mutação deliberada para ver se o teste novo percebe a regra ausente.

## Ideias-chave

- Tipo estático descreve a intenção; só a checagem em runtime garante o valor que chega de fora.
- Coerção silenciosa esconde erro de quem enviou o dado; recusar é mais honesto do que adivinhar.
- Reaproveitar a política de URL evita que cadastro e especificação discordem sobre o que é aceitável.
- Recusar campos desconhecidos é uma decisão de projeto que merece ser discutida, não um dogma.

## Perguntas que a seção responde

### Por que um tipo TypeScript não basta para validar entrada externa?

Porque o tipo descreve o valor esperado, mas não examina o objeto que de fato chega em tempo de execução. O laboratório parte de `unknown` e só entrega o resultado tipado depois das verificações.

### A especificação aceita a string "5" como intervalo?

Não. A referência não converte texto numérico em número nem arredonda decimais; o intervalo precisa ser um inteiro dentro da faixa definida pelo contrato.

### O que o teste deste laboratório não garante?

As mensagens de erro são simples, sem estrutura pública por campo, e os casos não cobrem todas as combinações de entrada. A conclusão autorizada se limita às classes e fronteiras realmente exercitadas.
