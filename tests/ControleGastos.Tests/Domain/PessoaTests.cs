using ControleGastos.Api.Domain.Entities;
using Xunit;

namespace ControleGastos.Tests.Domain;

public class PessoaTests
{
    [Fact]
    public void CriarPessoa_ComDadosValidos_DeveCriarComSucesso()
    {
        var nome = "João Silva";
        var idade = 25;

        var pessoa = new Pessoa(nome, idade);

        Assert.NotEqual(Guid.Empty, pessoa.Id);
        Assert.Equal(nome, pessoa.Nome);
        Assert.Equal(idade, pessoa.Idade);
    }

    [Fact]
    public void CriarPessoa_ComNomeVazio_DeveLancarArgumentException()
    {
        var nome = "";
        var idade = 25;

        var exception = Assert.Throws<ArgumentException>(() => new Pessoa(nome, idade));
        Assert.Contains("Nome não pode ser vazio", exception.Message);
    }

    [Fact]
    public void CriarPessoa_ComIdadeNegativa_DeveLancarArgumentOutOfRangeException()
    {
        var nome = "Maria Santos";
        var idade = -1;

        var exception = Assert.Throws<ArgumentOutOfRangeException>(() => new Pessoa(nome, idade));
        Assert.Contains("Idade não pode ser menor do que zero", exception.Message);
    }
}

