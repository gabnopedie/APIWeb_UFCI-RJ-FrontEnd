export const StatusAluguel = Object.freeze({
  ATIVO: "ATIVO",
  CONCLUIDO: "CONCLUIDO",
  ATRASADO: "ATRASADO",
  CANCELADO: "CANCELADO",
});

export const StatusAluguelLabel = Object.freeze({
  [StatusAluguel.ATIVO]: "Ativo",
  [StatusAluguel.CONCLUIDO]: "Concluído",
  [StatusAluguel.ATRASADO]: "Atrasado",
  [StatusAluguel.CANCELADO]: "Cancelado",
});

export const AcaoAluguel = Object.freeze({
  DEVOLVER: "return",
  CANCELAR: "cancel",
  PRORROGAR: "extend",
});

export const StatusPagamento = Object.freeze({
  PENDENTE: "PENDENTE",
  PAGO: "PAGO",
  ESTORNADO: "ESTORNADO",
});

export const StatusPagamentoLabel = Object.freeze({
  [StatusPagamento.PENDENTE]: "Pendente",
  [StatusPagamento.PAGO]: "Pago",
  [StatusPagamento.ESTORNADO]: "Estornado",
});

export const FormaPagamento = Object.freeze({
  PIX: "PIX",
  CARTAO_CREDITO: "CARTAO_CREDITO",
  CARTAO_DEBITO: "CARTAO_DEBITO",
  DINHEIRO: "DINHEIRO",
});

export const FormaPagamentoLabel = Object.freeze({
  [FormaPagamento.PIX]: "Pix",
  [FormaPagamento.CARTAO_CREDITO]: "Cartão de crédito",
  [FormaPagamento.CARTAO_DEBITO]: "Cartão de débito",
  [FormaPagamento.DINHEIRO]: "Dinheiro",
});

export const AcaoPagamento = Object.freeze({
  CONFIRMAR: "confirm",
  ESTORNAR: "refund",
});
