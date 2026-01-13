namespace ControleGastos.Api.Application.DTOs;

public class CategoriaTotaisGeraisResponseDTO
{
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }

    public decimal Saldo => TotalReceitas - TotalDespesas;
}
