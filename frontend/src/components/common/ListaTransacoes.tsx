import type { Transacao } from "../../types/Transacao";
import { formatarValor } from "../../utils/utils";

interface PropsListaTransacoes {
  transacoes: Transacao[];
  mostrarPessoa?: boolean;
  mostrarCategoria?: boolean;
  mensagemVazia?: string;
}

export function ListaTransacoes({ 
  transacoes, 
  mostrarPessoa = true, 
  mostrarCategoria = true,
  mensagemVazia = "Nenhuma transação encontrada"
}: PropsListaTransacoes) {
  if (transacoes.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        {mensagemVazia}
      </div>
    );
  }

  return (
    <div className="list-group list-group-flush">
      {transacoes.map((transacao) => (
        <div key={transacao.id} className="list-group-item">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <strong>{transacao.descricao}</strong>
              <div className="text-muted small mt-1">
                {transacao.tipo}
                {mostrarCategoria && ` • ${transacao.categoriaDescricao}`}
                {mostrarPessoa && ` • ${transacao.pessoaNome}`}
              </div>
            </div>
            <div
              className={`fw-bold ${
                transacao.tipo === "Receita" ? "text-success" : "text-danger"
              }`}
            >
              {transacao.tipo === "Receita" ? "+" : "-"}{" "}
              {formatarValor(transacao.valor)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

