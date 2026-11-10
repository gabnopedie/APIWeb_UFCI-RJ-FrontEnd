"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import { useApi } from "../../../../hooks/useApi";
import { AcaoAluguel } from "../../../../constants/enums";

export default function EstenderAluguel({ params }) {
  const { id } = use(params);
  const roteador = useRouter();
  const { request } = useApi(`/rentals/${id}/${AcaoAluguel.PRORROGAR}`, {
    autoFetch: false,
  });
  const [dias, definirDias] = useState(7);
  const [erro, definirErro] = useState("");
  const [enviando, definirEnviando] = useState(false);

  async function submeterFormulario(evento) {
    evento.preventDefault();
    definirErro("");

    if (!window.localStorage.getItem("token_ufci")) {
      roteador.push("/login");
      return;
    }

    definirEnviando(true);
    try {
      await request(`/rentals/${id}/${AcaoAluguel.PRORROGAR}`, {
        method: "PATCH",
        body: JSON.stringify({ dias: Number.parseInt(dias, 10) }),
      });
      roteador.push("/alugueis");
    } catch (requestError) {
      definirErro(
        requestError instanceof Error
          ? requestError.message
          : "Falha ao prorrogar o prazo.",
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
              &#8592; Cancelar
            </Link>
          </div>
          <h1 className="titulo-pagina">Prorrogar contrato nº {id}</h1>
          <div className="linha-decorativa" />
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
