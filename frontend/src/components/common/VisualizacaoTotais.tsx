import { Link } from "react-router-dom";
import { CardsTotais } from "./CardsTotais";
import { ListaTransacoes } from "./ListaTransacoes";
import type { Transacao } from "../../types/Transacao";

interface PropsVisualizacaoTotais {
  titulo: string;
  textoBotaoVoltar: string;
  aoVoltar: () => void;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  transacoes: Transacao[];
  isLoading?: boolean;
  mostrarPessoa?: boolean;
  mostrarCategoria?: boolean;
}

export function VisualizacaoTotais({
  titulo,
  textoBotaoVoltar,
  aoVoltar,
  totalReceitas,
  totalDespesas,
  saldo,
  transacoes,
  isLoading = false,
  mostrarPessoa = true,
  mostrarCategoria = true,
}: PropsVisualizacaoTotais) {
  return (
    <div className="container py-4">
      <div className="mb-4">
        <Link to="/" className="text-primary text-decoration-none mb-3 d-inline-block">
          ← Voltar ao Dashboard
        </Link>
        <div className="d-flex align-items-center mb-3">
          <button
            className="btn btn-outline-secondary me-2"
            onClick={aoVoltar}
          >
            {textoBotaoVoltar}
          </button>
          <h1 className="display-4 mb-0">{titulo}</h1>
        </div>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <CardsTotais
            totalReceitas={totalReceitas}
            totalDespesas={totalDespesas}
            saldo={saldo}
          />

          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Lista de Transações</h5>
            </div>
            <div className="card-body">
              <ListaTransacoes 
                transacoes={transacoes}
                mostrarPessoa={mostrarPessoa}
                mostrarCategoria={mostrarCategoria}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

