using ControleGastos.Api.Domain.Enums;

namespace ControleGastos.Api.Domain.Entities;

public class Categoria
{
    public Guid Id { get; private set; }
    public string Descricao { get; private set; } = string.Empty;
    public Finalidade Finalidade { get; private set; }

    protected Categoria() { }

    public Categoria(string descricao, Finalidade finalidade)
    {
        if (string.IsNullOrWhiteSpace(descricao))
            throw new ArgumentException("Descrição da categoria é obrigatória.",nameof(descricao));

        Id = Guid.NewGuid();
        Descricao = descricao;
        Finalidade = finalidade;
    }

    public bool PermiteTipo(TipoTransacao tipo)
    {
        switch (Finalidade)
        {
            case Finalidade.Ambas:
                return true;

            case Finalidade.Despesa:
                return tipo == TipoTransacao.Despesa;

            case Finalidade.Receita:
                return tipo == TipoTransacao.Receita;

            default:
                return false;
        }
    }
}