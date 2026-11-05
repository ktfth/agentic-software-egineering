---
description: Laboratório 01: transformar o parser genérico de URL em uma política explícita de cadastro para o Sentinel, barrando esquemas e credenciais indevidos.
---
O fato de uma biblioteca conseguir interpretar uma URL não significa que o produto deva aceitá-la. O primeiro laboratório treina essa distinção: construir, sobre o parser padrão, uma regra que diga o que o Sentinel admite cadastrar como monitor.

## O que a seção cobre

A seção apresenta a missão, o comando `npm run lab -- 01 starter`, que falha no ponto de partida original, e o arquivo a editar dentro de `labs/01-url-policy`, mantendo a assinatura de `validateMonitorUrl`. O contrato de aceite trata de normalização, dos esquemas permitidos e das classes de entrada que precisam ser barradas, entre elas endereços relativos, texto que nem forma URL e credenciais embutidas. A orientação insiste em aproveitar o parser existente em vez de reconhecer a sintaxe com expressão regular.

Depois vem a comparação com a referência: o starter já parece quase pronto, e o exercício mostra por que essa impressão engana. A seção fecha delimitando o alcance do resultado e propondo casos extras de estudo, como senha sem usuário e host IPv6 entre colchetes, com a pergunta sobre se cada caso revela uma classe nova.

## Ideias-chave

- Reconhecer a sintaxe de uma URL é diferente de autorizar seu uso; a política é uma camada à parte.
- Limpar a entrada não pode servir de disfarce: descartar partes de uma URL não deve esconder algo que deveria ser recusado.
- O contrato confere que caminho e query sobrevivem, e não só que o fragmento desaparece.
- O resultado vale para o momento do cadastro e não equivale a proteção completa contra SSRF.

## Perguntas que a seção responde

### O que uma URL precisa cumprir para passar no laboratório 01?

Ela precisa ser absoluta, usar HTTP ou HTTPS e não carregar usuário nem senha; esquemas como file, ftp e javascript ficam de fora. Se houver fragmento, ele sai na normalização sem que a query se perca.

### Por que não validar URLs com expressão regular?

A seção recomenda partir da API URL nativa e acrescentar as regras de produto por cima, em vez de tentar reproduzir toda a gramática com regex. Assim a política não reinventa o parser.

### Essa validação protege contra SSRF?

Não sozinha. A função não controla resolução de DNS nem o destino real na rede, e como a aplicação não dispara requisições, o exercício termina no cadastro.
