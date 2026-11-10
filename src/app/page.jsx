import Link from "next/link";

const modulos = [
  {
    href: "/categorias",
    titulo: "Categorias",
    descricao: "Classificação",
  },
  {
    href: "/jogos",
    titulo: "Jogos do acervo",
    descricao: "Catálogo",
  },
  {
    href: "/usuarios",
    titulo: "Usuários",
    descricao: "Membros registrados",
  },
  {
    href: "/alugueis",
    titulo: "Aluguéis",
    descricao: "Contratos ativos",
  },
  {
    href: "/pagamentos",
    titulo: "Pagamentos",
    descricao: "Gestão financeira",
  },
  {
    href: "/reviews",
    titulo: "Avaliações",
    descricao: "Opiniões da comunidade",
  },
];

export default function PaginaInicial() {
  return (
    <main className="pagina-inicial">
      <div className="sobreposicao-conteudo">
        <header className="cabecalho-glass cabecalho-inicial">
          <h1 className="titulo-marca">
            Sistema de aluguel de jogos de tabuleiro
          </h1>
          <span className="subtitulo-marca">Programação web | UFCI - RJ</span>
          <p className="descricao-inicial">
            Painel de controle e catalogação
          </p>
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
