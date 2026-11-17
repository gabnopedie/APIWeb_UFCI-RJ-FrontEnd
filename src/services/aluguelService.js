import api from "@/lib/api";
import {
  mapearAluguelParaApi,
  mapearAluguelParaTela,
} from "@/data/aluguelData";

function mapearResposta(resposta) {
  const dados = resposta.data?.data ?? resposta.data;
  return Array.isArray(dados) ? dados.map(mapearAluguelParaTela) : mapearAluguelParaTela(dados);
}

export async function listarAlugueis(filtros = {}) {
  const resposta = await api.get("/rentals", { params: filtros });
  const dados = resposta.data?.data ?? resposta.data;
  return Array.isArray(dados) ? dados.map(mapearAluguelParaTela) : [];
}

export async function buscarAluguelPorId(id) {
  const resposta = await api.get(`/rentals/${id}`);
  return mapearResposta(resposta);
}

export async function criarAluguel(dados) {
  const resposta = await api.post("/rentals", mapearAluguelParaApi(dados));
  return mapearResposta(resposta);
}

export async function estenderAluguel(id, dados) {
  const resposta = await api.patch(
    `/rentals/${id}/extend`,
    mapearAluguelParaApi(dados),
  );
  return mapearResposta(resposta);
}

export async function excluirAluguel(id) {
  return api.delete(`/rentals/${id}`);
}
