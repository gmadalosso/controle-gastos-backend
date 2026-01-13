using ControleGastos.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public DbSet<Pessoa> Pessoas => Set<Pessoa>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Transacao> Transacoes => Set<Transacao>();

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Pessoa>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.Nome).IsRequired();
            e.Property(p => p.Idade).IsRequired();
        });

        modelBuilder.Entity<Categoria>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.Descricao).IsRequired();
            e.Property(c => c.Finalidade).IsRequired();
        });

        modelBuilder.Entity<Transacao>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.Descricao).IsRequired();
            e.Property(t => t.Valor).IsRequired();
            e.Property(t => t.Tipo).IsRequired();

            e.HasOne(t => t.Pessoa)
             .WithMany()
             .HasForeignKey(t => t.PessoaId)
             .IsRequired();

            e.HasOne(t => t.Categoria)
             .WithMany()
             .HasForeignKey(t => t.CategoriaId)
             .IsRequired();
        });
    }
}
