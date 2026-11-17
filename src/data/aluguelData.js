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
  const numero = Number(valor || 0);
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function mapearAluguelParaTela(item) {
  const aluguel = item || {};
  const jogo = aluguel.jogo || {};
  const cliente = aluguel.usuario || aluguel.cliente || {};

  return {
    id: aluguel.id,
    jogoNome: jogo.nome || aluguel.jogoNome || aluguel.id_jogo || "-",
    clienteNome:
      cliente.nome || aluguel.clienteNome || aluguel.id_usuario || "-",
    dataInicioFormatada: formatarData(
      aluguel.data_inicio || aluguel.dataInicio,
    ),
    dataFimFormatada: formatarData(
      aluguel.data_prevista_devolucao || aluguel.data_fim || aluguel.dataFim,
    ),
    valorTotalFormatado: formatarValor(
      aluguel.valor_total || aluguel.valorTotal || aluguel.valor,
    ),
    status: aluguel.status || "PENDENTE",
    quantidade: aluguel.quantidade || 0,
    dadosOriginais: aluguel,
  };
}

export function mapearAluguelParaApi(dadosForm) {
  const carga = { ...dadosForm };
  if (carga.id_usuario !== undefined) {
    carga.id_usuario = Number(carga.id_usuario);
  }
  if (carga.id_jogo !== undefined) {
    carga.id_jogo = Number(carga.id_jogo);
  }
  if (carga.quantidade !== undefined) {
    carga.quantidade = Number(carga.quantidade);
  }
  if (carga.data_prevista_devolucao) {
    carga.data_prevista_devolucao = new Date(
      carga.data_prevista_devolucao,
    ).toISOString();
  }
  return carga;
}
