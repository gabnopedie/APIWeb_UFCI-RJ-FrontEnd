"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "../../components/Input";
import { useApi } from "../../hooks/useApi";
import {
  AcaoPagamento,
  FormaPagamento,
  FormaPagamentoLabel,
  StatusPagamento,
  StatusPagamentoLabel,
} from "../../constants/enums";

export default function Pagamentos() {
  const [filtros, definirFiltros] = useState({
    status: "",
    forma_pagamento: "",
    startDate: "",
    endDate: "",
  });
  const [erroAcao, definirErroAcao] = useState("");
  const [acaoEmAndamento, definirAcaoEmAndamento] = useState(null);

  const parametros = new URLSearchParams();
  if (filtros.status) parametros.append("status", filtros.status);
  if (filtros.forma_pagamento) {
    parametros.append("forma_pagamento", filtros.forma_pagamento);
  }
  if (filtros.startDate) parametros.append("startDate", filtros.startDate);
  if (filtros.endDate) parametros.append("endDate", filtros.endDate);

  const endpoint = `/payments?${parametros.toString()}`;
  const { data: respostaApi, loading, error, refetch, request } = useApi(endpoint);
  const pagamentos = respostaApi?.data || [];

  function atualizarFiltro(campo, valor) {
    definirFiltros((anterior) => ({ ...anterior, [campo]: valor }));
  }

  async function alterarStatus(id, acao) {
    definirErroAcao("");
    definirAcaoEmAndamento(id);
    try {
      await request(`/payments/${id}/${acao}`, { method: "PATCH" });
      await refetch();
    } catch (requestError) {
      definirErroAcao(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível atualizar o pagamento.",
      );
    } finally {
      definirAcaoEmAndamento(null);
    }
  }

  return (
    <main className="recipiente">
      <div className="sobreposicao-conteudo">
        <header className="cabecalho-glass cabecalho-modulo">
          <div className="linha-topo">
            <Link className="link-voltar" href="/">
              &#8592; Painel principal
            </Link>
            <Link className="botao-novo" href="/pagamentos/novo">
              Registrar pagamento
            </Link>
          </div>
          <h1 className="titulo-pagina">Gestão financeira</h1>
          <div className="linha-decorativa" />
        </header>

        <section
          className="area-filtros-glass filtros-pagamentos"
          aria-label="Filtros de pagamentos"
        >
          <select
            className="entrada-filtro"
            aria-label="Filtrar por status"
            value={filtros.status}
            onChange={(evento) => atualizarFiltro("status", evento.target.value)}
          >
            <option value="">Todos os status</option>
            {Object.values(StatusPagamento).map((status) => (
              <option key={status} value={status}>
                {StatusPagamentoLabel[status]}
              </option>
            ))}
          </select>
          <select
            className="entrada-filtro"
            aria-label="Filtrar por forma de pagamento"
            value={filtros.forma_pagamento}
            onChange={(evento) =>
              atualizarFiltro("forma_pagamento", evento.target.value)
            }
          >
            <option value="">Todas as formas</option>
            {Object.values(FormaPagamento).map((forma) => (
              <option key={forma} value={forma}>
                {FormaPagamentoLabel[forma]}
              </option>
            ))}
          </select>
          <Input
            label="Data inicial"
            type="date"
            value={filtros.startDate}
            onChange={(evento) =>
              atualizarFiltro("startDate", evento.target.value)
            }
          />
          <Input
            label="Data final"
            type="date"
            value={filtros.endDate}
            onChange={(evento) =>
              atualizarFiltro("endDate", evento.target.value)
            }
          />
        </section>

        <section className="conteudo-modulo">
          {error && <p className="mensagem-erro">{error}</p>}
          {erroAcao && <p className="mensagem-erro">{erroAcao}</p>}
          {loading && <p className="texto-vazio">Carregando pagamentos...</p>}
          {!loading && !error && pagamentos.length === 0 && (
            <p className="texto-vazio">
              Nenhum registro financeiro localizado.
            </p>
          )}

          <div className="grade-contratos">
            {pagamentos.map((pagamento) => (
              <article className="cartao-glass" key={pagamento.id}>
                <div className="cabecalho-cartao">
                  <span className="numero-contrato">
                    Recibo nº {pagamento.id}
                  </span>
                  <span
                    className="etiqueta-status"
                    data-status={pagamento.status}
                  >
                    {StatusPagamentoLabel[pagamento.status] ??
                      String(pagamento.status).toLowerCase()}
                  </span>
                </div>
                <h2 className="nome-jogo">
                  R$ {Number(pagamento.valor).toFixed(2)}
                </h2>
                <p className="detalhe-texto">
                  Contrato origem: {pagamento.id_aluguel}
                </p>
                <p className="detalhe-texto">
                  Método:{" "}
                  {FormaPagamentoLabel[pagamento.forma_pagamento] ??
                    String(pagamento.forma_pagamento).toLowerCase()}
                </p>

                {pagamento.status === StatusPagamento.PENDENTE && (
                  <div className="acoes-cartao">
                    <button
                      className="botao-acao"
                      type="button"
                      disabled={acaoEmAndamento === pagamento.id}
                      onClick={() =>
                        alterarStatus(pagamento.id, AcaoPagamento.CONFIRMAR)
                      }
                    >
                      Confirmar
                    </button>
                    <button
                      className="botao-acao-vazado"
                      type="button"
                      disabled={acaoEmAndamento === pagamento.id}
                      onClick={() =>
                        alterarStatus(pagamento.id, AcaoPagamento.ESTORNAR)
                      }
                    >
                      Estornar
                    </button>
                  </div>
                )}
                {pagamento.status === StatusPagamento.PAGO && (
                  <div className="acoes-cartao">
                    <button
                      className="botao-acao-vazado"
                      type="button"
                      disabled={acaoEmAndamento === pagamento.id}
                      onClick={() =>
                        alterarStatus(pagamento.id, AcaoPagamento.ESTORNAR)
                      }
                    >
                      Estornar
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
