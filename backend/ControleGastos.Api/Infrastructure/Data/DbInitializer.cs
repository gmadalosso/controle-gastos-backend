using ControleGastos.Api.Domain.Entities;
using ControleGastos.Api.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Infrastructure.Data;

public static class DbInitializer
{
    public static void Seed(AppDbContext context)
    {
        // Aplicar migrations se necessário (em vez de EnsureCreated)
        context.Database.Migrate();

        // Verificar se já existem dados
        if (context.Pessoas.Any() || context.Categorias.Any() || context.Transacoes.Any())
        {
            return; // Já foi populado
        }

        // Criar Pessoas
        var pessoa1 = new Pessoa("João Silva", 35);
        var pessoa2 = new Pessoa("Maria Santos", 28);
        var pessoa3 = new Pessoa("Pedro Oliveira", 42);
        var pessoa4 = new Pessoa("Ana Costa", 25);
        var pessoa5 = new Pessoa("Carlos Ferreira", 16); // Menor de idade

        context.Pessoas.AddRange(pessoa1, pessoa2, pessoa3, pessoa4, pessoa5);

        // Criar Categorias
        var categoriaAlimentacao = new Categoria("Alimentação", Finalidade.Despesa);
        var categoriaTransporte = new Categoria("Transporte", Finalidade.Despesa);
        var categoriaSalario = new Categoria("Salário", Finalidade.Receita);
        var categoriaFreelance = new Categoria("Freelance", Finalidade.Receita);
        var categoriaLazer = new Categoria("Lazer", Finalidade.Ambas);
        var categoriaMoradia = new Categoria("Moradia", Finalidade.Despesa);
        var categoriaEducacao = new Categoria("Educação", Finalidade.Despesa);

        context.Categorias.AddRange(
            categoriaAlimentacao,
            categoriaTransporte,
            categoriaSalario,
            categoriaFreelance,
            categoriaLazer,
            categoriaMoradia,
            categoriaEducacao
        );

        // Salvar para obter os IDs
        context.SaveChanges();

        // Criar Transações
        var transacoes = new List<Transacao>
        {
            // Receitas (apenas para pessoas maiores de idade)
            new Transacao("Salário mensal", 5000.00m, TipoTransacao.Receita, pessoa1, categoriaSalario),
            new Transacao("Projeto freelance", 1500.00m, TipoTransacao.Receita, pessoa2, categoriaFreelance),
            new Transacao("Salário mensal", 6000.00m, TipoTransacao.Receita, pessoa3, categoriaSalario),
            new Transacao("Venda de produtos", 800.00m, TipoTransacao.Receita, pessoa4, categoriaFreelance),

            // Despesas
            new Transacao("Supermercado", 450.00m, TipoTransacao.Despesa, pessoa1, categoriaAlimentacao),
            new Transacao("Uber", 120.00m, TipoTransacao.Despesa, pessoa1, categoriaTransporte),
            new Transacao("Restaurante", 85.50m, TipoTransacao.Despesa, pessoa2, categoriaAlimentacao),
            new Transacao("Cinema", 50.00m, TipoTransacao.Despesa, pessoa2, categoriaLazer),
            new Transacao("Aluguel", 1200.00m, TipoTransacao.Despesa, pessoa3, categoriaMoradia),
            new Transacao("Combustível", 200.00m, TipoTransacao.Despesa, pessoa3, categoriaTransporte),
            new Transacao("Curso online", 299.90m, TipoTransacao.Despesa, pessoa4, categoriaEducacao),
            new Transacao("Delivery", 65.00m, TipoTransacao.Despesa, pessoa4, categoriaAlimentacao),
            new Transacao("Livros", 150.00m, TipoTransacao.Despesa, pessoa5, categoriaEducacao),
            new Transacao("Transporte público", 80.00m, TipoTransacao.Despesa, pessoa5, categoriaTransporte),
        };

        context.Transacoes.AddRange(transacoes);
        context.SaveChanges();
    }
}

