export const STATUS_ALUGUEL = {
  ATIVO: "ATIVO",
  CONCLUIDO: "CONCLUIDO",
  ATRASADO: "ATRASADO",
  CANCELADO: "CANCELADO",
};

export const OPCOES_STATUS_ALUGUEL = [
  { valor: STATUS_ALUGUEL.ATIVO, rotulo: "Ativo" },
  { valor: STATUS_ALUGUEL.CONCLUIDO, rotulo: "Concluído" },
  { valor: STATUS_ALUGUEL.ATRASADO, rotulo: "Atrasado" },
  { valor: STATUS_ALUGUEL.CANCELADO, rotulo: "Cancelado" },
];

export const STATUS_PAGAMENTO = {
  PENDENTE: "PENDENTE",
  PAGO: "PAGO",
  ESTORNADO: "ESTORNADO",
};

export const OPCOES_STATUS_PAGAMENTO = [
  { valor: STATUS_PAGAMENTO.PENDENTE, rotulo: "Pendente" },
  { valor: STATUS_PAGAMENTO.PAGO, rotulo: "Pago" },
  { valor: STATUS_PAGAMENTO.ESTORNADO, rotulo: "Estornado" },
];

export const FORMAS_PAGAMENTO = {
  PIX: "PIX",
  CARTAO_CREDITO: "CARTAO_CREDITO",
  CARTAO_DEBITO: "CARTAO_DEBITO",
  DINHEIRO: "DINHEIRO",
};

export const OPCOES_FORMA_PAGAMENTO = [
  { valor: FORMAS_PAGAMENTO.PIX, rotulo: "Pix" },
  { valor: FORMAS_PAGAMENTO.CARTAO_CREDITO, rotulo: "Cartão de crédito" },
  { valor: FORMAS_PAGAMENTO.CARTAO_DEBITO, rotulo: "Cartão de débito" },
  { valor: FORMAS_PAGAMENTO.DINHEIRO, rotulo: "Dinheiro" },
];
