---
description: Como transformar regras vagas de validação em especificações executáveis, com fronteiras numéricas, casos isolados e raciocínio por mutação.
---
Afirmar que um sistema aceita entradas válidas não diz nada até alguém definir o que conta como válido. A seção mostra como converter essas escolhas implícitas em especificações executáveis: exemplos e propriedades que ligam decisões de domínio a observações repetíveis, sem amarrar o teste à estrutura interna do código.

## O que a seção cobre

O ponto de partida é o [laboratório 02](/ler/lab-02/), em que a função `parseMonitorSpec` recebe um valor `unknown` e só entrega um `MonitorSpec` depois de conferir a estrutura. A seção apresenta as regras adotadas para nome, URL, intervalo e campos desconhecidos, e deixa claro que recusar propriedades extras é uma política desta fronteira, não uma lei geral. Em seguida propõe organizar as entradas em classes antes de escrever código, violar uma única regra por caso de teste e dar atenção aos valores exatos nos dois lados de cada limite.

Na sequência, discute normalização sem adivinhação e o perigo das coerções silenciosas, sobretudo quando a entrada vem de um modelo de linguagem. Também trata da especificação de erros, alertando contra transformar o texto de uma mensagem em API acidental, e termina mostrando como usar o agente para listar classes de entrada e sugerir casos que separem uma implementação correta de outra propositalmente quebrada.

## Ideias-chave

- Um valor vindo de arquivo, ferramenta ou modelo deve ser tratado como desconhecido até passar pela validação.
- Um teste que dispara várias violações ao mesmo tempo não comprova que cada regra existe de fato.
- Fronteiras numéricas pedem casos imediatamente dentro e fora do limite; um valor absurdo não distingue as comparações estrita e não estrita.
- Consertar automaticamente a saída de um modelo embute escolhas não declaradas, então qualquer reparo precisa ser explícito e registrado.
- Perguntar qual teste notaria a remoção de uma regra já é uma forma prática de pensar em mutação.

## Perguntas que a seção responde

### O que diferencia uma especificação executável de um teste comum?

Ela traduz decisões do domínio em observações repetíveis e mantém uma ligação legível com o comportamento esperado, em vez de espelhar a organização interna da função.

### Devo converter a string "30" em número ao validar a saída de um modelo?

A seção recomenda evitar coerções silenciosas no parser, porque elas afastam o erro do lugar onde ele nasceu. Se algum reparo for necessário, ele deve ser uma etapa explícita que anota o valor original, a regra usada e o resultado.

### Como saber se meus testes de validação são sensíveis o bastante?

Aplique uma mutação controlada numa branch de estudo, como retirar a checagem de intervalo, e veja se algum teste falha. Se tudo continuar verde, há uma lacuna na evidência.
