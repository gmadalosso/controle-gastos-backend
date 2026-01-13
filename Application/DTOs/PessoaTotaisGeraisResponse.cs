namespace ControleGastos.Api.Application.DTOs;

public class PessoaTotaisGeraisResponseDTO
{
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }

    public decimal Saldo => TotalReceitas - TotalDespesas;
}
