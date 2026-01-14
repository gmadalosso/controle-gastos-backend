# Controle de Gastos

Sistema de controle financeiro pessoal desenvolvido com .NET 8 e React, permitindo gerenciar pessoas, categorias e transações financeiras (receitas e despesas).

> 📚 **Documentação Detalhada**: Para entender em profundidade como o backend e frontend funcionam, consulte os arquivos [BACKEND.md](./BACKEND.md) e [FRONTEND.md](./FRONTEND.md), que explicam a arquitetura, fluxo de dados e futuras melhorias de cada parte do sistema.

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Como Executar](#-como-executar)
- [Funcionalidades](#-funcionalidades)
- [API Endpoints](#-api-endpoints)
- [Regras de Negócio](#-regras-de-negócio)
- [Seed Data](#-seed-data)
- [Estrutura de Dados](#-estrutura-de-dados)

## 🛠 Tecnologias

### Backend
- **.NET 8.0** - Framework principal
- **ASP.NET Core** - API REST
- **Entity Framework Core 8.0** - ORM
- **SQLite** - Banco de dados
- **Swagger/OpenAPI** - Documentação da API

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Linguagem
- **Vite** - Build tool
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **Bootstrap 5** - Framework CSS

## 📁 Estrutura do Projeto

```
controle-gastos-backend/
├── backend/
│   └── ControleGastos.Api/
│       ├── Application/          # DTOs e lógica de aplicação
│       ├── Controllers/           # Controllers da API
│       ├── Domain/                # Entidades e enums
│       ├── Infrastructure/        # Data access (DbContext, Migrations, Seed)
│       ├── Migrations/            # Migrations do EF Core
│       └── Program.cs             # Configuração da aplicação
├── frontend/
│   └── src/
│       ├── components/            # Componentes React
│       ├── pages/                 # Páginas da aplicação
│       └── services/              # Serviços de API
└── tests/
    └── ControleGastos.Tests/      # Testes unitários
```

## 📦 Pré-requisitos

### Backend
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- Visual Studio 2022, VS Code ou Rider (opcional)

### Frontend
- [Node.js](https://nodejs.org/) versão 22 ou superior
- npm ou yarn

## 🚀 Como Executar

### Backend

1. Navegue até a pasta do backend:
```bash
cd backend/ControleGastos.Api
```

2. Restaure as dependências (se necessário):
```bash
dotnet restore
```

3. Execute a aplicação:
```bash
dotnet run
```

A API estará disponível em:
- **HTTP**: `http://localhost:5160`
- **HTTPS**: `https://localhost:7148`
- **Swagger UI**: `http://localhost:5160/swagger`

### Frontend

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173` ou `http://localhost:5174`

## ✨ Funcionalidades

- ✅ Gerenciamento de **Pessoas** (criar, listar, buscar por ID, excluir, obter totais)
- ✅ Gerenciamento de **Categorias** (criar, listar, buscar por ID, obter totais)
- ✅ Gerenciamento de **Transações** (criar, listar, buscar por ID)
- ✅ Validações de regras de negócio
- ✅ Seed data automático na inicialização
- ✅ Documentação Swagger da API

## 🔌 API Endpoints

### Pessoas

- `POST /api/pessoas` - Criar nova pessoa
- `GET /api/pessoas` - Listar todas as pessoas
- `GET /api/pessoas/{id}` - Obter pessoa por ID
- `DELETE /api/pessoas/{id}` - Excluir pessoa
- `GET /api/pessoas/{id}/totais` - Obter totais de receitas e despesas de uma pessoa específica
- `GET /api/pessoas/totais` - Obter totais gerais de receitas e despesas de todas as pessoas

### Categorias

- `POST /api/categorias` - Criar nova categoria
- `GET /api/categorias` - Listar todas as categorias
- `GET /api/categorias/{id}` - Obter categoria por ID
- `GET /api/categorias/{id}/totais` - Obter totais de receitas e despesas de uma categoria específica
- `GET /api/categorias/totais` - Obter totais de receitas e despesas agrupados por categoria

### Transações

- `POST /api/transacoes` - Criar nova transação
- `GET /api/transacoes` - Listar todas as transações
- `GET /api/transacoes/{id}` - Obter transação por ID

## 📐 Regras de Negócio

1. **Pessoas menores de 18 anos** não podem registrar receitas
2. **Categorias** têm uma finalidade (Despesa, Receita ou Ambas)
3. **Transações** devem respeitar a finalidade da categoria:
   - Categoria com finalidade "Despesa" só aceita transações do tipo Despesa
   - Categoria com finalidade "Receita" só aceita transações do tipo Receita
   - Categoria com finalidade "Ambas" aceita ambos os tipos
4. **Valores** de transação devem ser maiores que zero
5. **Campos obrigatórios** são validados antes de criar entidades

## 🌱 Seed Data

O sistema possui um mecanismo de seed automático que popula o banco de dados com dados iniciais na primeira execução:

- **5 pessoas** (incluindo uma menor de idade para demonstrar validações)
- **7 categorias** (Alimentação, Transporte, Salário, Freelance, Lazer, Moradia, Educação)
- **14 transações** (4 receitas e 10 despesas)

O seed é executado automaticamente na inicialização da aplicação e **não duplica dados** se já existirem registros no banco.

## 💾 Estrutura de Dados

### Pessoa
- `Id` (Guid) - Identificador único
- `Nome` (string) - Nome da pessoa
- `Idade` (int) - Idade da pessoa

### Categoria
- `Id` (Guid) - Identificador único
- `Descricao` (string) - Descrição da categoria
- `Finalidade` (enum) - Despesa, Receita ou Ambas

### Transação
- `Id` (Guid) - Identificador único
- `Descricao` (string) - Descrição da transação
- `Valor` (decimal) - Valor da transação
- `Tipo` (enum) - Despesa ou Receita
- `PessoaId` (Guid) - Referência à pessoa
- `CategoriaId` (Guid) - Referência à categoria

## 📝 Notas

- O banco de dados SQLite é criado automaticamente na primeira execução
- As migrations são aplicadas automaticamente via `DbInitializer`
- O arquivo do banco (`controle-gastos.db`) é criado na pasta do projeto backend
- CORS está configurado para permitir requisições do frontend nas portas 5173 e 5174

## 📄 Licença

Este projeto é de uso educacional/demonstrativo.

