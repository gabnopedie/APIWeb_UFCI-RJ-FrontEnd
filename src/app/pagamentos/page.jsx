"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CardPagamento from "../../components/CardPagamento";
import ConfirmDialog from "../../components/ConfirmDialog";
import FiltroPagamento from "../../components/FiltroPagamento";
import StatusBadge from "../../components/StatusBadge";
import TabelaPaginada from "../../components/TabelaPaginada";
import {
  atualizarStatusPagamento,
  excluirPagamento,
  listarPagamentos,
} from "../../services/pagamentoService";

const itensPorPagina = 7;

export default function Pagamentos() {
  const [filtros, definirFiltros] = useState({
    status: "",
    forma_pagamento: "",
    startDate: "",
    endDate: "",
  });
  const [pagamentos, definirPagamentos] = useState([]);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState(null);
  const [termoBusca, definirTermoBusca] = useState("");
  const [paginaAtual, definirPaginaAtual] = useState(1);
  const [pagamentoSelecionado, definirPagamentoSelecionado] = useState(null);
  const [confirmacao, definirConfirmacao] = useState(null);
  const [acaoEmAndamento, definirAcaoEmAndamento] = useState(false);

  async function carregarPagamentos() {
    definirCarregando(true);
    definirErro(null);
    try {
      const resultado = await listarPagamentos(filtros);
      definirPagamentos(resultado);
    } catch (erroApi) {
      const status = erroApi.response?.status;
      definirErro({
        status,
        message:
          status === 400
            ? "Os filtros enviados são inválidos."
            : status === 404
              ? "Nenhum pagamento foi encontrado."
              : status === 500
                ? "O servidor encontrou um erro ao carregar os pagamentos."
                : erroApi.message || "Não foi possível carregar os pagamentos.",
      });
    } finally {
      definirCarregando(false);
    }
  }

  useEffect(() => {
    carregarPagamentos();
  }, [filtros]);

  function atualizarFiltro(campo, valor) {
    definirFiltros((anterior) => ({ ...anterior, [campo]: valor }));
    definirPaginaAtual(1);
  }

  const termo = termoBusca.trim().toLowerCase();
  const resultados = pagamentos.filter((pagamento) =>
    [
      pagamento.id,
      pagamento.aluguelId,
      pagamento.metodo,
      pagamento.status,
    ].some((valor) => String(valor || "").toLowerCase().includes(termo)),
  );
  const totalPaginas = Math.max(1, Math.ceil(resultados.length / itensPorPagina));
  const dadosPagina = resultados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina,
  );

  async function executarAcaoConfirmada() {
    if (!confirmacao) {
      return;
    }
    definirAcaoEmAndamento(true);
    try {
      if (confirmacao.acao === "excluir") {
        await excluirPagamento(confirmacao.pagamento.id);
        if (pagamentoSelecionado?.id === confirmacao.pagamento.id) {
          definirPagamentoSelecionado(null);
        }
      } else {
        await atualizarStatusPagamento(
          confirmacao.pagamento.id,
          confirmacao.status,
        );
      }
      definirConfirmacao(null);
      await carregarPagamentos();
    } catch (erroApi) {
      const status = erroApi.response?.status;
      definirErro({
        status,
        message:
          status === 400
            ? "A solicitação para alterar o pagamento é inválida."
            : status === 404
              ? "O pagamento não existe mais."
              : status === 500
                ? "O servidor não conseguiu atualizar o pagamento."
                : erroApi.message || "Não foi possível atualizar o pagamento.",
      });
      definirConfirmacao(null);
    } finally {
      definirAcaoEmAndamento(false);
    }
  }

  const colunas = [
    { chave: "id", titulo: "Nº" },
    { chave: "aluguelId", titulo: "Aluguel" },
    { chave: "valorFormatado", titulo: "Valor" },
    { chave: "metodo", titulo: "Método" },
    { chave: "dataPagamentoFormatada", titulo: "Data" },
    {
      chave: "status",
      titulo: "Status",
      renderizar: (pagamento) => (
        <StatusBadge status={pagamento.status} tipo="pagamento" />
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
            <h1 className="titulo-pagina">Pagamentos</h1>
          </div>
          <Link className="botao-novo" href="/pagamentos/novo">
            Registrar pagamento
          </Link>
        </header>

        <FiltroPagamento filtros={filtros} atualizarFiltro={atualizarFiltro} />
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
            renderizarAcoes={(pagamento) => (
              <div className="acoes-cartao">
                <button
                  className="botao-acao-vazado"
                  type="button"
                  onClick={() => definirPagamentoSelecionado(pagamento)}
                >
                  Detalhes
                </button>
                {pagamento.status === "PENDENTE" && (
                  <button
                    className="botao-acao"
                    type="button"
                    onClick={() =>
                      definirConfirmacao({
                        acao: "status",
                        status: "PAGO",
                        pagamento,
                      })
                    }
                  >
                    Confirmar
                  </button>
                )}
                {pagamento.status === "PAGO" && (
                  <button
                    className="botao-acao-vazado"
                    type="button"
                    onClick={() =>
                      definirConfirmacao({
                        acao: "status",
                        status: "ESTORNADO",
                        pagamento,
                      })
                    }
                  >
                    Estornar
                  </button>
                )}
                <button
                  className="botao-acao-vazado"
                  type="button"
                  onClick={() =>
                    definirConfirmacao({ acao: "excluir", pagamento })
                  }
                >
                  Excluir
                </button>
              </div>
            )}
          />
          {pagamentoSelecionado && (
            <div className="grade-contratos">
              <CardPagamento
                pagamento={pagamentoSelecionado}
                aoExcluir={() =>
                  definirConfirmacao({
                    acao: "excluir",
                    pagamento: pagamentoSelecionado,
                  })
                }
              />
            </div>
          )}
        </section>
      </div>
      <ConfirmDialog
        aberto={Boolean(confirmacao)}
        titulo={
          confirmacao?.acao === "excluir"
            ? "Excluir pagamento"
            : confirmacao?.status === "PAGO"
              ? "Confirmar pagamento"
              : "Estornar pagamento"
        }
        mensagem={
          confirmacao?.acao === "excluir"
            ? "Deseja realmente excluir este registro?"
            : confirmacao?.status === "PAGO"
              ? "Deseja confirmar este pagamento?"
              : "Deseja realmente estornar este pagamento?"
        }
        aoConfirmar={executarAcaoConfirmada}
        aoCancelar={() => definirConfirmacao(null)}
      />
    </main>
  );
}
