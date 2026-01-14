import type { Categoria } from "../types/Categoria";
import type { Transacao, TipoTransacao } from "../types/Transacao";

export type Finalidade = "Despesa" | "Receita" | "Ambas";

export function numeroParaTipo(numero: number): TipoTransacao {
  return numero === 2 ? "Receita" : "Despesa";
}

export function tipoParaNumero(tipo: TipoTransacao): number {
  return tipo === "Despesa" ? 1 : 2;
}

export function numeroParaFinalidade(numero: number): Finalidade {
  switch (numero) {
    case 1:
      return "Despesa";
    case 2:
      return "Receita";
    case 3:
      return "Ambas";
    default:
      return "Despesa";
  }
}

export function finalidadeParaNumero(finalidade: Finalidade): number {
  switch (finalidade) {
    case "Despesa":
      return 1;
    case "Receita":
      return 2;
    case "Ambas":
      return 3;
    default:
      return 1;
  }
}

export function formatarValor(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function mostrarErro(mensagem: string, erro?: any) {
  console.error(mensagem, erro);
  alert(mensagem);
}

export function converterTransacaoDaApi(data: any): Transacao {
  return {
    id: data.id,
    descricao: data.descricao,
    valor: data.valor,
    tipo: numeroParaTipo(data.tipo),
    pessoaId: data.pessoaId,
    pessoaNome: data.pessoaNome,
    categoriaId: data.categoriaId,
    categoriaDescricao: data.categoriaDescricao,
  };
}

export function converterTransacoesDaApi(dataArray: any[]): Transacao[] {
  return dataArray.map(converterTransacaoDaApi);
}

export function converterCategoriaDaApi(data: any): Categoria {
  return {
    id: data.id,
    descricao: data.descricao,
    finalidade: numeroParaFinalidade(data.finalidade),
  };
}

export function converterCategoriasDaApi(dataArray: any[]): Categoria[] {
  return dataArray.map(converterCategoriaDaApi);
}

export function determinarTipoPorCategoria(
  categoriaId: string,
  categorias: Categoria[]
): TipoTransacao {
  const categoria = categorias.find(c => c.id === categoriaId);
  if (!categoria) return "Despesa";
  
  if (categoria.finalidade === "Receita") {
    return "Receita";
  } else if (categoria.finalidade === "Despesa") {
    return "Despesa";
  } else {
    return "Despesa";
  }
}

export function categoriaAceitaAmbas(
  categoriaId: string,
  categorias: Categoria[]
): boolean {
  const categoria = categorias.find(c => c.id === categoriaId);
  return categoria?.finalidade === "Ambas";
}

