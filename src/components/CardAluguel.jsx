import Link from "next/link";
import { OPCOES_STATUS_ALUGUEL, STATUS_ALUGUEL } from "../constants/opcoes";

export default function CardAluguel({
  aluguel,
  devolver,
  cancelar,
  carregando,
}) {
  const opcaoStatus = OPCOES_STATUS_ALUGUEL.find(
    (opcao) => opcao.valor === aluguel.status,
  );

  return (
    <article className="cartao-glass">
      <div className="cabecalho-cartao">
        <span className="numero-contrato">Lote nº {aluguel.id}</span>
        <span className="etiqueta-status" data-status={aluguel.status}>
          {opcaoStatus?.rotulo ?? String(aluguel.status).toLowerCase()}
        </span>
      </div>
      <h2 className="nome-jogo">Acervo: {aluguel.id_jogo}</h2>
      <p className="detalhe-texto">Cliente: {aluguel.id_usuario}</p>
      <p className="detalhe-texto">Peças: {aluguel.quantidade}</p>
      <p className="detalhe-texto">
        Devolução:{" "}
        {aluguel.data_prevista_devolucao
          ? new Date(aluguel.data_prevista_devolucao).toLocaleDateString(
              "pt-BR",
            )
          : "-"}
      </p>

      {aluguel.status === STATUS_ALUGUEL.ATIVO && (
        <div className="acoes-cartao">
          <button
            className="botao-acao"
            type="button"
            disabled={carregando}
            onClick={() => devolver(aluguel.id)}
          >
            Devolver
          </button>
          <button
            className="botao-acao-vazado"
            type="button"
            disabled={carregando}
            onClick={() => cancelar(aluguel.id)}
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
  );
}
