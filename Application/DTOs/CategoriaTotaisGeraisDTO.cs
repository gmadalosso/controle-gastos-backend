namespace ControleGastos.Api.Application.DTOs;

public class CategoriaTotaisGeraisDTO
{
    public Guid CategoriaId { get; set; }
    public string Descricao { get; set; } = string.Empty;

    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }

    public decimal Saldo => TotalReceitas - TotalDespesas;
}
