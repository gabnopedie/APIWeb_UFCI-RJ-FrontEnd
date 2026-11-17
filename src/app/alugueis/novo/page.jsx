"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { criarAluguel } from "../../../services/aluguelService";

function dataHoje() {
  const data = new Date();
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export default function NovoAluguel() {
  const roteador = useRouter();
  const [erro, definirErro] = useState("");
  const [enviando, definirEnviando] = useState(false);
  const [dados, definirDados] = useState({
    id_usuario: "",
    id_jogo: "",
    quantidade: 1,
    data_inicio: dataHoje(),
    data_prevista_devolucao: "",
    local: false,
    observacoes: "",
  });

  function atualizarCampo(campo, valor) {
    definirDados((anteriores) => ({ ...anteriores, [campo]: valor }));
  }

  function validarFormulario() {
    if (!dados.id_usuario || !dados.id_jogo || !dados.quantidade) {
      return "Preencha todos os campos obrigatórios.";
    }
    if (
      Number(dados.id_usuario) <= 0 ||
      Number(dados.id_jogo) <= 0 ||
      Number(dados.quantidade) <= 0
    ) {
      return "IDs e quantidade devem ser maiores que zero.";
    }
    const dataInicio = new Date(`${dados.data_inicio}T00:00:00`);
    const dataFim = new Date(`${dados.data_prevista_devolucao}T00:00:00`);
    if (
      Number.isNaN(dataInicio.getTime()) ||
      Number.isNaN(dataFim.getTime())
    ) {
      return "Informe datas válidas para o aluguel.";
    }
    if (dataFim < dataInicio) {
      return "A data final não pode ser anterior à data inicial.";
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
      await criarAluguel({
        ...dados,
        data_inicio: new Date(`${dados.data_inicio}T00:00:00`).toISOString(),
        data_prevista_devolucao: new Date(
          `${dados.data_prevista_devolucao}T00:00:00`,
        ).toISOString(),
      });
      roteador.push("/alugueis");
    } catch (erroApi) {
      const status = erroApi.response?.status;
      definirErro(
        status
          ? `A API retornou erro ${status}: ${
              erroApi.response.data?.message || erroApi.message
            }`
          : erroApi.message || "Falha ao registrar o contrato.",
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
            <Link className="link-voltar" href="/alugueis">
              &#8592; Cancelar operação
            </Link>
            <h1 className="titulo-pagina">Formalizar contrato</h1>
          </div>
        </header>

        <section className="conteudo-modulo">
          <form className="formulario-glass" onSubmit={submeterFormulario}>
            <div className="linha-grade">
              <Input
                label="ID do cliente *"
                type="number"
                min="1"
                value={dados.id_usuario}
                onChange={(evento) =>
                  atualizarCampo("id_usuario", evento.target.value)
                }
                required
              />
              <Input
                label="ID do jogo *"
                type="number"
                min="1"
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
                label="Data de início *"
                type="date"
                value={dados.data_inicio}
                onChange={(evento) =>
                  atualizarCampo("data_inicio", evento.target.value)
                }
                required
              />
            </div>

            <Input
              label="Devolução prevista *"
              type="date"
              value={dados.data_prevista_devolucao}
              onChange={(evento) =>
                atualizarCampo("data_prevista_devolucao", evento.target.value)
              }
              required
            />

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
