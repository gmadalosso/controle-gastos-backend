interface PropsModalConfirmarExclusao {
  isOpen: boolean;
  nomeEntidade: string;
  tipoEntidade: string;
  mensagemAviso?: string;
  onClose: () => void;
  aoConfirmar: () => void;
  isLoading?: boolean;
}

export function ModalConfirmarExclusao({
  isOpen,
  nomeEntidade,
  tipoEntidade,
  mensagemAviso,
  onClose,
  aoConfirmar,
  isLoading = false,
}: PropsModalConfirmarExclusao) {
  if (!isOpen) return null;

  const mensagemAvisoPadrao = `A exclusão desta ${tipoEntidade} acarretará na exclusão automática de todas as transações cadastradas para ela. Esta ação não pode ser desfeita.`;

  return (
    <div 
      className="modal show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} 
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-dialog-centered" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar Exclusão</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-warning">
              <strong>Atenção!</strong> Você está prestes a excluir a {tipoEntidade} <strong>{nomeEntidade}</strong>.
            </div>
            <p>
              {mensagemAviso || mensagemAvisoPadrao}
            </p>
            <p className="mb-0">
              Você aceita o risco e deseja continuar com a exclusão?
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={aoConfirmar}
              disabled={isLoading}
            >
              {isLoading ? "Excluindo..." : "Confirmar Exclusão"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

