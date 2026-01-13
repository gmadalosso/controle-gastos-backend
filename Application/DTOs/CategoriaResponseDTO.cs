using ControleGastos.Api.Domain.Enums;

namespace ControleGastos.Api.Application.DTOs;

public class CategoriaResponseDto
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public Finalidade Finalidade { get; set; }
}
