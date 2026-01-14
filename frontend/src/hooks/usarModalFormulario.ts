import { useState } from "react";

interface OpcoesUsarModalFormulario<T> {
  initialData: T;
}

export function usarModalFormulario<T>({ initialData }: OpcoesUsarModalFormulario<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<T>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const open = () => {
    setFormData(initialData);
    setError(null);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setError(null);
  };

  const reset = () => {
    setFormData(initialData);
    setError(null);
  };

  return {
    isOpen,
    formData,
    setFormData,
    error,
    setError,
    isLoading,
    setIsLoading,
    open,
    close,
    reset,
  };
}

