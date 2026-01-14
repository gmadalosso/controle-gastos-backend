import { useEffect, useState } from "react";
import { http } from "../api/http";
import type { Categoria, CategoriaCreate, CategoriaTotais, CategoriaTotaisGeraisResponse } from "../types/Categoria";
import type { Transacao } from "../types/Transacao";
import { VisualizacaoTotais } from "../components/common/VisualizacaoTotais";
import { CabecalhoPagina } from "../components/common/CabecalhoPagina";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { ModalFormulario } from "../components/common/ModalFormulario";
import { finalidadeParaNumero, mostrarErro } from "../utils/utils";
import { converterTransacoesDaApi, converterCategoriasDaApi } from "../utils/utils";
import { usarModalFormulario } from "../hooks/usarModalFormulario";

export function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const formModal = usarModalFormulario<CategoriaCreate>({ 
    initialData: { descricao: "", finalidade: "Despesa" } 
  });
  const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState<string | null>(null);
  const [transacoesCategoria, setTransacoesCategoria] = useState<Transacao[]>([]);
  const [totaisCategoria, setTotaisCategoria] = useState<CategoriaTotais | null>(null);
  const [carregandoGastos, setCarregandoGastos] = useState(false);
  const [mostrandoTotaisGerais, setMostrandoTotaisGerais] = useState(false);
  const [totaisGerais, setTotaisGerais] = useState<CategoriaTotaisGeraisResponse | null>(null);
  const [transacoesGerais, setTransacoesGerais] = useState<Transacao[]>([]);
  const [carregandoTotaisGerais, setCarregandoTotaisGerais] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    try {
      setLoading(true);
      const response = await http.get<any[]>("/api/categorias");
      const categoriasConvertidas = converterCategoriasDaApi(response.data);
      setCategorias(categoriasConvertidas);
      setErro(null);
    } catch (e) {
      setErro("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  }

  async function carregarGastosCategoria(categoriaId: string) {
    try {
      setCarregandoGastos(true);
      setMostrandoTotaisGerais(false);
      const [totaisResponse, transacoesResponse] = await Promise.all([
        http.get(`/api/categorias/${categoriaId}/totais`),
        http.get<any[]>("/api/transacoes"),
      ]);

      const totais: CategoriaTotais = {
        categoriaId: totaisResponse.data.categoriaId,
        descricao: totaisResponse.data.descricao,
        totalReceitas: totaisResponse.data.totalReceitas,
        totalDespesas: totaisResponse.data.totalDespesas,
        saldo: totaisResponse.data.totalReceitas - totaisResponse.data.totalDespesas,
      };

      const transacoesConvertidas = converterTransacoesDaApi(transacoesResponse.data);

      const transacoesFiltradas = transacoesConvertidas.filter(
        (t) => t.categoriaId === categoriaId
      );

      setTotaisCategoria(totais);
      setTransacoesCategoria(transacoesFiltradas);
      setCategoriaSelecionadaId(categoriaId);
    } catch (e) {
      mostrarErro("Erro ao carregar gastos da categoria", e);
    } finally {
      setCarregandoGastos(false);
    }
  }

  async function carregarTotaisGerais() {
    try {
      setCarregandoTotaisGerais(true);
      setCategoriaSelecionadaId(null);
      const [totaisResponse, transacoesResponse] = await Promise.all([
        http.get("/api/categorias/totais"),
        http.get<any[]>("/api/transacoes"),
      ]);

      const transacoesConvertidas = converterTransacoesDaApi(transacoesResponse.data);

      const totais: CategoriaTotaisGeraisResponse = {
        categorias: totaisResponse.data.categorias.map((c: any) => ({
          categoriaId: c.categoriaId,
          descricao: c.descricao,
          totalReceitas: c.totalReceitas,
          totalDespesas: c.totalDespesas,
          saldo: c.totalReceitas - c.totalDespesas,
        })),
        totalGeral: {
          totalReceitas: totaisResponse.data.totalGeral.totalReceitas,
          totalDespesas: totaisResponse.data.totalGeral.totalDespesas,
          saldo: totaisResponse.data.totalGeral.totalReceitas - totaisResponse.data.totalGeral.totalDespesas,
        },
      };

      setTotaisGerais(totais);
      setTransacoesGerais(transacoesConvertidas);
      setMostrandoTotaisGerais(true);
    } catch (e) {
      mostrarErro("Erro ao carregar totais gerais", e);
    } finally {
      setCarregandoTotaisGerais(false);
    }
  }

  function voltarParaLista() {
    setCategoriaSelecionadaId(null);
    setTransacoesCategoria([]);
    setTotaisCategoria(null);
    setMostrandoTotaisGerais(false);
    setTotaisGerais(null);
    setTransacoesGerais([]);
  }

  async function cadastrarCategoria(e: React.FormEvent) {
    e.preventDefault();
    formModal.setError(null);

    if (!formModal.formData.descricao.trim()) {
      formModal.setError("Descrição é obrigatória");
      return;
    }

    try {
      formModal.setIsLoading(true);
      await http.post<Categoria>("/api/categorias", {
        descricao: formModal.formData.descricao,
        finalidade: finalidadeParaNumero(formModal.formData.finalidade),
      });
      formModal.reset();
      formModal.close();
      await carregarCategorias();
    } catch (e: any) {
      formModal.setError(e.response?.data?.message || "Erro ao cadastrar categoria");
    } finally {
      formModal.setIsLoading(false);
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  if (erro) {
    return <ErrorState mensagem={erro} aoTentarNovamente={carregarCategorias} />;
  }

  if (mostrandoTotaisGerais && totaisGerais) {
    return (
      <VisualizacaoTotais
        titulo="Totais Gerais"
        textoBotaoVoltar="← Voltar para lista de categorias"
        aoVoltar={voltarParaLista}
        totalReceitas={totaisGerais.totalGeral.totalReceitas}
        totalDespesas={totaisGerais.totalGeral.totalDespesas}
        saldo={totaisGerais.totalGeral.saldo}
        transacoes={transacoesGerais}
        isLoading={carregandoTotaisGerais}
      />
    );
  }

  if (categoriaSelecionadaId && totaisCategoria) {
    return (
      <VisualizacaoTotais
        titulo={`Gastos de ${totaisCategoria.descricao}`}
        textoBotaoVoltar="← Voltar para lista de categorias"
        aoVoltar={voltarParaLista}
        totalReceitas={totaisCategoria.totalReceitas}
        totalDespesas={totaisCategoria.totalDespesas}
        saldo={totaisCategoria.saldo}
        transacoes={transacoesCategoria}
        isLoading={carregandoGastos}
        mostrarCategoria={false}
      />
    );
  }

  return (
    <>
      <div className="container py-4">
        <CabecalhoPagina
          titulo="Administração de Categorias"
          acoes={
            <>
              <button
                className="btn btn-primary me-2"
                onClick={formModal.open}
              >
                Cadastrar Categoria
              </button>
              <button
                className="btn btn-secondary"
                onClick={carregarTotaisGerais}
              >
                Ver Totais Gerais
              </button>
            </>
          }
        />

        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Lista de Categorias Cadastradas</h5>
          </div>
          <div className="card-body">
            {categorias.length === 0 ? (
              <EmptyState mensagem="Nenhuma categoria cadastrada" />
            ) : (
              <div className="list-group list-group-flush">
                {categorias.map((categoria) => (
                  <div key={categoria.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{categoria.descricao}</strong> - {categoria.finalidade}
                    </div>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => carregarGastosCategoria(categoria.id)}
                    >
                      Ver total de gastos
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ModalFormulario
        isOpen={formModal.isOpen}
        titulo="Cadastrar Categoria"
        onClose={formModal.close}
        aoEnviar={cadastrarCategoria}
        isLoading={formModal.isLoading}
      >
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
          <label htmlFor="finalidade" className="form-label">Tipo de Gasto</label>
          <select
            id="finalidade"
            className="form-select"
            value={formModal.formData.finalidade}
            onChange={(e) => formModal.setFormData({ ...formModal.formData, finalidade: e.target.value as "Despesa" | "Receita" | "Ambas" })}
            required
          >
            <option value="Despesa">1) Despesa</option>
            <option value="Receita">2) Receita</option>
            <option value="Ambas">3) Ambas</option>
          </select>
        </div>

        {formModal.error && (
          <div className="alert alert-danger">{formModal.error}</div>
        )}
      </ModalFormulario>
    </>
  );
}
