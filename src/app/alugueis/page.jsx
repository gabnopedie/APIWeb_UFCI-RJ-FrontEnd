"use client";

import { useState } from "react";
import Link from "next/link";
import { useApi } from "../../hooks/useApi";
import CardAluguel from "../../components/CardAluguel";
import FiltroAluguel from "../../components/FiltroAluguel";
import { STATUS_ALUGUEL } from "../../constants/opcoes";

export default function Alugueis() {
  const [filtros, definirFiltros] = useState({
    status: "",
    id_usuario: "",
    id_jogo: "",
  });
  const [erroAcao, definirErroAcao] = useState("");
  const [acaoEmAndamento, definirAcaoEmAndamento] = useState(null);

  const parametros = new URLSearchParams();
  if (filtros.status) parametros.append("status", filtros.status);
  if (filtros.id_usuario) parametros.append("id_usuario", filtros.id_usuario);
  if (filtros.id_jogo) parametros.append("id_jogo", filtros.id_jogo);

  const endpoint = `/rentals?${parametros.toString()}`;
  const { data: respostaApi, loading, error, refetch, request } = useApi(endpoint);
  const alugueis = respostaApi?.data || [];

  function atualizarFiltro(campo, valor) {
    definirFiltros((anterior) => ({ ...anterior, [campo]: valor }));
  }

  async function alterarStatus(id, acao) {
    definirErroAcao("");
    definirAcaoEmAndamento(id);
    try {
      await request(`/rentals/${id}/${acao}`, { method: "PATCH" });
      await refetch();
    } catch (requestError) {
      definirErroAcao(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível atualizar o contrato.",
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
            <Link className="botao-novo" href="/alugueis/novo">
              Novo contrato
            </Link>
          </div>
          <h1 className="titulo-pagina">Contratos de aluguel</h1>
          <div className="linha-decorativa" />
        </header>

        <FiltroAluguel
          filtros={filtros}
          atualizarFiltro={atualizarFiltro}
        />

        <section className="conteudo-modulo">
          {error && <p className="mensagem-erro">{error}</p>}
          {erroAcao && <p className="mensagem-erro">{erroAcao}</p>}
          {loading && <p className="texto-vazio">Carregando contratos...</p>}
          {!loading && !error && alugueis.length === 0 && (
            <p className="texto-vazio">Nenhum contrato localizado.</p>
          )}

          <div className="grade-contratos">
            {alugueis.map((aluguel) => (
              <CardAluguel
                key={aluguel.id}
                aluguel={aluguel}
                carregando={acaoEmAndamento === aluguel.id}
                devolver={(id) => alterarStatus(id, "return")}
                cancelar={(id) => alterarStatus(id, "cancel")}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
