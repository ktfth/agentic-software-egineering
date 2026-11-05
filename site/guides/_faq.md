### Do que trata o livro Engenharia de Software com Agentes de IA?

O livro, de Kaique Silva, mostra como converter o que um agente de IA propõe em mudanças de código que dá para verificar, revisar e desfazer, tratando o código executável como a principal prova de uma alegação funcional. São doze capítulos e oito laboratórios, que vão da noção de evidência e do ambiente reproduzível até especificação, ferramentas, persistência, testes, avaliação, revisão e operação.

### Para quem o livro foi escrito?

Para quem já se orienta em um projeto JavaScript ou TypeScript, usa o terminal e reconhece testes básicos. Iniciantes podem começar rodando a aplicação mínima; profissionais experientes encontram nos laboratórios fronteiras que costumam ficar implícitas, como a origem de uma evidência, a recuperação depois de um erro e o alcance real de uma ferramenta.

### Quais são os pré-requisitos para acompanhar os exemplos?

A referência é Node.js 24.22.1 com npm 11.9.0. A conexão com o registry npm só é necessária para instalar as dependências na primeira vez; a partir daí, exemplos e testes rodam na própria máquina, sem banco de dados externo.

### Preciso pagar por uma API de modelo de linguagem para usar o livro?

Não. O código não se conecta a nenhum provedor comercial de modelos, e os agentes usados nos testes são simuladores determinísticos; também não é preciso conhecer o funcionamento interno de modelos de linguagem.

### O que é o Sentinel?

É o projeto que acompanha a leitura: uma aplicação local mínima, de linha de comando, que registra monitores em um banco SQLite e permite listá-los. Ele não visita URLs, não faz monitoramento contínuo e não integra IA, o que mantém a base verificável sem contas, chaves ou custos variáveis.

### O que são os laboratórios do livro?

São oito exercícios práticos, reunidos na [oficina](/ler/labs/), que vão da validação de URLs e de especificações até o controle de um ciclo de agente, ferramentas de leitura com fronteira, gravações transacionais, regressão por propriedades, métricas de avaliação e um gate de entrega. Cada um parte de um starter incompleto de propósito, que falha no contrato de aceite até que a regra seja implementada, e roda com comandos como `npm run lab -- 01 starter`.

### Onde está o código-fonte do livro?

Em um repositório público no GitHub, `ktfth/agentic-software-egineering`, cuja grafia "egineering" deve ser mantida ao acessá-lo. A edição está vinculada ao commit `be005f2f334740f02d0c647361f0698f2edeed11`, e o código também aparece no apêndice de [listagens](/ler/listings/).

### Em que idioma o livro está escrito?

O texto está em português, nesta primeira edição de 2026. Identificadores técnicos e código permanecem em inglês.
