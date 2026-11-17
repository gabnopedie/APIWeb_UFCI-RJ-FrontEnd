import api from "@/lib/api";
import {
  mapearPagamentoParaApi,
  mapearPagamentoParaTela,
} from "@/data/pagamentoData";

function mapearResposta(resposta) {
  const dados = resposta.data?.data ?? resposta.data;
  return Array.isArray(dados)
    ? dados.map(mapearPagamentoParaTela)
    : mapearPagamentoParaTela(dados);
}

export async function listarPagamentos(filtros = {}) {
  const resposta = await api.get("/payments", { params: filtros });
  const dados = resposta.data?.data ?? resposta.data;
  return Array.isArray(dados) ? dados.map(mapearPagamentoParaTela) : [];
}

export async function criarPagamento(dados) {
  const resposta = await api.post("/payments", mapearPagamentoParaApi(dados));
  return mapearResposta(resposta);
}

export async function atualizarStatusPagamento(id, status) {
  const acao = status === "PAGO" ? "confirm" : "refund";
  const resposta = await api.patch(`/payments/${id}/${acao}`);
  return mapearResposta(resposta);
}

export async function excluirPagamento(id) {
  return api.delete(`/payments/${id}`);
}
