import {
  OPCOES_FORMA_PAGAMENTO,
  OPCOES_STATUS_PAGAMENTO,
  STATUS_PAGAMENTO,
} from "../constants/opcoes";

export default function CardPagamento({
  pagamento,
  confirmar,
  estornar,
  carregando,
}) {
  const opcaoStatus = OPCOES_STATUS_PAGAMENTO.find(
    (opcao) => opcao.valor === pagamento.status,
  );
  const opcaoForma = OPCOES_FORMA_PAGAMENTO.find(
    (opcao) => opcao.valor === pagamento.forma_pagamento,
  );

  return (
    <article className="cartao-glass">
      <div className="cabecalho-cartao">
        <span className="numero-contrato">Recibo nº {pagamento.id}</span>
        <span className="etiqueta-status" data-status={pagamento.status}>
          {opcaoStatus?.rotulo ?? String(pagamento.status).toLowerCase()}
        </span>
      </div>
      <h2 className="nome-jogo">R$ {Number(pagamento.valor).toFixed(2)}</h2>
      <p className="detalhe-texto">Contrato origem: {pagamento.id_aluguel}</p>
      <p className="detalhe-texto">
        Método:{" "}
        {opcaoForma?.rotulo ?? String(pagamento.forma_pagamento).toLowerCase()}
      </p>

      {pagamento.status === STATUS_PAGAMENTO.PENDENTE && (
        <div className="acoes-cartao">
          <button
            className="botao-acao"
            type="button"
            disabled={carregando}
            onClick={() => confirmar(pagamento.id)}
          >
            Confirmar
          </button>
          <button
            className="botao-acao-vazado"
            type="button"
            disabled={carregando}
            onClick={() => estornar(pagamento.id)}
          >
            Estornar
          </button>
        </div>
      )}
      {pagamento.status === STATUS_PAGAMENTO.PAGO && (
        <div className="acoes-cartao">
          <button
            className="botao-acao-vazado"
            type="button"
            disabled={carregando}
            onClick={() => estornar(pagamento.id)}
          >
            Estornar
          </button>
        </div>
      )}
    </article>
  );
}
