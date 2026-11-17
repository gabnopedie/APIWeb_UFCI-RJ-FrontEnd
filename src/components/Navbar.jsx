"use client";

import Link from "next/link";
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
  const autenticacao = useAuth();

  function sair() {
    autenticacao.sair();
    window.location.href = "/login";
  }

  return (
    <nav className="navbar-glass" aria-label="Navegação principal">
      <div className="navbar-links">
        {links.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.titulo}
          </Link>
        ))}
      </div>
      {autenticacao.token ? (
        <button className="botao-acao-vazado" type="button" onClick={sair}>
          Sair
        </button>
      ) : (
        <Link className="botao-acao-vazado" href="/login">
          Login
        </Link>
      )}
    </nav>
  );
}
