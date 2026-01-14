interface PropsModalFormulario {
  isOpen: boolean;
  titulo: string;
  onClose: () => void;
  aoEnviar: (e: React.FormEvent) => void;
  children: React.ReactNode;
  isLoading?: boolean;
  rotuloEnviar?: string;
  rotuloCancelar?: string;
}

export function ModalFormulario({
  isOpen,
  titulo,
  onClose,
  aoEnviar,
  children,
  isLoading = false,
  rotuloEnviar = "Salvar",
  rotuloCancelar = "Cancelar"
}: PropsModalFormulario) {
  if (!isOpen) return null;

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
            <h5 className="modal-title">{titulo}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          <form onSubmit={aoEnviar}>
            <div className="modal-body">
              {children}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                {rotuloCancelar}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : rotuloEnviar}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

