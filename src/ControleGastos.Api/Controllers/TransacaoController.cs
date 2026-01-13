using ControleGastos.Api.Application.DTOs;
using ControleGastos.Api.Domain.Entities;
using ControleGastos.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/transacoes")]
public class TransacaoController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacaoController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<TransacaoResponseDto>> Criar(TransacaoCreateDto dto)
    {
        var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);
        if (pessoa == null)
            return BadRequest("Pessoa não encontrada.");

        var categoria = await _context.Categorias.FindAsync(dto.CategoriaId);
        if (categoria == null)
            return BadRequest("Categoria não encontrada.");

        Transacao transacao;
        try
        {
            transacao = new Transacao(
                dto.Descricao,
                dto.Valor,
                dto.Tipo,
                pessoa,
                categoria
            );
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        var response = new TransacaoResponseDto
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo,
            PessoaId = pessoa.Id,
            PessoaNome = pessoa.Nome,
            CategoriaId = categoria.Id,
            CategoriaDescricao = categoria.Descricao
        };

        return CreatedAtAction(nameof(ObterPorId), new { id = transacao.Id }, response);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransacaoResponseDto>>> Listar()
    {
        var transacoes = await _context.Transacoes
            .Include(t => t.Pessoa)
            .Include(t => t.Categoria)
            .Select(t => new TransacaoResponseDto
            {
                Id = t.Id,
                Descricao = t.Descricao,
                Valor = t.Valor,
                Tipo = t.Tipo,
                PessoaId = t.PessoaId,
                PessoaNome = t.Pessoa.Nome,
                CategoriaId = t.CategoriaId,
                CategoriaDescricao = t.Categoria.Descricao
            })
            .ToListAsync();

        return Ok(transacoes);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TransacaoResponseDto>> ObterPorId(Guid id)
    {
        var transacao = await _context.Transacoes
            .Include(t => t.Pessoa)
            .Include(t => t.Categoria)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (transacao == null)
            return NotFound();

        var response = new TransacaoResponseDto
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo,
            PessoaId = transacao.PessoaId,
            PessoaNome = transacao.Pessoa.Nome,
            CategoriaId = transacao.CategoriaId,
            CategoriaDescricao = transacao.Categoria.Descricao
        };

        return Ok(response);
    }
}
