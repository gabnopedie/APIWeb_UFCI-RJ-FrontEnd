import Link from "next/link";
import { modulos } from "../constants/modulos";

export default function PaginaInicial() {
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
