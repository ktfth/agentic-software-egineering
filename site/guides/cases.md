---
description: Caderno de decisões com cinco casos sobre agentes de IA: artefato errado, dados com novo destino, retry duplicado, métrica enganosa e ferramenta ampla.
---
Muitos problemas com agentes não nascem de código errado, e sim de evidências corretas ligadas ao objeto errado ou de mudanças pequenas com consequências grandes. O caderno de decisões reúne cinco situações curtas para treinar esse olhar de revisão, cada uma com perguntas e uma lição.

## O que a seção cobre

O material contém cinco casos, identificados de A a E. O primeiro trata de testes que passam sobre a fonte enquanto o pacote entregue é outro. O segundo mostra uma ferramenta de leitura que passa a alimentar um provedor externo sem que sua função mude. O terceiro examina uma retentativa automática depois de uma falha parcial de gravação. O quarto parte de uma fixture de métricas que vira alegação comercial sobre um agente. O quinto acompanha a troca de uma ferramenta específica por um shell genérico.

Cada caso segue a mesma estrutura: a situação, a análise de onde está o risco, possíveis direções de correção sem prescrever uma solução única, um conjunto de perguntas para usar em revisões reais e uma lição final. Os casos retomam assuntos dos capítulos e laboratórios, como o gate de entrega, transações locais, a calculadora de métricas e a política de ferramentas, e servem como roteiro de discussão em equipe ou de autoavaliação depois da leitura do [capítulo 12](/ler/chapter-12/).

## Ideias-chave

- Um resultado verdadeiro sobre a fonte pode ser insuficiente sobre o artefato que o usuário vai executar.
- Permissão para ler um arquivo não equivale a permissão para enviá-lo a um serviço externo.
- Repetir uma operação sem saber qual efeito já ocorreu pode transformar recuperação em conflito.
- A frase que acompanha um número faz parte da integridade do resultado.
- Uma mudança deve ser medida pelas consequências que habilita, não pela quantidade de linhas alteradas.

## Perguntas que a seção responde

### Para que serve o caderno de decisões do livro?

Para praticar revisão de situações realistas com agentes, usando perguntas que obrigam a procurar registros em vez de confiar em afirmações verbais.

### Por que trocar uma ferramenta específica por um shell genérico é arriscado?

Porque a tarefa parece igual, mas o agente passa a alcançar processos, arquivos e talvez rede, e essas decisões migram para um planejador que também recebe conteúdo não confiável.

### Retry automático basta para recuperar falhas de um agente?

Não. Antes de automatizar novas tentativas é preciso definir identidade da operação, efeito esperado e como observar se ela já foi concluída.
