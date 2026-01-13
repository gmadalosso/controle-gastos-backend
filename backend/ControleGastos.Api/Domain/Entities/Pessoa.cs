namespace ControleGastos.Api.Domain.Entities;

public class Pessoa
{
    public Guid Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public int Idade { get; private set; }

    protected Pessoa() { }

    public Pessoa(string nome, int idade)
    {
        if (string.IsNullOrWhiteSpace(nome))
        {
            throw new ArgumentException("Nome não pode ser vazio.", nameof(nome));
        }

        if (idade < 0)
        {
            throw new ArgumentOutOfRangeException("Idade não pode ser menor do que zero.", nameof(idade));
        }

        Id = Guid.NewGuid();
        Nome = nome;
        Idade = idade;
    }
}