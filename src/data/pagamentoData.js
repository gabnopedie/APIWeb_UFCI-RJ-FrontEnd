function formatarData(valor) {
  if (!valor) {
    return "-";
  }
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) {
    return "-";
  }
  return data.toLocaleDateString("pt-BR");
}

function formatarValor(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function mapearPagamentoParaTela(item) {
  const pagamento = item || {};
  return {
    id: pagamento.id,
    aluguelId: pagamento.id_aluguel || pagamento.aluguelId,
    valorFormatado: formatarValor(pagamento.valor),
    metodo:
      pagamento.forma_pagamento || pagamento.metodo || pagamento.metodo_pagamento || "-",
    status: pagamento.status || "PENDENTE",
    dataPagamentoFormatada: formatarData(
      pagamento.data_pagamento || pagamento.dataPagamento,
    ),
    dadosOriginais: pagamento,
  };
}

export function mapearPagamentoParaApi(dadosForm) {
  const carga = { ...dadosForm };
  if (carga.id_aluguel !== undefined) {
    carga.id_aluguel = Number(carga.id_aluguel);
  }
  if (carga.valor !== undefined) {
    carga.valor = Number(carga.valor);
  }
  return carga;
}
