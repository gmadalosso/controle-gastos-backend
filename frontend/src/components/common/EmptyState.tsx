interface EmptyStateProps {
  mensagem: string;
}

export function EmptyState({ mensagem }: EmptyStateProps) {
  return (
    <div className="text-center text-muted py-5">
      {mensagem}
    </div>
  );
}

