"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { modulos } from "../constants/modulos";

export default function PaginaInicial() {
  const autenticacao = useAuth();

  function sair() {
    autenticacao.sair();
    window.location.href = "/login";
  }

  const iconeUsuario = (
    <svg
      className="icone-usuario-home"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.6-3.5 3.2-5.5 7-5.5s6.4 2 7 5.5" />
    </svg>
  );

  return (
    <main className="pagina-inicial">
      <div className="sobreposicao-conteudo">
        <header className="cabecalho-glass cabecalho-inicial">
          <div className="textos-iniciais">
            <span className="subtitulo-marca">Programação Web | UFCI - RJ</span>
            <h1 className="titulo-marca">
              Sistema de Aluguel de Jogos de Tabuleiro
            </h1>
            <p className="descricao-inicial">
              Painel de controle e catalogação
            </p>
          </div>
          {autenticacao.token ? (
            <button
              className="acesso-usuario-home botao-acao-vazado"
              type="button"
              title="Sair"
              aria-label="Sair da conta"
              onClick={sair}
            >
              {iconeUsuario}
              <span>Sair</span>
            </button>
          ) : (
            <Link
              className="acesso-usuario-home botao-acao-vazado"
              href="/login"
              title="Entrar"
              aria-label="Fazer login"
            >
              {iconeUsuario}
            </Link>
          )}
        </header>

        <nav className="grade-modulos" aria-label="Módulos do sistema">
          {modulos.map((modulo) => (
            <Link
              className="cartao-glass cartao-modulo"
              href={modulo.href}
              key={modulo.href}
            >
              <span>
                <span className="titulo-cartao-modulo">{modulo.titulo}</span>
                <span className="subtitulo-cartao-modulo">
                  {modulo.descricao}
                </span>
              </span>
              <span className="seta-dourada" aria-hidden="true">
                &#10132;
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
