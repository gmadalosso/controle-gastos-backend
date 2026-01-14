import { useEffect, useState } from "react";
import { http } from "../api/http";
import type { Pessoa, PessoaCreate, PessoaTotais, PessoaTotaisGerais } from "../types/Pessoa";
import type { Transacao } from "../types/Transacao";
import { VisualizacaoTotais } from "../components/common/VisualizacaoTotais";
import { ModalConfirmarExclusao } from "../components/common/ModalConfirmarExclusao";
import { CabecalhoPagina } from "../components/common/CabecalhoPagina";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { ModalFormulario } from "../components/common/ModalFormulario";
import { converterTransacoesDaApi } from "../utils/utils";
import { mostrarErro } from "../utils/utils";
import { usarModalFormulario } from "../hooks/usarModalFormulario";

export function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const formModal = usarModalFormulario<PessoaCreate>({ 
    initialData: { nome: "", idade: 0 } 
  });
  const [pessoaSelecionadaId, setPessoaSelecionadaId] = useState<string | null>(null);
  const [transacoesPessoa, setTransacoesPessoa] = useState<Transacao[]>([]);
  const [totaisPessoa, setTotaisPessoa] = useState<PessoaTotais | null>(null);
  const [carregandoGastos, setCarregandoGastos] = useState(false);
  const [mostrandoTotaisGerais, setMostrandoTotaisGerais] = useState(false);
  const [totaisGerais, setTotaisGerais] = useState<PessoaTotaisGerais | null>(null);
  const [transacoesGerais, setTransacoesGerais] = useState<Transacao[]>([]);
  const [carregandoTotaisGerais, setCarregandoTotaisGerais] = useState(false);
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);
  const [pessoaParaExcluir, setPessoaParaExcluir] = useState<{ id: string; nome: string } | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    carregarPessoas();
  }, []);

  async function carregarPessoas() {
    try {
      setLoading(true);
      const response = await http.get<Pessoa[]>("/api/pessoas");
      setPessoas(response.data);
      setErro(null);
    } catch (e) {
      setErro("Erro ao carregar pessoas");
    } finally {
      setLoading(false);
    }
  }

  async function carregarGastosPessoa(pessoaId: string) {
    try {
      setCarregandoGastos(true);
      setMostrandoTotaisGerais(false);
      const [totaisResponse, transacoesResponse] = await Promise.all([
        http.get(`/api/pessoas/${pessoaId}/totais`),
        http.get<any[]>("/api/transacoes"),
      ]);

      const totais: PessoaTotais = {
        pessoaId: totaisResponse.data.pessoaId,
        nome: totaisResponse.data.nome,
        totalReceitas: totaisResponse.data.totalReceitas,
        totalDespesas: totaisResponse.data.totalDespesas,
        saldo: totaisResponse.data.totalReceitas - totaisResponse.data.totalDespesas,
      };

      const transacoesConvertidas = converterTransacoesDaApi(transacoesResponse.data);
      const transacoesFiltradas = transacoesConvertidas.filter(
        (t) => t.pessoaId === pessoaId
      );

      setTotaisPessoa(totais);
      setTransacoesPessoa(transacoesFiltradas);
      setPessoaSelecionadaId(pessoaId);
    } catch (e) {
      mostrarErro("Erro ao carregar gastos da pessoa", e);
    } finally {
      setCarregandoGastos(false);
    }
  }

  async function carregarTotaisGerais() {
    try {
      setCarregandoTotaisGerais(true);
      setPessoaSelecionadaId(null);
      const [totaisResponse, transacoesResponse] = await Promise.all([
        http.get("/api/pessoas/totais"),
        http.get<any[]>("/api/transacoes"),
      ]);

      const transacoesConvertidas = converterTransacoesDaApi(transacoesResponse.data);

      const totais: PessoaTotaisGerais = {
        totalReceitas: totaisResponse.data.totalReceitas,
        totalDespesas: totaisResponse.data.totalDespesas,
        saldo: totaisResponse.data.totalReceitas - totaisResponse.data.totalDespesas,
      };

      setTotaisGerais(totais);
      setTransacoesGerais(transacoesConvertidas);
      setMostrandoTotaisGerais(true);
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || e.message || "Erro desconhecido";
      mostrarErro(`Erro ao carregar totais gerais: ${errorMessage}`, e);
      setMostrandoTotaisGerais(false);
    } finally {
      setCarregandoTotaisGerais(false);
    }
  }

  function voltarParaLista() {
    setPessoaSelecionadaId(null);
    setTransacoesPessoa([]);
    setTotaisPessoa(null);
    setMostrandoTotaisGerais(false);
    setTotaisGerais(null);
    setTransacoesGerais([]);
  }

  async function cadastrarPessoa(e: React.FormEvent) {
    e.preventDefault();
    formModal.setError(null);

    if (!formModal.formData.nome.trim()) {
      formModal.setError("Nome é obrigatório");
      return;
    }

    if (formModal.formData.idade < 0) {
      formModal.setError("Idade não pode ser menor que zero");
      return;
    }

    try {
      formModal.setIsLoading(true);
      await http.post<Pessoa>("/api/pessoas", formModal.formData);
      formModal.reset();
      formModal.close();
      await carregarPessoas();
    } catch (e: any) {
      formModal.setError(e.response?.data?.message || "Erro ao cadastrar pessoa");
    } finally {
      formModal.setIsLoading(false);
    }
  }

  function solicitarExclusaoPessoa(id: string, nome: string) {
    setPessoaParaExcluir({ id, nome });
    setMostrarModalExclusao(true);
  }

  function cancelarExclusao() {
    setMostrarModalExclusao(false);
    setPessoaParaExcluir(null);
  }

  async function confirmarExclusaoPessoa() {
    if (!pessoaParaExcluir) return;

    try {
      setExcluindo(true);
      await http.delete(`/api/pessoas/${pessoaParaExcluir.id}`);
      setMostrarModalExclusao(false);
      setPessoaParaExcluir(null);
      await carregarPessoas();
    } catch (e) {
      mostrarErro("Erro ao excluir pessoa", e);
    } finally {
      setExcluindo(false);
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  if (erro) {
    return <ErrorState mensagem={erro} aoTentarNovamente={carregarPessoas} />;
  }

  if (mostrandoTotaisGerais && totaisGerais) {
    return (
      <VisualizacaoTotais
        titulo="Totais Gerais"
        textoBotaoVoltar="← Voltar para lista de pessoas"
        aoVoltar={voltarParaLista}
        totalReceitas={totaisGerais.totalReceitas}
        totalDespesas={totaisGerais.totalDespesas}
        saldo={totaisGerais.saldo}
        transacoes={transacoesGerais}
        isLoading={carregandoTotaisGerais}
      />
    );
  }

  if (pessoaSelecionadaId && totaisPessoa) {
    return (
      <VisualizacaoTotais
        titulo={`Gastos de ${totaisPessoa.nome}`}
        textoBotaoVoltar="← Voltar para lista de pessoas"
        aoVoltar={voltarParaLista}
        totalReceitas={totaisPessoa.totalReceitas}
        totalDespesas={totaisPessoa.totalDespesas}
        saldo={totaisPessoa.saldo}
        transacoes={transacoesPessoa}
        isLoading={carregandoGastos}
        mostrarPessoa={false}
      />
    );
  }

  return (
    <>
      <div className="container py-4">
        <CabecalhoPagina
          titulo="Administração de Pessoas"
          acoes={
            <>
              <button
                className="btn btn-primary me-2"
                onClick={formModal.open}
              >
                Cadastrar Pessoa
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
            <h5 className="mb-0">Lista de Pessoas Cadastradas</h5>
          </div>
          <div className="card-body">
            {pessoas.length === 0 ? (
              <EmptyState mensagem="Nenhuma pessoa cadastrada" />
            ) : (
              <div className="list-group list-group-flush">
                {pessoas.map((pessoa) => (
                  <div key={pessoa.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{pessoa.nome}</strong> - {pessoa.idade} anos
                    </div>
                    <div className="d-flex">
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => carregarGastosPessoa(pessoa.id)}
                      >
                        Ver total de gastos
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => solicitarExclusaoPessoa(pessoa.id, pessoa.nome)}
                      >
                        Deletar
                      </button>
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
        titulo="Cadastrar Pessoa"
        onClose={formModal.close}
        aoEnviar={cadastrarPessoa}
        isLoading={formModal.isLoading}
      >
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">Nome</label>
          <input
            id="nome"
            type="text"
            className="form-control"
            value={formModal.formData.nome}
            onChange={(e) => formModal.setFormData({ ...formModal.formData, nome: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="idade" className="form-label">Idade</label>
          <input
            id="idade"
            type="number"
            className="form-control"
            value={formModal.formData.idade || ""}
            onChange={(e) => formModal.setFormData({ ...formModal.formData, idade: parseInt(e.target.value) || 0 })}
            min="0"
            required
          />
        </div>

        {formModal.error && (
          <div className="alert alert-danger">{formModal.error}</div>
        )}
      </ModalFormulario>

      <ModalConfirmarExclusao
        isOpen={mostrarModalExclusao}
        nomeEntidade={pessoaParaExcluir?.nome || ""}
        tipoEntidade="pessoa"
        onClose={cancelarExclusao}
        aoConfirmar={confirmarExclusaoPessoa}
        isLoading={excluindo}
      />
    </>
  );
}
