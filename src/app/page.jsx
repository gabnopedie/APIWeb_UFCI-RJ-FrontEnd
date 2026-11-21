"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { modulos } from "../constants/modulos";

export default function PaginaInicial() {
  const autenticacao = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  function sair() {
    autenticacao.sair();
    window.location.href = "/login";
  }

  return (
    <main className="pagina-inicial">
      <div className="sobreposicao-conteudo">
        <header
          className="cabecalho-glass cabecalho-inicial"
          onKeyDown={(evento) => {
            if (evento.key === "Escape") setMenuAberto(false);
          }}
        >
          <button
            className="menu-modulos-toggle botao-acao-vazado"
            type="button"
            aria-label={menuAberto ? "Fechar menu principal" : "Abrir menu principal"}
            aria-expanded={menuAberto}
            aria-controls="menu-modulos-inicial"
            onClick={() => setMenuAberto((aberto) => !aberto)}
          >
            Menu
          </button>
          <div className="textos-iniciais">
            <span className="subtitulo-marca">Programação WeB | UFCI - RJ</span>
            <h1 className="titulo-marca">
              Sistema de Aluguel de Jogos de Tabuleiro
            </h1>
          </div>
          {autenticacao.token ? (
            <button
              className="acesso-usuario-home botao-acao-vazado"
              type="button"
              title="Sair"
              aria-label="Sair da conta"
              onClick={sair}
            >
              <span>Sair</span>
            </button>
          ) : (
            <Link
              className="acesso-usuario-home botao-acao-vazado"
              href="/login"
              title="Entrar"
              aria-label="Fazer login"
            >
              <span>Login</span>
            </Link>
          )}

          <nav
            className="menu-modulos-dropdown"
            id="menu-modulos-inicial"
            aria-label="Módulos do sistema"
            hidden={!menuAberto}
          >
            {modulos.map((modulo) => (
              <Link
                href={modulo.href}
                key={modulo.href}
                onClick={() => setMenuAberto(false)}
              >
                {modulo.titulo}
              </Link>
            ))}
          </nav>
        </header>
      </div>
    </main>
  );
}
