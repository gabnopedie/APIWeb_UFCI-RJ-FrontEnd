"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CardAluguel from "../../components/CardAluguel";
import ConfirmDialog from "../../components/ConfirmDialog";
import FiltroAluguel from "../../components/FiltroAluguel";
import StatusBadge from "../../components/StatusBadge";
import TabelaPaginada from "../../components/TabelaPaginada";
import {
  excluirAluguel,
  listarAlugueis,
} from "../../services/aluguelService";

const itensPorPagina = 7;

export default function Alugueis() {
  const [filtros, definirFiltros] = useState({
    status: "",
    id_usuario: "",
    id_jogo: "",
  });
  const [alugueis, definirAlugueis] = useState([]);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState(null);
  const [termoBusca, definirTermoBusca] = useState("");
  const [paginaAtual, definirPaginaAtual] = useState(1);
  const [aluguelSelecionado, definirAluguelSelecionado] = useState(null);
  const [aluguelParaExcluir, definirAluguelParaExcluir] = useState(null);
  const [acaoEmAndamento, definirAcaoEmAndamento] = useState(false);

  async function carregarAlugueis() {
    definirCarregando(true);
    definirErro(null);
    try {
      const resultado = await listarAlugueis(filtros);
      definirAlugueis(resultado);
    } catch (erroApi) {
      const status = erroApi.response?.status;
      definirErro({
        status,
        message:
          status === 400
            ? "Os filtros enviados são inválidos."
            : status === 404
              ? "Nenhum aluguel foi encontrado."
              : status === 500
                ? "O servidor encontrou um erro ao carregar os aluguéis."
                : erroApi.message || "Não foi possível carregar os aluguéis.",
      });
    } finally {
      definirCarregando(false);
    }
  }

  useEffect(() => {
    carregarAlugueis();
  }, [filtros]);

  function atualizarFiltro(campo, valor) {
    definirFiltros((anterior) => ({ ...anterior, [campo]: valor }));
    definirPaginaAtual(1);
  }

  const termo = termoBusca.trim().toLowerCase();
  const resultados = alugueis.filter((aluguel) =>
    [
      aluguel.id,
      aluguel.jogoNome,
      aluguel.clienteNome,
      aluguel.status,
    ].some((valor) => String(valor || "").toLowerCase().includes(termo)),
  );
  const totalPaginas = Math.max(1, Math.ceil(resultados.length / itensPorPagina));
  const dadosPagina = resultados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina,
  );

  async function confirmarExclusao() {
    if (!aluguelParaExcluir) {
      return;
    }
    definirAcaoEmAndamento(true);
    try {
      await excluirAluguel(aluguelParaExcluir.id);
      definirAluguelParaExcluir(null);
      if (aluguelSelecionado?.id === aluguelParaExcluir.id) {
        definirAluguelSelecionado(null);
      }
      await carregarAlugueis();
    } catch (erroApi) {
      const status = erroApi.response?.status;
      definirErro({
        status,
        message:
          status === 400
            ? "A solicitação de exclusão do aluguel é inválida."
            : status === 404
              ? "O aluguel não existe mais."
              : status === 500
                ? "O servidor não conseguiu excluir o aluguel."
                : erroApi.message || "Não foi possível excluir o aluguel.",
      });
      definirAluguelParaExcluir(null);
    } finally {
      definirAcaoEmAndamento(false);
    }
  }

  const colunas = [
    { chave: "id", titulo: "Nº" },
    { chave: "jogoNome", titulo: "Jogo" },
    { chave: "clienteNome", titulo: "Cliente" },
    { chave: "dataInicioFormatada", titulo: "Início" },
    { chave: "dataFimFormatada", titulo: "Devolução" },
    { chave: "valorTotalFormatado", titulo: "Valor" },
    {
      chave: "status",
      titulo: "Status",
      renderizar: (aluguel) => (
        <StatusBadge status={aluguel.status} tipo="aluguel" />
      ),
    },
  ];

  return (
    <main className="recipiente">
      <div className="sobreposicao-conteudo">
        <header className="cabecalho-glass cabecalho-modulo">
          <div className="textos-cabecalho-modulo">
            <Link className="link-voltar" href="/">
              &#8592; Painel principal
            </Link>
            <h1 className="titulo-pagina">Contratos de aluguel</h1>
          </div>
          <Link className="botao-novo" href="/alugueis/novo">
            Novo contrato
          </Link>
        </header>

        <FiltroAluguel filtros={filtros} atualizarFiltro={atualizarFiltro} />
        <section className="conteudo-modulo">
          <TabelaPaginada
            colunas={colunas}
            dados={dadosPagina}
            carregando={carregando || acaoEmAndamento}
            erro={erro}
            termoBusca={termoBusca}
            aoMudarBusca={(valor) => {
              definirTermoBusca(valor);
              definirPaginaAtual(1);
            }}
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            aoMudarPagina={definirPaginaAtual}
            renderizarAcoes={(aluguel) => (
              <div className="acoes-cartao">
                <button
                  className="botao-acao-vazado"
                  type="button"
                  onClick={() => definirAluguelSelecionado(aluguel)}
                >
                  Detalhes
                </button>
                <button
                  className="botao-acao-vazado"
                  type="button"
                  onClick={() => definirAluguelParaExcluir(aluguel)}
                >
                  Excluir
                </button>
              </div>
            )}
          />
          {aluguelSelecionado && (
            <div className="grade-contratos">
              <CardAluguel
                aluguel={aluguelSelecionado}
                aoExcluir={() => definirAluguelParaExcluir(aluguelSelecionado)}
              />
            </div>
          )}
        </section>
      </div>
      <ConfirmDialog
        aberto={Boolean(aluguelParaExcluir)}
        titulo="Excluir aluguel"
        mensagem="Deseja realmente excluir este registro?"
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => definirAluguelParaExcluir(null)}
      />
    </main>
  );
}
