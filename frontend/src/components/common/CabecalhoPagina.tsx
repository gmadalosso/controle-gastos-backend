import { Link } from "react-router-dom";

interface PropsCabecalhoPagina {
  titulo: string;
  mostrarVoltarAoDashboard?: boolean;
  botaoVoltar?: {
    texto: string;
    aoClicar: () => void;
  };
  acoes?: React.ReactNode;
}

export function CabecalhoPagina({ 
  titulo, 
  mostrarVoltarAoDashboard = true, 
  botaoVoltar,
  acoes 
}: PropsCabecalhoPagina) {
  return (
    <div className="mb-4">
      {mostrarVoltarAoDashboard && (
        <Link to="/" className="text-primary text-decoration-none mb-3 d-inline-block">
          ← Voltar ao Dashboard
        </Link>
      )}
      <div className="d-flex align-items-center mb-3">
        {botaoVoltar && (
          <button
            className="btn btn-outline-secondary me-2"
            onClick={botaoVoltar.aoClicar}
          >
            {botaoVoltar.texto}
          </button>
        )}
        <h1 className={`display-4 ${botaoVoltar ? "mb-0" : ""}`}>{titulo}</h1>
      </div>
      {acoes && (
        <div className="d-flex mb-4 flex-wrap">
          {acoes}
        </div>
      )}
    </div>
  );
}

