# Como Funciona o Backend

O backend foi desenvolvido seguindo uma arquitetura em camadas, organizando o código em **Domain**, **Application**, **Infrastructure** e **Controllers**. A camada **Domain** contém as entidades de negócio (`Pessoa`, `Categoria`, `Transacao`) com suas próprias validações e regras de negócio encapsuladas nos construtores. Por exemplo, a entidade `Transacao` valida se a categoria permite o tipo de transação solicitado e se pessoas menores de 18 anos podem registrar receitas, lançando exceções quando as regras são violadas. A camada **Application** contém os DTOs (Data Transfer Objects) que são usados para comunicação entre o cliente e a API, garantindo que apenas os dados necessários sejam expostos.

O fluxo de uma requisição funciona da seguinte forma: quando uma requisição HTTP chega, ela é roteada para o **Controller** apropriado (como `PessoaController`, `CategoriaController` ou `TransacaoController`). Os controllers recebem DTOs, convertem-nos em entidades do domínio e utilizam o `AppDbContext` (da camada **Infrastructure**) para persistir ou consultar dados. O EF Core atua como ORM, mapeando as entidades para o banco de dados SQLite e executando as queries necessárias. Todas as validações de negócio são executadas no momento da criação das entidades, garantindo a integridade dos dados antes mesmo de serem persistidos.

Na inicialização da aplicação, o `Program.cs` configura os serviços necessários (DbContext, CORS, Swagger) e executa automaticamente o `DbInitializer.Seed()`, que aplica as migrations do EF Core e popula o banco de dados com dados iniciais caso esteja vazio. O sistema utiliza SQLite como banco de dados, que é criado automaticamente na primeira execução através das migrations. A documentação da API é gerada automaticamente via Swagger/OpenAPI, permitindo que desenvolvedores testem os endpoints diretamente pela interface web disponível em `/swagger`.

O projeto inclui uma suíte de **testes unitários** desenvolvida com xUnit, focada na validação das entidades do domínio e suas regras de negócio. Os testes cobrem os três principais componentes: `Pessoa`, `Categoria` e `Transacao`, verificando tanto os cenários de sucesso quanto os casos de erro. Por exemplo, os testes validam que entidades são criadas corretamente com dados válidos, que campos obrigatórios lançam exceções apropriadas quando vazios ou inválidos, e que regras de negócio específicas são respeitadas (como a proibição de menores de idade registrarem receitas). Esses testes garantem que a lógica de negócio encapsulada nas entidades funciona corretamente, servindo como documentação viva do comportamento esperado do sistema e facilitando a manutenção e evolução do código.

## Futuras Melhorias
Essa seção aborda melhorias que podem ser implementadas futuramente, que não foram implementadas em um momento inicial por conta do caráter educacional do projeto e por restrições de tempo.

### Camada de Serviços
Atualmente, a lógica de negócio está diretamente nos controllers, o que pode tornar o código difícil de manter e testar. A criação de uma camada de **Services** permitiria separar a lógica de negócio dos controllers, facilitando a reutilização de código, testes unitários e manutenção. Os services poderiam conter métodos como `PessoaService.Criar()`, `TransacaoService.ValidarRegrasNegocio()`, etc., deixando os controllers mais enxutos e focados apenas em receber requisições e retornar respostas.

### Middleware e Tratamento de Erros
A implementação de **middleware** personalizado para tratamento global de exceções melhoraria significativamente o tratamento de erros da aplicação. Um middleware centralizado poderia capturar todas as exceções, logá-las adequadamente e retornar respostas padronizadas ao cliente, evitando que detalhes internos do sistema sejam expostos.

### Autenticação e Autorização
Atualmente, a API não possui nenhum mecanismo de segurança. A implementação de **autenticação e autorização** seria essencial para proteger os endpoints e garantir que apenas usuários autenticados possam acessar e modificar dados. Isso permitiria que cada usuário tivesse seu próprio conjunto de pessoas, categorias e transações, transformando o sistema em uma aplicação multi-usuário.

### Banco de Dados
O sistema atualmente utiliza **SQLite**, que é adequado para desenvolvimento e projetos pequenos, mas possui limitações para ambientes de produção com múltiplos usuários simultâneos. A migração para um banco de dados mais robusto como **MySQL** ou **PostgreSQL** ofereceria melhor desempenho para crescimento futuro. O EF Core suporta facilmente essa migração através da mudança do provider de banco de dados na configuração do `DbContext`.
