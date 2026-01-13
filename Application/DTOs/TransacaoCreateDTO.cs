using ControleGastos.Api.Domain.Enums;

namespace ControleGastos.Api.Application.DTOs;

public class TransacaoCreateDto
{
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; }

    public Guid PessoaId { get; set; }
    public Guid CategoriaId { get; set; }
}
