---
description: Laboratório 04: uma ferramenta de leitura de arquivos presa a uma raiz, que recusa caminho absoluto, subida de diretório e symlink para fora.
---
Uma ferramenta de leitura útil para o agente também é uma porta para qualquer arquivo da máquina, se o caminho vier sem controle. O quarto laboratório treina a construção de uma fronteira real de sistema de arquivos, testada com recursos temporários criados dentro do próprio workspace.

## O que a seção cobre

O exercício trabalha `readEvidence`, em `labs/04-tool-boundaries`, a partir de `npm run lab -- 04 starter`. O contrato aceita o arquivo situado sob a raiz e recusa três rotas de fuga nos casos executados: caminho absoluto, subida até um diretório vizinho e link simbólico apontando para fora. A saída de texto também tem tamanho máximo. A seção registra que o caso de symlink não roda no Windows e que a verificação desta edição foi feita em Linux.

A leitura da referência explica por que o teste monta seu próprio arquivo permitido e um arquivo privado ao lado, sem tocar em dados reais do usuário. A extensão convida a imaginar uma árvore com nomes de diretório parecidos e a apontar qual premissa do ambiente exigiria isolamento mais forte.

## Ideias-chave

- A decisão deve considerar onde o caminho realmente termina, não como ele aparenta começar.
- Comparar prefixos de texto é uma política frágil para decidir se um arquivo está dentro da raiz.
- Contraexemplos autocontidos deixam o teste reproduzível e afastam o risco de ler arquivos alheios.
- O resultado depende do sistema operacional: parte dos casos só é exercitada fora do Windows.

## Perguntas que a seção responde

### Como impedir que um agente leia arquivos fora de uma pasta permitida?

O laboratório constrói uma ferramenta que só lê o que está sob a raiz configurada e recusa caminhos absolutos, saídas por diretório pai e links simbólicos que levem para fora. O teste cria esses contraexemplos em um diretório isolado.

### Por que `startsWith` não basta para checar o caminho?

Porque um diretório vizinho com nome parecido compartilha o mesmo prefixo textual sem estar dentro da raiz. A extensão de estudo pede justamente para descrever essa árvore e explicar a falha.

### Essa ferramenta funciona como sandbox?

Não. Checagem e leitura não são atômicas, e uma alteração concorrente pode aproveitar o intervalo entre elas; o limite de texto vem depois da leitura e não contém o pico de memória.
