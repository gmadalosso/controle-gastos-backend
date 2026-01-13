namespace ControleGastos.Api.Application.DTOs;

public class PessoaTotaisResponseDTO
{
    public Guid PessoaId { get; set; }
    public string Nome { get; set; } = string.Empty;

    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }

    public decimal Saldo => TotalReceitas - TotalDespesas;
}
