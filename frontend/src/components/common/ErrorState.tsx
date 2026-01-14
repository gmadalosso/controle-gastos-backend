import { Link } from "react-router-dom";

interface ErrorStateProps {
  mensagem: string;
  mostrarLinkVoltar?: boolean;
  aoTentarNovamente?: () => void;
}

export function ErrorState({ 
  mensagem, 
  mostrarLinkVoltar = true,
  aoTentarNovamente 
}: ErrorStateProps) {
  return (
    <div className="container py-4">
      {mostrarLinkVoltar && (
        <Link to="/" className="text-primary text-decoration-none mb-3 d-inline-block">
          ← Voltar ao Dashboard
        </Link>
      )}
      <div className="alert alert-danger">
        {mensagem}
        {aoTentarNovamente && (
          <div className="mt-3">
            <button className="btn btn-outline-danger" onClick={aoTentarNovamente}>
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

