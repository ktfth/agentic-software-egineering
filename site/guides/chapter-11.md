---
description: Segurança de agentes de IA na prática: modelo de ameaça, prompt injection em camadas, privilégio mínimo, aprovação humana proporcional e falha fechada.
---
O que um agente consegue fazer depende tanto das instruções que recebe quanto das ferramentas e permissões que alcança. A tese da seção é que segurança se constrói limitando capacidades fora do modelo, e que uma frase no prompt nunca equivale a isolamento.

## O que a seção cobre

A seção explica que os exercícios do livro rodam localmente, com dados de exemplo e sem credenciais, e que produção exige decisões ainda não tomadas. Mostra como formular uma ameaça e suas hipóteses de ambiente, usando os laboratórios de arquivos e de URL para apontar o que está e o que não está coberto, e por que a análise deve ser refeita quando um dado muda de papel. Sobre prompt injection, apoia-se na orientação da OWASP de controles em camadas e separa dados, propostas e autoridade de ferramenta.

Em seguida trata privilégio mínimo como questão de desenho, ligado à granularidade das ferramentas e ao escopo das credenciais. Discute onde a confirmação humana realmente altera a consequência e como torná-la concreta. Fecha com falha fechada aplicada com precisão, recuperações que não podem ampliar privilégio, preparação para incidentes e uma oficina de mapa de capacidades.

## Ideias-chave

- Uma proteção só vale dentro das hipóteses de ameaça declaradas, e novas capacidades exigem nova análise de risco.
- Não existe frase capaz de imunizar um sistema contra prompt injection; o executor deve validar pedidos por regras locais.
- Ferramentas pequenas e com entradas tipadas tornam viáveis validação, auditoria e aprovação proporcional.
- Aprovação humana deve mostrar destino e conteúdo concretos e se concentrar em ações de alto impacto ou irreversíveis.
- Contornar uma recusa com uma ferramenta mais poderosa é mudança de autorização, não recuperação técnica.

## Perguntas que a seção responde

### Como proteger um agente de IA contra prompt injection?

Com controles em camadas que limitam o que as ferramentas podem fazer mesmo quando o modelo interpreta mal um conteúdo. A seção não promete cura, apenas redução de certas consequências.

### Quando pedir confirmação humana a um agente?

Quando a ação tem impacto relevante, é difícil de reverter ou atinge destinatários externos. Confirmar cada leitura local cansa o processo sem aumentar a proteção.

### Como saber se uma restrição depende só do prompt?

Escreva um pedido que deveria ser negado e localize onde a recusa ocorreria se o modelo aceitasse. Se a única barreira for a instrução textual, a fronteira ainda depende do planejador.
