"use client";

import { useState } from "react";
import Link from "next/link";
import { useApi } from "../../hooks/useApi";
import CardPagamento from "../../components/CardPagamento";
import FiltroPagamento from "../../components/FiltroPagamento";

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

        <FiltroPagamento
          filtros={filtros}
          atualizarFiltro={atualizarFiltro}
        />

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
              <CardPagamento
                key={pagamento.id}
                pagamento={pagamento}
                carregando={acaoEmAndamento === pagamento.id}
                confirmar={(id) => alterarStatus(id, "confirm")}
                estornar={(id) => alterarStatus(id, "refund")}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
