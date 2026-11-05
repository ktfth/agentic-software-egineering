---
description: Laboratório 08: um gate de entrega que exige evidência única, aprovada e da mesma revisão para cada check obrigatório antes de autorizar o release.
---
Um painel com tudo verde pode estar verde pelas razões erradas: checks faltando, repetidos ou rodados em outra versão do código. O último laboratório treina a construção de um gate que decide prontidão a partir das evidências recebidas, sem ele mesmo publicar nada.

## O que a seção cobre

A função é `releaseGate`, em `labs/08-delivery`, com ponto de partida falhando em `npm run lab -- 08 starter`. O contrato exige uma lista de critérios obrigatórios não vazia e sem repetição, e, para cada critério, exatamente uma evidência aprovada e vinculada à revisão em avaliação. Ausência, duplicidade, status ignorado e revisão desatualizada levam à recusa.

A leitura da referência lista o caso aceito e os contraexemplos cobertos, e argumenta que a simplicidade permite conferir cada relação à mão antes de encaixar a lógica num pipeline mais amplo. A extensão de estudo leva a discussão para a proveniência: quem pode gerar evidência, quem pode mover a publicação e como amarrar o artefato entregue ao conjunto que foi de fato verificado.

## Ideias-chave

- Lista de critérios vazia não pode resultar em aprovação automática.
- Cada check obrigatório precisa de uma única evidência; duas linhas para o mesmo nome também são problema.
- Evidência de uma revisão antiga não vale para a revisão em análise.
- Decidir que algo está pronto e efetivamente publicar são responsabilidades separadas.

## Perguntas que a seção responde

### O que um gate de release deve checar antes de liberar uma entrega?

Neste laboratório, que todos os critérios obrigatórios tenham uma evidência única, com status aprovado e ligada à mesma revisão avaliada. Qualquer falta, repetição, check pulado ou revisão divergente bloqueia a decisão.

### Comparar a string de revisão garante que a evidência é confiável?

Não. A igualdade da revisão não autentica a origem da evidência; cabe ao chamador assegurar que cada linha foi produzida por uma verificação digna de confiança.

### O gate faz o deploy?

Não. Ele só avalia se a entrega está pronta. A seção registra também que evidências extras, fora da lista obrigatória, são ignoradas pela política atual. O laboratório fecha a sequência iniciada na [oficina](/ler/labs/).
