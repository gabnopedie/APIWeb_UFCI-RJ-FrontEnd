"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import { estenderAluguel } from "../../../../services/aluguelService";

export default function EstenderAluguel({ params }) {
  const { id } = use(params);
  const roteador = useRouter();
  const [dias, definirDias] = useState(7);
  const [erro, definirErro] = useState("");
  const [enviando, definirEnviando] = useState(false);

  function validarFormulario() {
    const quantidadeDias = Number(dias);
    if (!dias || Number.isNaN(quantidadeDias)) {
      return "Informe a quantidade de dias adicionais.";
    }
    if (quantidadeDias <= 0 || quantidadeDias > 90) {
      return "A prorrogação deve ser de 1 a 90 dias.";
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
      await estenderAluguel(id, { dias: Number(dias) });
      roteador.push("/alugueis");
    } catch (erroApi) {
      const status = erroApi.response?.status;
      definirErro(
        status
          ? `A API retornou erro ${status}: ${
              erroApi.response.data?.message || erroApi.message
            }`
          : erroApi.message || "Falha ao prorrogar o prazo.",
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
              &#8592; Cancelar
            </Link>
            <h1 className="titulo-pagina">Prorrogar contrato nº {id}</h1>
          </div>
        </header>

        <section className="conteudo-modulo">
          <form
            className="formulario-glass formulario-estender"
            onSubmit={submeterFormulario}
          >
            <Input
              label="Dias adicionais (1 a 90) *"
              type="number"
              min="1"
              max="90"
              value={dias}
              onChange={(evento) => definirDias(evento.target.value)}
              required
            />

            {erro && <p className="mensagem-erro">{erro}</p>}
            <Button type="submit" disabled={enviando}>
              {enviando ? "Enviando solicitação..." : "Confirmar prorrogação"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
