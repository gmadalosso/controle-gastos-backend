import { Link } from "react-router-dom";

interface LoadingStateProps {
  mensagem?: string;
  mostrarLinkVoltar?: boolean;
}

export function LoadingState({ 
  mensagem = "Carregando...", 
  mostrarLinkVoltar = true 
}: LoadingStateProps) {
  return (
    <div className="container py-4">
      {mostrarLinkVoltar && (
        <Link to="/" className="text-primary text-decoration-none mb-3 d-inline-block">
          ← Voltar ao Dashboard
        </Link>
      )}
      <p>{mensagem}</p>
    </div>
  );
}

