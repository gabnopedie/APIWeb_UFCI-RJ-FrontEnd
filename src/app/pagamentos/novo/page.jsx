"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import {
  FORMAS_PAGAMENTO,
  OPCOES_FORMA_PAGAMENTO,
} from "../../../constants/opcoes";
import { criarPagamento } from "../../../services/pagamentoService";

export default function NovoPagamento() {
  const roteador = useRouter();
  const [erro, definirErro] = useState("");
  const [enviando, definirEnviando] = useState(false);
  const [dados, definirDados] = useState({
    id_aluguel: "",
    valor: "",
    forma_pagamento: FORMAS_PAGAMENTO.PIX,
  });

  function atualizarCampo(campo, valor) {
    definirDados((anteriores) => ({ ...anteriores, [campo]: valor }));
  }

  function validarFormulario() {
    if (!dados.id_aluguel || !dados.valor || !dados.forma_pagamento) {
      return "Preencha todos os campos obrigatórios.";
    }
    if (Number(dados.id_aluguel) <= 0) {
      return "O ID do aluguel deve ser maior que zero.";
    }
    if (Number(dados.valor) <= 0 || Number.isNaN(Number(dados.valor))) {
      return "O valor do pagamento deve ser maior que zero.";
    }
    return "";
  }

  async function submeterFormulario(evento) {
    evento.preventDefault();
    const mensagemValidacao = validarFormulario();
    definirErro(mensagemValidacao);
    if (mensagemValidacao) {
      return;
    }

    definirEnviando(true);
    try {
      await criarPagamento(dados);
      roteador.push("/pagamentos");
    } catch (erroApi) {
      const status = erroApi.response?.status;
      definirErro(
        status
          ? `A API retornou erro ${status}: ${
              erroApi.response.data?.message || erroApi.message
            }`
          : erroApi.message || "Falha ao registrar o pagamento.",
      );
    } finally {
      definirEnviando(false);
    }
  }

  return (
    <main className="recipiente">
      <div className="sobreposicao-conteudo">
        <header className="cabecalho-glass cabecalho-modulo">
          <div className="textos-cabecalho-modulo">
            <Link className="link-voltar" href="/pagamentos">
              &#8592; Cancelar
            </Link>
            <h1 className="titulo-pagina">Lançamento financeiro</h1>
          </div>
        </header>

        <section className="conteudo-modulo">
          <form className="formulario-glass" onSubmit={submeterFormulario}>
            <Input
              label="Nº do contrato (ID do aluguel) *"
              type="number"
              min="1"
              value={dados.id_aluguel}
              onChange={(evento) =>
                atualizarCampo("id_aluguel", evento.target.value)
              }
              required
            />

            <Input
              label="Valor do pagamento (R$) *"
              type="number"
              min="0.01"
              step="0.01"
              value={dados.valor}
              onChange={(evento) => atualizarCampo("valor", evento.target.value)}
              required
            />

            <div className="grupo-formulario">
              <label className="rotulo-padrao" htmlFor="forma-pagamento">
                Forma de pagamento *
              </label>
              <select
                className="input-padrao"
                id="forma-pagamento"
                value={dados.forma_pagamento}
                onChange={(evento) =>
                  atualizarCampo("forma_pagamento", evento.target.value)
                }
                required
              >
                {OPCOES_FORMA_PAGAMENTO.map((opcao) => (
                  <option key={opcao.valor} value={opcao.valor}>
                    {opcao.rotulo}
                  </option>
                ))}
              </select>
            </div>

            {erro && <p className="mensagem-erro">{erro}</p>}
            <Button type="submit" disabled={enviando}>
              {enviando ? "Processando pagamento..." : "Processar pagamento"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
