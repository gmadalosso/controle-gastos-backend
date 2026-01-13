using ControleGastos.Api.Application.DTOs;
using ControleGastos.Api.Domain.Entities;
using ControleGastos.Api.Domain.Enums;
using ControleGastos.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/categorias")]
public class CategoriaController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriaController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<CategoriaResponseDto>> Criar(CategoriaCreateDto dto)
    {
        var categoria = new Categoria(dto.Descricao, dto.Finalidade);

        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();

        var response = new CategoriaResponseDto
        {
            Id = categoria.Id,
            Descricao = categoria.Descricao,
            Finalidade = categoria.Finalidade
        };

        return CreatedAtAction(nameof(ObterPorId), new { id = categoria.Id }, response);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoriaResponseDto>>> Listar()
    {
        var categorias = await _context.Categorias
            .Select(c => new CategoriaResponseDto
            {
                Id = c.Id,
                Descricao = c.Descricao,
                Finalidade = c.Finalidade
            })
            .ToListAsync();

        return Ok(categorias);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CategoriaResponseDto>> ObterPorId(Guid id)
    {
        var categoria = await _context.Categorias.FindAsync(id);

        if (categoria == null)
            return NotFound();

        var response = new CategoriaResponseDto
        {
            Id = categoria.Id,
            Descricao = categoria.Descricao,
            Finalidade = categoria.Finalidade
        };

        return Ok(response);
    }

    [HttpGet("{id}/totais")]
    public async Task<ActionResult<CategoriaTotaisResponseDTO>> ObterTotaisPorCategoria(Guid id)
    {
        var categoria = await _context.Categorias
            .FirstOrDefaultAsync(c => c.Id == id);

        if (categoria is null)
            return NotFound("Categoria não encontrada.");

        var totalReceitas = _context.Transacoes
            .Where(t => t.CategoriaId == id && t.Tipo == TipoTransacao.Receita)
            .AsEnumerable()
            .Sum(t => t.Valor);

        var totalDespesas = _context.Transacoes
            .Where(t => t.CategoriaId == id && t.Tipo == TipoTransacao.Despesa)
            .AsEnumerable()
            .Sum(t => t.Valor);

        var response = new CategoriaTotaisResponseDTO
        {
            CategoriaId = categoria.Id,
            Descricao = categoria.Descricao,
            TotalReceitas = totalReceitas,
            TotalDespesas = totalDespesas
        };

        return Ok(response);
    }

    [HttpGet("totais")]
    public async Task<ActionResult<object>> ObterTotaisPorCategoria()
    {
        var categorias = await _context.Categorias
            .AsNoTracking()
            .ToListAsync();

        var transacoes = await _context.Transacoes
            .AsNoTracking()
            .ToListAsync();

        var categoriasComTotais = categorias.Select(c =>
        {
            var receitas = transacoes
                .Where(t => t.CategoriaId == c.Id && t.Tipo == TipoTransacao.Receita)
                .Sum(t => t.Valor);

            var despesas = transacoes
                .Where(t => t.CategoriaId == c.Id && t.Tipo == TipoTransacao.Despesa)
                .Sum(t => t.Valor);

            return new CategoriaTotaisGeraisDTO
            {
                CategoriaId = c.Id,
                Descricao = c.Descricao,
                TotalReceitas = receitas,
                TotalDespesas = despesas
            };
        }).ToList();

        var totalGeral = new CategoriaTotaisGeraisResponseDTO
        {
            TotalReceitas = categoriasComTotais.Sum(c => c.TotalReceitas),
            TotalDespesas = categoriasComTotais.Sum(c => c.TotalDespesas)
        };

        return Ok(new
        {
            categorias = categoriasComTotais,
            totalGeral
        });
    }

}
