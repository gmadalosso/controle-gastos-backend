using ControleGastos.Api.Domain.Enums;

namespace ControleGastos.Api.Domain.Entities;

public class Transacao
{
    public Guid Id { get; private set; }
    public string Descricao { get; private set; } = string.Empty;
    public decimal Valor { get; private set; }
    public TipoTransacao Tipo { get; private set; }

    public Guid PessoaId { get; private set; }
    public Pessoa Pessoa { get; private set; } = null!;

    public Guid CategoriaId { get; private set; }
    public Categoria Categoria { get; private set; } = null!;

    protected Transacao() { }

    public Transacao(
        string descricao,
        decimal valor,
        TipoTransacao tipo,
        Pessoa pessoa,
        Categoria categoria)
    {
        if (string.IsNullOrWhiteSpace(descricao))
            throw new ArgumentException("Descrição é obrigatória.", nameof(descricao));

        if (valor <= 0)
            throw new ArgumentOutOfRangeException("Valor não pode ser menor que zero.", nameof(valor));

        if (!categoria.PermiteTipo(tipo))
            throw new InvalidOperationException("Categoria não permite esse tipo de transação.");

        if (pessoa.Idade < 18 && tipo == TipoTransacao.Receita)
            throw new InvalidOperationException("Pessoa menor de idade não pode registrar receita.");

        Id = Guid.NewGuid();
        Descricao = descricao;
        Valor = valor;
        Tipo = tipo;

        Pessoa = pessoa;
        PessoaId = pessoa.Id;

        Categoria = categoria;
        CategoriaId = categoria.Id;
    }
}
