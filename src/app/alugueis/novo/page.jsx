"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useApi } from "../../../hooks/useApi";

export default function NovoAluguel() {
  const roteador = useRouter();
  const { request } = useApi("/rentals", { autoFetch: false });
  const [erro, definirErro] = useState("");
  const [enviando, definirEnviando] = useState(false);
  const [dados, definirDados] = useState({
    id_usuario: "",
    id_jogo: "",
    quantidade: 1,
    data_prevista_devolucao: "",
    local: false,
    observacoes: "",
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
      id_usuario: Number.parseInt(dados.id_usuario, 10),
      id_jogo: Number.parseInt(dados.id_jogo, 10),
      quantidade: Number.parseInt(dados.quantidade, 10),
      local: dados.local,
    };

    if (dados.data_prevista_devolucao) {
      cargaDeDados.data_prevista_devolucao = new Date(
        dados.data_prevista_devolucao,
      ).toISOString();
    }
    if (dados.observacoes) {
      cargaDeDados.observacoes = dados.observacoes;
    }

    definirEnviando(true);
    try {
      await request("/rentals", {
        method: "POST",
        body: JSON.stringify(cargaDeDados),
      });
      roteador.push("/alugueis");
    } catch (requestError) {
      definirErro(
        requestError instanceof Error
          ? requestError.message
          : "Falha ao registrar o contrato.",
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
            <Link className="link-voltar" href="/alugueis">
              &#8592; Cancelar operação
            </Link>
          </div>
          <h1 className="titulo-pagina">Formalizar contrato</h1>
          <div className="linha-decorativa" />
        </header>

        <section className="conteudo-modulo">
          <form
            className="formulario-glass"
            onSubmit={submeterFormulario}
          >
            <div className="linha-grade">
              <Input
                label="ID do cliente *"
                type="number"
                value={dados.id_usuario}
                onChange={(evento) =>
                  atualizarCampo("id_usuario", evento.target.value)
                }
                required
              />
              <Input
                label="ID do jogo *"
                type="number"
                value={dados.id_jogo}
                onChange={(evento) =>
                  atualizarCampo("id_jogo", evento.target.value)
                }
                required
              />
            </div>

            <div className="linha-grade">
              <Input
                label="Quantidade *"
                type="number"
                min="1"
                value={dados.quantidade}
                onChange={(evento) =>
                  atualizarCampo("quantidade", evento.target.value)
                }
                required
              />
              <Input
                label="Devolução prevista"
                type="date"
                value={dados.data_prevista_devolucao}
                onChange={(evento) =>
                  atualizarCampo(
                    "data_prevista_devolucao",
                    evento.target.value,
                  )
                }
              />
            </div>

            <label className="rotulo-checkbox">
              <input
                className="checkbox-padrao"
                type="checkbox"
                checked={dados.local}
                onChange={(evento) =>
                  atualizarCampo("local", evento.target.checked)
                }
              />
              Uso exclusivo nas dependências (local)
            </label>

            <div className="grupo-formulario">
              <label className="rotulo-padrao" htmlFor="observacoes">
                Observações do contrato
              </label>
              <textarea
                className="input-padrao area-texto"
                id="observacoes"
                maxLength={5000}
                value={dados.observacoes}
                onChange={(evento) =>
                  atualizarCampo("observacoes", evento.target.value)
                }
              />
            </div>

            {erro && <p className="mensagem-erro">{erro}</p>}
            <Button type="submit" disabled={enviando}>
              {enviando ? "Emitindo contrato..." : "Emitir contrato"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
