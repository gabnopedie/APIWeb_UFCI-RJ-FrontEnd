"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { href: "/", titulo: "Início" },
  { href: "/jogos", titulo: "Jogos" },
  { href: "/categorias", titulo: "Categorias" },
  { href: "/usuarios", titulo: "Usuários" },
  { href: "/alugueis", titulo: "Aluguéis" },
  { href: "/pagamentos", titulo: "Pagamentos" },
  { href: "/reviews", titulo: "Avaliações" },
];

export default function Navbar() {
  const pathname = usePathname();
  const autenticacao = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  function sair() {
    autenticacao.sair();
    window.location.href = "/login";
  }

  if (pathname === "/") {
    return null;
  }

  return (
    <nav
      className="navbar-glass navbar-interna"
      aria-label="Navegação principal"
    >
      <div
        className={`navbar-links${menuAberto ? " navbar-links-aberto" : ""}`}
        id="navbar-links"
      >
        {links.map((link) => {
          const ativo =
            pathname === link.href ||
            (link.href !== "/" && pathname?.startsWith(`${link.href}/`));

          return (
            <Link
              href={link.href}
              key={link.href}
              className={ativo ? "navbar-link-ativo" : undefined}
              aria-current={ativo ? "page" : undefined}
              onClick={() => setMenuAberto(false)}
            >
              {link.titulo}
            </Link>
          );
        })}
      </div>
      <div className="navbar-auth">
        {autenticacao.token ? (
          <button className="botao-acao-vazado" type="button" onClick={sair}>
            Sair
          </button>
        ) : (
          <Link className="botao-acao-vazado" href="/login">
            Login
          </Link>
        )}
      </div>
      <button
        className="navbar-menu-toggle botao-acao-vazado"
        type="button"
        aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuAberto}
        aria-controls="navbar-links"
        onClick={() => setMenuAberto((aberto) => !aberto)}
      >
        {menuAberto ? "✕" : "☰"}
      </button>
    </nav>
  );
}
