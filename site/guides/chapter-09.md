---
description: Revisão de código e CI com agentes de IA: descrições verificáveis, testes que falham sem a mudança, permissões do pipeline e relatórios com limites.
---
Uma alteração escrita por um agente ainda não está pronta; ela só se torna revisável quando alguém consegue ligar problema, diff e evidência. A seção sustenta que agentes podem apoiar a revisão, mas a responsabilidade de conferir essas relações continua com quem revisa.

## O que a seção cobre

O texto começa pela descrição da mudança: abrir com o comportamento afetado, citar apenas as preservações que um revisor temeria perder e deixar de fora o histórico da conversa com o agente. Em seguida trata o teste como parte da solução, pedindo que se procure o caso que falharia sem a alteração, que se desconfie de asserções satisfeitas pelo motivo errado e que se dimensionem as lacunas que a suíte local não cobre. Um agente revisor pode apontar divergências, mas mudar critérios de aceite é uma decisão, não um ajuste cosmético.

Na parte de integração contínua, a seção distingue o arquivo de workflow de uma execução real associada a um commit, explica por que o pipeline do repositório tem apenas permissão de leitura e alerta que um agente que mexe na CI altera o próprio mecanismo que o avalia. Fecha com a defesa de incrementos pequenos, a separação entre código e o texto em `site/`, um modelo de relatório para quem chega depois e uma oficina de descrição em cinco frases.

## Ideias-chave

- Diff, descrição e execução respondem perguntas diferentes, e a revisão consiste em verificar a coerência entre os três.
- Um teste só sustenta a mudança se realmente atinge o comportamento que pretende proteger.
- Configuração de CI e resultado de CI são coisas distintas, e um selo verde vale apenas para a revisão que foi verificada.
- Conceder escrita, segredos ou deploy ao pipeline amplia as consequências de qualquer alteração no próprio workflow.
- Tempo de teste local não é benchmark de produto; desempenho exige protocolo próprio.

## Perguntas que a seção responde

### Como escrever a descrição de um pull request gerado por agente de IA?

Comece pelo comportamento concreto que mudou, cite as propriedades preservadas que importam para aquele risco e descreva o estado final, não o caminho de prompts até ele.

### Um agente pode alterar o workflow de CI do projeto?

Pode, mas essa classe de mudança merece atenção extra, porque afrouxar o critério de aprovação não toca no código da aplicação. Retirar um comando que falha não corrige a falha.

### O que deve constar no relatório de verificação de uma mudança?

Os comandos relevantes, seus códigos de saída e os limites da evidência, além do motivo de qualquer atualização de dependências e da nova execução do percurso afetado.
