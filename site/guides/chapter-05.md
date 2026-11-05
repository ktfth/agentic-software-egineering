---
description: Como construir uma ferramenta de leitura de arquivos com raiz explícita para agentes de IA, e por que ela ainda não equivale a um sandbox.
---
Dar uma ferramenta a um agente é permitir que ele produza efeitos, e até uma leitura pode vazar credenciais ou dados de terceiros. A seção defende que a proteção precisa morar na própria ferramenta, como regra determinística, em vez de depender de instruções que pedem bom comportamento ao modelo.

## O que a seção cobre

O texto parte do [laboratório 04](/ler/lab-04/), uma ferramenta que lê arquivos apenas dentro de uma raiz declarada. Primeiro separa conteúdo de comando: uma frase maliciosa dentro de um arquivo lido não altera a autorização da execução, e a seção cita a discussão de prompt injection da OWASP para justificar controles em camadas e privilégio mínimo. Depois explica por que comparar prefixos de string falha, como `realpathSync` e `relative` servem para comparar caminhos já resolvidos e por que os casos de teste com caminho absoluto, `..` e symlink cobrem violações diferentes.

A segunda parte se dedica às lacunas: a janela de corrida entre verificar e ler (time of check to time of use), que a ferramenta não fecha; o teto de caracteres aplicado só depois da leitura, que não controla memória; e a diferença entre ferramentas estreitas como `readEvidence` e um shell genérico. Por fim, propõe classificar o risco por recurso, destinatário e reversibilidade, não só por leitura ou escrita.

## Ideias-chave

- Uma barreira que depende da interpretação do modelo pode ser contornada pela mesma injeção que deveria conter.
- O caminho digitado na entrada e o arquivo real que ele alcança são coisas distintas, e a checagem deve usar o segundo.
- Bloquear symlinks estáticos não protege contra um adversário que altera a árvore de arquivos durante a execução.
- Ao propor um limite, é preciso nomear o recurso limitado: caracteres devolvidos, bytes lidos, tempo ou memória.
- Quanto mais ampla a capacidade da ferramenta, maior a necessidade de isolamento externo e de revisão dos efeitos.

## Perguntas que a seção responde

### Por que `startsWith` não serve para restringir caminhos de arquivo?

Porque um prefixo textual aceita diretórios vizinhos com nome parecido, como uma pasta de backup ao lado da raiz, e ignora segmentos `..` e links simbólicos.

### Uma ferramenta que valida caminhos com `realpathSync` é um sandbox?

Não. Ela barra a subida por diretórios e links externos, mas não fecha a janela entre checagem e uso; exigências mais fortes pedem descritores, restrições de processo ou isolamento do sistema operacional.

### Ler um arquivo é sempre uma ação de baixo risco para um agente?

Não. O risco depende do dado, de quem o recebe e de ser possível desfazer. Conectar essa leitura a um provedor de modelo pode virar transferência externa e pede nova decisão.
