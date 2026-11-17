import Link from "next/link";
import StatusBadge from "./StatusBadge";

export default function CardAluguel({ aluguel, aoExcluir }) {
  return (
    <article className="cartao-glass">
      <div className="cabecalho-cartao">
        <span className="numero-contrato">Aluguel nº {aluguel.id}</span>
        <StatusBadge status={aluguel.status} tipo="aluguel" />
      </div>
      <h2 className="nome-jogo">{aluguel.jogoNome}</h2>
      <p className="detalhe-texto">Cliente: {aluguel.clienteNome}</p>
      <p className="detalhe-texto">
        Período: {aluguel.dataInicioFormatada} até {aluguel.dataFimFormatada}
      </p>
      <p className="detalhe-texto">Valor: {aluguel.valorTotalFormatado}</p>
      <p className="detalhe-texto">Quantidade: {aluguel.quantidade}</p>
      <div className="acoes-cartao">
        <Link
          className="botao-acao-dourado"
          href={`/alugueis/${aluguel.id}/estender`}
        >
          Prorrogar
        </Link>
        <button className="botao-acao-vazado" type="button" onClick={aoExcluir}>
          Excluir
        </button>
      </div>
    </article>
  );
}
