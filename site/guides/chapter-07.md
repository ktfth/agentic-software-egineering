---
description: Como usar propriedades, contraexemplos e mutações para testar código feito com agentes de IA sem deixar o teste se adaptar à regressão.
---
Um exemplo isolado protege um único cenário; uma propriedade bem escolhida cobre a relação entre muitos. A seção usa a normalização de URLs em lote para mostrar como invariantes, contraexemplos pequenos e mutações ajudam a avaliar o próprio teste como instrumento de medida.

## O que a seção cobre

O [laboratório 06](/ler/lab-06/) gira em torno da função `canonicalizeBatch`, que normaliza URLs, elimina repetições e mantém a ordem da primeira ocorrência. A seção explica o contrato do lote, o uso de `Set` para dar estabilidade à deduplicação e por que inverter a ordem, removendo repetições antes da normalização, deixaria passar duplicatas disfarçadas. Em seguida apresenta relações úteis, como a idempotência da transformação, a preservação da entrada, a manutenção da query e um teto de contagem, e insiste em não chamar um conjunto finito de exemplos de prova formal.

A segunda parte trata da tentação de atualizar expectativas quando um agente muda a implementação, da importância de ver o teste falhar pelo motivo certo e da escolha entre testes de unidade e de integração, com o exemplo da CLI executada em processo filho com banco isolado. Termina com contraexemplos como trabalho criativo, catálogo de regressões com motivo registrado, isolamento de recursos temporários e uma oficina de mutação sobrevivente.

## Ideias-chave

- Aplicar a normalização duas vezes deve dar o mesmo resultado que aplicá-la uma vez, dentro do domínio aceito.
- Antes de aceitar uma expectativa nova sugerida por um agente, é preciso saber qual decisão de produto mudou.
- Um teste que já passava antes da mudança não serve como evidência da correção alegada.
- A camada de teste deve seguir o risco: mexer em argumentos da CLI pede teste de processo, ajustar uma fronteira numérica não.
- Vinte testes que percorrem o mesmo ramo dão conforto, mas não aumentam a sensibilidade a regressões.

## Perguntas que a seção responde

### O que é teste de propriedade aplicado à normalização de URL?

É verificar relações que valem para muitas entradas, como `f(f(x)) = f(x)`, em vez de checar um único par de entrada e saída. A seção ressalva que observar exemplos escolhidos não equivale a prova formal.

### Quando é aceitável alterar um teste que falhou depois de uma mudança feita pelo agente?

Quando existe uma mudança de contrato identificada. Se nenhuma decisão de produto mudou, ajustar a expectativa apenas faz o teste aceitar a regressão.

### Como descobrir se minha suíte de testes deixa passar erros?

Faça mutações numa cópia de estudo, como retirar a deduplicação, e veja qual asserção falha; depois procure uma mutação que sobreviva e escreva o teste que a revela.
