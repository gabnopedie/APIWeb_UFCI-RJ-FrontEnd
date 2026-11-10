"use client";

import { useState } from "react";
import Link from "next/link";
import { useApi } from "../../hooks/useApi";
import Input from "../../components/Input";
import {
  AcaoAluguel,
  StatusAluguel,
  StatusAluguelLabel,
} from "../../constants/enums";

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

        <section className="area-filtros-glass filtros-alugueis" aria-label="Filtros de contratos">
          <select
            className="entrada-filtro"
            aria-label="Filtrar por status"
            value={filtros.status}
            onChange={(evento) => atualizarFiltro("status", evento.target.value)}
          >
            <option value="">Todos os status</option>
            {Object.values(StatusAluguel).map((status) => (
              <option key={status} value={status}>
                {StatusAluguelLabel[status]}
              </option>
            ))}
          </select>
          <Input
            type="number"
            placeholder="ID do cliente"
            value={filtros.id_usuario}
            onChange={(evento) =>
              atualizarFiltro("id_usuario", evento.target.value)
            }
          />
          <Input
            type="number"
            placeholder="ID do jogo"
            value={filtros.id_jogo}
            onChange={(evento) =>
              atualizarFiltro("id_jogo", evento.target.value)
            }
          />
        </section>

        <section className="conteudo-modulo">
          {error && <p className="mensagem-erro">{error}</p>}
          {erroAcao && <p className="mensagem-erro">{erroAcao}</p>}
          {loading && <p className="texto-vazio">Carregando contratos...</p>}
          {!loading && !error && alugueis.length === 0 && (
            <p className="texto-vazio">Nenhum contrato localizado.</p>
          )}

          <div className="grade-contratos">
            {alugueis.map((aluguel) => (
              <article className="cartao-glass" key={aluguel.id}>
                <div className="cabecalho-cartao">
                  <span className="numero-contrato">Lote nº {aluguel.id}</span>
                  <span
                    className="etiqueta-status"
                    data-status={aluguel.status}
                  >
                    {StatusAluguelLabel[aluguel.status] ??
                      String(aluguel.status).toLowerCase()}
                  </span>
                </div>
                <h2 className="nome-jogo">Acervo: {aluguel.id_jogo}</h2>
                <p className="detalhe-texto">Cliente: {aluguel.id_usuario}</p>
                <p className="detalhe-texto">Peças: {aluguel.quantidade}</p>
                <p className="detalhe-texto">
                  Devolução:{" "}
                  {aluguel.data_prevista_devolucao
                    ? new Date(
                        aluguel.data_prevista_devolucao,
                      ).toLocaleDateString("pt-BR")
                    : "-"}
                </p>

                {aluguel.status === StatusAluguel.ATIVO && (
                  <div className="acoes-cartao">
                    <button
                      className="botao-acao"
                      type="button"
                      disabled={acaoEmAndamento === aluguel.id}
                      onClick={() =>
                        alterarStatus(aluguel.id, AcaoAluguel.DEVOLVER)
                      }
                    >
                      Devolver
                    </button>
                    <button
                      className="botao-acao-vazado"
                      type="button"
                      disabled={acaoEmAndamento === aluguel.id}
                      onClick={() =>
                        alterarStatus(aluguel.id, AcaoAluguel.CANCELAR)
                      }
                    >
                      Cancelar
                    </button>
                    <Link
                      className="botao-acao-dourado"
                      href={`/alugueis/${aluguel.id}/estender`}
                    >
                      Prorrogar
                    </Link>
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
