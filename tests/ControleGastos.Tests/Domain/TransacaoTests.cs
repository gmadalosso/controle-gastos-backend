using ControleGastos.Api.Domain.Entities;
using ControleGastos.Api.Domain.Enums;
using Xunit;

namespace ControleGastos.Tests.Domain;

public class TransacaoTests
{
    [Fact]
    public void CriarTransacao_ComDadosValidos_DeveCriarComSucesso()
    {
        var pessoa = new Pessoa("João Silva", 25);
        var categoria = new Categoria("Alimentação", Finalidade.Despesa);
        var descricao = "Compra no supermercado";
        var valor = 150.50m;
        var tipo = TipoTransacao.Despesa;

        var transacao = new Transacao(descricao, valor, tipo, pessoa, categoria);

        Assert.NotEqual(Guid.Empty, transacao.Id);
        Assert.Equal(descricao, transacao.Descricao);
        Assert.Equal(valor, transacao.Valor);
        Assert.Equal(tipo, transacao.Tipo);
        Assert.Equal(pessoa.Id, transacao.PessoaId);
        Assert.Equal(categoria.Id, transacao.CategoriaId);
    }

    [Fact]
    public void CriarTransacao_ComDescricaoVazia_DeveLancarArgumentException()
    {
        var pessoa = new Pessoa("Maria Santos", 30);
        var categoria = new Categoria("Transporte", Finalidade.Despesa);
        var descricao = "";
        var valor = 50.00m;
        var tipo = TipoTransacao.Despesa;

        var exception = Assert.Throws<ArgumentException>(() => 
            new Transacao(descricao, valor, tipo, pessoa, categoria));
        Assert.Contains("Descrição é obrigatória", exception.Message);
    }

    [Fact]
    public void CriarTransacao_ComValorZeroOuNegativo_DeveLancarArgumentOutOfRangeException()
    {
        var pessoa = new Pessoa("Pedro Costa", 28);
        var categoria = new Categoria("Lazer", Finalidade.Despesa);
        var descricao = "Cinema";
        var valor = 0m;
        var tipo = TipoTransacao.Despesa;

        var exception = Assert.Throws<ArgumentOutOfRangeException>(() => 
            new Transacao(descricao, valor, tipo, pessoa, categoria));
        Assert.Contains("Valor não pode ser menor que zero", exception.Message);
    }

    [Fact]
    public void CriarTransacao_PessoaMenorDeIdadeComReceita_DeveLancarInvalidOperationException()
    {
        var pessoa = new Pessoa("Juquinha Júnior", 15);
        var categoria = new Categoria("Salário", Finalidade.Receita);
        var descricao = "Salário";
        var valor = 2000.00m;
        var tipo = TipoTransacao.Receita;

        var exception = Assert.Throws<InvalidOperationException>(() => 
            new Transacao(descricao, valor, tipo, pessoa, categoria));
        Assert.Contains("Pessoa menor de idade não pode registrar receita", exception.Message);
    }

}

