using ControleGastos.Api.Application.DTOs;
using ControleGastos.Api.Domain.Entities;
using ControleGastos.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/pessoas")]
public class PessoaController : ControllerBase
{
    private readonly AppDbContext _context;

    public PessoaController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<PessoaResponseDto>> Criar(PessoaCreateDto dto)
    {
        var pessoa = new Pessoa(dto.Nome, dto.Idade);

        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();

        var response = new PessoaResponseDto
        {
            Id = pessoa.Id,
            Nome = pessoa.Nome,
            Idade = pessoa.Idade
        };

        return CreatedAtAction(nameof(ObterPorId), new { id = pessoa.Id }, response);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PessoaResponseDto>>> Listar()
    {
        var pessoas = await _context.Pessoas
            .Select(p => new PessoaResponseDto
            {
                Id = p.Id,
                Nome = p.Nome,
                Idade = p.Idade
            })
            .ToListAsync();

        return Ok(pessoas);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PessoaResponseDto>> ObterPorId(Guid id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);

        if (pessoa == null)
            return NotFound();

        var response = new PessoaResponseDto
        {
            Id = pessoa.Id,
            Nome = pessoa.Nome,
            Idade = pessoa.Idade
        };

        return Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Excluir(Guid id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);

        if (pessoa == null)
            return NotFound();

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();

        return NoContent();
    }

}
