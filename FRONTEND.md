# Como Funciona o Frontend

O frontend foi desenvolvido utilizando **React 19** com **TypeScript**, organizando o código em uma estrutura modular com **páginas**, **componentes**, **hooks customizados**, **utilitários** e **tipos**. A aplicação é dividida em quatro páginas principais (`Dashboard`, `Pessoas`, `Categorias`, `Transacoes`), cada uma responsável por gerenciar um aspecto específico do sistema. Os componentes reutilizáveis na pasta `components/common` (como `ModalFormulario`, `LoadingState`, `ErrorState`, `EmptyState`) garantem consistência visual e comportamental em toda a aplicação. Os tipos TypeScript definidos na pasta `types` garantem type-safety, enquanto funções utilitárias em `utils` realizam conversões entre os formatos numéricos da API e os tipos string usados no frontend, além de formatação de valores monetários e tratamento de erros.

O fluxo de comunicação com a API funciona através de uma instância configurada do **Axios** (`http.ts`), que estabelece a URL base do backend e os headers necessários. Cada página gerencia seu próprio estado local usando hooks do React (`useState`, `useEffect`), fazendo requisições HTTP quando necessário (carregamento inicial, criação, exclusão de registros). Os dados recebidos da API são convertidos através das funções utilitárias para o formato esperado pelo frontend, especialmente para enums que vêm como números do backend e são convertidos para strings legíveis. O gerenciamento de estado inclui controle de loading, tratamento de erros e estados vazios, proporcionando feedback adequado ao usuário durante todas as operações.

A aplicação utiliza **React Router DOM** para navegação entre páginas, com rotas definidas no componente `App.tsx` que renderiza condicionalmente cada página conforme a URL. O **Vite** atua como build tool e servidor de desenvolvimento. O **Bootstrap 5** fornece o sistema de grid e componentes de UI, garantindo uma interface responsiva e moderna. Hooks customizados como `usarModalFormulario` encapsulam lógica de estado relacionada a modais de formulário, promovendo reutilização de código e separação de responsabilidades. 

## Futuras Melhorias
Essa seção aborda melhorias que podem ser implementadas futuramente, que não foram implementadas em um momento inicial por conta do caráter educacional do projeto e por restrições de tempo.

### Gerenciamento de Estado Global
Atualmente, cada página gerencia seu próprio estado local, o que pode levar a duplicação de lógica e dificuldades para compartilhar dados entre componentes. A implementação de uma solução de gerenciamento de estado global (como **Context API** do React, **Zustand** ou **Redux Toolkit**) permitiria centralizar o estado da aplicação, facilitando o compartilhamento de dados entre páginas e reduzindo a necessidade de múltiplas requisições à API.

### Camada de Serviços/API
A lógica de comunicação com a API está diretamente nas páginas, o que pode tornar o código difícil de manter e testar. A criação de uma camada de **serviços** ou **API clients** separada permitiria centralizar todas as chamadas HTTP, facilitando a manutenção, testes unitários e possíveis mudanças na estrutura da API. Além disso, poderia incluir interceptors para tratamento global de erros e adição automática de tokens de autenticação.

### Validação de Formulários
A implementação de uma biblioteca de validação de formulários melhoraria a validação de dados antes do envio, fornecendo feedback em tempo real ao usuário e reduzindo requisições desnecessárias à API com dados inválidos.

### Testes
A criação de testes unitários (com **Vitest** ou **Jest**) e testes de integração (com **React Testing Library**) garantiria a qualidade do código e facilitaria a refatoração futura, além de servir como documentação do comportamento esperado dos componentes.
