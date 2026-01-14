import { useEffect, useState } from "react";
import { http } from "../api/http";
import type { Transacao, TransacaoCreate, TipoTransacao } from "../types/Transacao";
import type { Pessoa } from "../types/Pessoa";
import type { Categoria } from "../types/Categoria";
import { CabecalhoPagina } from "../components/common/CabecalhoPagina";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { ModalFormulario } from "../components/common/ModalFormulario";
import { tipoParaNumero, formatarValor, mostrarErro } from "../utils/utils";
import { converterTransacoesDaApi, converterCategoriasDaApi, determinarTipoPorCategoria, categoriaAceitaAmbas } from "../utils/utils";
import { usarModalFormulario } from "../hooks/usarModalFormulario";

export function Transacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const formModal = usarModalFormulario<TransacaoCreate>({ 
    initialData: {
      descricao: "",
      valor: 0,
      tipo: "Despesa",
      pessoaId: "",
      categoriaId: "",
    }
  });

  useEffect(() => {
    carregarTransacoes();
    carregarPessoas();
    carregarCategorias();
  }, []);

  async function carregarTransacoes() {
    try {
      setLoading(true);
      const response = await http.get<any[]>("/api/transacoes");
      const transacoesConvertidas = converterTransacoesDaApi(response.data);
      setTransacoes(transacoesConvertidas);
      setErro(null);
    } catch (e) {
      setErro("Erro ao carregar transações");
    } finally {
      setLoading(false);
    }
  }

  async function carregarPessoas() {
    try {
      const response = await http.get<Pessoa[]>("/api/pessoas");
      setPessoas(response.data);
    } catch (e) {
      mostrarErro("Erro ao carregar pessoas", e);
    }
  }

  async function carregarCategorias() {
    try {
      const response = await http.get<any[]>("/api/categorias");
      const categoriasConvertidas = converterCategoriasDaApi(response.data);
      setCategorias(categoriasConvertidas);
    } catch (e) {
      mostrarErro("Erro ao carregar categorias", e);
    }
  }

  function handleCategoriaChange(categoriaId: string) {
    const tipo = determinarTipoPorCategoria(categoriaId, categorias);
    formModal.setFormData({ ...formModal.formData, categoriaId, tipo });
  }

  async function cadastrarTransacao(e: React.FormEvent) {
    e.preventDefault();
    formModal.setError(null);

    if (!formModal.formData.descricao.trim()) {
      formModal.setError("Descrição é obrigatória");
      return;
    }

    if (formModal.formData.valor <= 0) {
      formModal.setError("Valor deve ser maior que zero");
      return;
    }

    if (!formModal.formData.pessoaId) {
      formModal.setError("Pessoa é obrigatória");
      return;
    }

    if (!formModal.formData.categoriaId) {
      formModal.setError("Categoria é obrigatória");
      return;
    }

    try {
      formModal.setIsLoading(true);
      await http.post<Transacao>("/api/transacoes", {
        descricao: formModal.formData.descricao,
        valor: formModal.formData.valor,
        tipo: tipoParaNumero(formModal.formData.tipo),
        pessoaId: formModal.formData.pessoaId,
        categoriaId: formModal.formData.categoriaId,
      });
      formModal.reset();
      formModal.close();
      await carregarTransacoes();
    } catch (e: any) {
      formModal.setError(e.response?.data?.message || e.response?.data || "Erro ao cadastrar transação");
    } finally {
      formModal.setIsLoading(false);
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  if (erro) {
    return <ErrorState mensagem={erro} aoTentarNovamente={carregarTransacoes} />;
  }

  return (
    <>
    <div className="container py-4">
      <CabecalhoPagina
        titulo="Administração de Transações"
        acoes={
          <button
            className="btn btn-primary"
            onClick={formModal.open}
          >
            Cadastrar Transação
          </button>
        }
      />

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Lista de Transações</h5>
        </div>
        <div className="card-body">
          {transacoes.length === 0 ? (
            <EmptyState mensagem="Nenhuma transação cadastrada" />
          ) : (
            <div className="list-group list-group-flush">
              {transacoes.map((transacao) => (
                <div key={transacao.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{transacao.descricao}</strong>
                      <div className="text-muted small mt-1">
                        <span className={transacao.tipo === "Receita" ? "text-success" : "text-danger"}>
                          {transacao.tipo}
                        </span> • {formatarValor(transacao.valor)} • {transacao.pessoaNome} • {transacao.categoriaDescricao}
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
          )}
        </div>
      </div>
    </div>

    <ModalFormulario
      isOpen={formModal.isOpen}
      titulo="Cadastrar Transação"
      onClose={formModal.close}
      aoEnviar={cadastrarTransacao}
      isLoading={formModal.isLoading}
    >
      <div className="mb-3">
        <label htmlFor="pessoaId" className="form-label">Pessoa</label>
        <select
          id="pessoaId"
          className="form-select"
          value={formModal.formData.pessoaId}
          onChange={(e) => formModal.setFormData({ ...formModal.formData, pessoaId: e.target.value })}
          required
        >
          <option value="">Selecione uma pessoa</option>
          {pessoas.map((pessoa) => (
            <option key={pessoa.id} value={pessoa.id}>
              {pessoa.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="categoriaId" className="form-label">Categoria</label>
        <select
          id="categoriaId"
          className="form-select"
          value={formModal.formData.categoriaId}
          onChange={(e) => handleCategoriaChange(e.target.value)}
          required
        >
          <option value="">Selecione uma categoria</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.descricao}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="tipo" className="form-label">Tipo</label>
        {formModal.formData.categoriaId && categoriaAceitaAmbas(formModal.formData.categoriaId, categorias) ? (
          <select
            id="tipo"
            className="form-select"
            value={formModal.formData.tipo}
            onChange={(e) => formModal.setFormData({ ...formModal.formData, tipo: e.target.value as TipoTransacao })}
            required
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
          </select>
        ) : (
          <input
            id="tipo"
            type="text"
            className="form-control"
            value={formModal.formData.categoriaId ? formModal.formData.tipo : ""}
            readOnly
            disabled
          />
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="descricao" className="form-label">Descrição</label>
        <input
          id="descricao"
          type="text"
          className="form-control"
          value={formModal.formData.descricao}
          onChange={(e) => formModal.setFormData({ ...formModal.formData, descricao: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="valor" className="form-label">Valor</label>
        <input
          id="valor"
          type="number"
          step="0.01"
          min="0.01"
          className="form-control"
          value={formModal.formData.valor || ""}
          onChange={(e) => formModal.setFormData({ ...formModal.formData, valor: parseFloat(e.target.value) || 0 })}
          required
        />
      </div>

      {formModal.error && (
        <div className="alert alert-danger">{formModal.error}</div>
      )}
    </ModalFormulario>
    </>
  );
}
