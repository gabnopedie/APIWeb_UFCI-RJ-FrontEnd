"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useApi } from "../../../hooks/useApi";
import {
  FormaPagamento,
  FormaPagamentoLabel,
} from "../../../constants/enums";

export default function NovoPagamento() {
  const roteador = useRouter();
  const { request } = useApi("/payments", { autoFetch: false });
  const [erro, definirErro] = useState("");
  const [enviando, definirEnviando] = useState(false);
  const [dados, definirDados] = useState({
    id_aluguel: "",
    valor: "",
    forma_pagamento: FormaPagamento.PIX,
  });

  function atualizarCampo(campo, valor) {
    definirDados((anteriores) => ({ ...anteriores, [campo]: valor }));
  }

  async function submeterFormulario(evento) {
    evento.preventDefault();
    definirErro("");

    if (!window.localStorage.getItem("token_ufci")) {
      roteador.push("/login");
      return;
    }

    const cargaDeDados = {
      id_aluguel: Number.parseInt(dados.id_aluguel, 10),
      valor: Number.parseFloat(dados.valor),
      forma_pagamento: dados.forma_pagamento,
    };

    definirEnviando(true);
    try {
      await request("/payments", {
        method: "POST",
        body: JSON.stringify(cargaDeDados),
      });
      roteador.push("/pagamentos");
    } catch (requestError) {
      definirErro(
        requestError instanceof Error
          ? requestError.message
          : "Falha ao registrar o pagamento.",
      );
    } finally {
      definirEnviando(false);
    }
  }

  return (
    <main className="recipiente">
      <div className="sobreposicao-conteudo">
        <header className="cabecalho-glass cabecalho-modulo">
          <div className="linha-topo">
            <Link className="link-voltar" href="/pagamentos">
              &#8592; Cancelar
            </Link>
          </div>
          <h1 className="titulo-pagina">Lançamento financeiro</h1>
          <div className="linha-decorativa" />
        </header>

        <section className="conteudo-modulo">
          <form
            className="formulario-glass"
            onSubmit={submeterFormulario}
          >
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
                {Object.values(FormaPagamento).map((forma) => (
                  <option key={forma} value={forma}>
                    {FormaPagamentoLabel[forma]}
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
