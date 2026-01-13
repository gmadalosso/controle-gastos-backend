using ControleGastos.Api.Domain.Enums;

namespace ControleGastos.Api.Application.DTOs;

public class TransacaoResponseDto
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; }

    public Guid PessoaId { get; set; }
    public string PessoaNome { get; set; } = string.Empty;

    public Guid CategoriaId { get; set; }
    public string CategoriaDescricao { get; set; } = string.Empty;
}
