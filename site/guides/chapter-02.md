---
description: Como fixar runtime, lockfile e estado local para que um projeto com agentes de IA seja reproduzível, e como montar um contexto mínimo e bem separado.
---
Muitas demonstrações funcionam só na máquina de quem as preparou, porque dependências antigas, artefatos compilados e variáveis locais fazem parte da receita sem aparecer nela. A seção defende que reproduzir um resultado exige separar fonte, ferramentas e estado acumulado, e que o contexto entregue a um agente merece o mesmo rigor de seleção.

## O que a seção cobre

O texto começa pela escolha de runtime: o código complementar fixa versões exatas de Node.js e npm, e o autor explica por que um número fixo funciona como referência para comparar execuções, e não como recusa a atualizações. Em seguida discute o papel de `package.json`, `package-lock.json`, do campo `engines` e do `.nvmrc`, e justifica o uso de `npm ci` para que divergências entre manifesto e resolução venham à tona em vez de serem remendadas durante a validação. Depois separa build de teste: TypeScript strict não valida dados externos, e um starter pode compilar e continuar incompleto.

A segunda metade trata o contexto como recorte guiado pela hipótese de trabalho, distingue o plano de controle (instruções como `AGENTS.md`) do plano de dados (conteúdo analisado) e descreve com franqueza o que a validação em ambiente limpo demonstrou e o que ficou de fora. Fecha com um roteiro de diagnóstico para falhas de instalação e um exercício de pedido de mudança curto.

## Ideias-chave

- Uma versão fixa de runtime é um marco de comparação; atualizá-la pede nova execução da suíte e uma decisão registrada.
- Apagar o lockfile para destravar a instalação esconde justamente a divergência que ele estava apontando.
- Compilar sem erros não significa que o comportamento esperado foi atingido, nem que dados recebidos de fora são confiáveis.
- O contexto útil para um agente é delimitado pelo objetivo da mudança; material em excesso faz regras antigas disputarem espaço com as atuais.
- Texto encontrado em um arquivo analisado é dado, nunca autorização para alterar o processo de trabalho.

## Perguntas que a seção responde

### Por que usar `npm ci` para reproduzir um projeto Node.js?

Porque o comando parte do lockfile e expõe qualquer incoerência entre ele e o manifesto, em vez de ajustar a resolução por conta própria no meio da validação.

### Quanto contexto devo entregar a um agente de IA para corrigir uma função?

O suficiente para a hipótese em jogo: a meta, os limites, as interfaces tocadas, entradas de exemplo e o comando que confirma o aceite. O resto entra só quando a mudança chega até ele.

### Testes aprovados em Linux garantem suporte a Windows e macOS?

Não. A seção registra que a validação ocorreu em Linux e que os demais sistemas precisam de execuções próprias antes de qualquer promessa de suporte.
