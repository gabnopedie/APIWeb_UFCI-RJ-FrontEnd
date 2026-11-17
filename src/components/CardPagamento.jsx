import StatusBadge from "./StatusBadge";

export default function CardPagamento({ pagamento, aoExcluir }) {
  return (
    <article className="cartao-glass">
      <div className="cabecalho-cartao">
        <span className="numero-contrato">Pagamento nº {pagamento.id}</span>
        <StatusBadge status={pagamento.status} tipo="pagamento" />
      </div>
      <h2 className="nome-jogo">{pagamento.valorFormatado}</h2>
      <p className="detalhe-texto">Aluguel: {pagamento.aluguelId}</p>
      <p className="detalhe-texto">Método: {pagamento.metodo}</p>
      <p className="detalhe-texto">
        Data do pagamento: {pagamento.dataPagamentoFormatada}
      </p>
      <div className="acoes-cartao">
        <button className="botao-acao-vazado" type="button" onClick={aoExcluir}>
          Excluir
        </button>
      </div>
    </article>
  );
}
