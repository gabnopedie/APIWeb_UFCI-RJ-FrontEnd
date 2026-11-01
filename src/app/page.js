import Link from 'next/link';

export default function PaginaInicial() {
  return (
    <main style={estilos.recipiente}>
      <div style={estilos.sobreposicaoConteudo}>
        <header style={estilos.cabecalhoGlass}>
          <h1 style={estilos.tituloMarca}>SISTEMA DE ALUGUEL DE JOGOS DE TABULEIRO</h1>
          <span style={estilos.subtituloMarca}>Programação WeB | UFCI - RJ</span>
          <p style={estilos.descricaoEditorial}>Painel de controle e catalogação</p>
        </header>

        <section style={estilos.secaoModulos}>
          <div style={estilos.gradeDeModulos}>
            <Link href="/categorias" style={estilos.cartaoGlass}>
              <div>
                <h3 style={estilos.tituloCartao}>CATEGORIAS</h3>
                <p style={estilos.subtituloCartao}>CLASSIFICAÇÃO</p>
              </div>
              <div style={estilos.setaDourada}>&#10132;</div>
            </Link>

            <Link href="/jogos" style={estilos.cartaoGlass}>
              <div>
                <h3 style={estilos.tituloCartao}>JOGOS DO ACERVO</h3>
                <p style={estilos.subtituloCartao}>CATÁLOGO</p>
              </div>
              <div style={estilos.setaDourada}>&#10132;</div>
            </Link>

            <Link href="/usuarios" style={estilos.cartaoGlass}>
              <div>
                <h3 style={estilos.tituloCartao}>USUÁRIOS</h3>
                <p style={estilos.subtituloCartao}>MEMBROS REGISTRADOS</p>
              </div>
              <div style={estilos.setaDourada}>&#10132;</div>
            </Link>

            <Link href="/alugueis" style={estilos.cartaoGlass}>
              <div>
                <h3 style={estilos.tituloCartao}>ALUGUÉIS</h3>
                <p style={estilos.subtituloCartao}>CONTRATOS ATIVOS</p>
              </div>
              <div style={estilos.setaDourada}>&#10132;</div>
            </Link>

            <Link href="/pagamentos" style={estilos.cartaoGlass}>
              <div>
                <h3 style={estilos.tituloCartao}>PAGAMENTOS</h3>
                <p style={estilos.subtituloCartao}>GESTÃO FINANCEIRA</p>
              </div>
              <div style={estilos.setaDourada}>&#10132;</div>
            </Link>

            <Link href="/reviews" style={estilos.cartaoGlass}>
              <div>
                <h3 style={estilos.tituloCartao}>REVIEWS</h3>
                <p style={estilos.subtituloCartao}>AVALIAÇÕES</p>
              </div>
              <div style={estilos.setaDourada}>&#10132;</div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

const estilos = {
  recipiente: {
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    margin: 0,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%23111111\'/%3E%3Crect x=\'100\' width=\'100\' height=\'100\' fill=\'%23f0f0f0\'/%3E%3Crect y=\'100\' width=\'100\' height=\'100\' fill=\'%23f0f0f0\'/%3E%3Crect x=\'100\' y=\'100\' width=\'100\' height=\'100\' fill=\'%23111111\'/%3E%3Ctext x=\'50\' y=\'70\' font-size=\'50\' text-anchor=\'middle\' fill=\'%23222222\'%3E%E2%99%9E%3C/text%3E%3Ctext x=\'150\' y=\'70\' font-size=\'50\' text-anchor=\'middle\' fill=\'%23e4e4e4\'%3E%E2%99%9C%3C/text%3E%3Ctext x=\'50\' y=\'170\' font-size=\'50\' text-anchor=\'middle\' fill=\'%23e4e4e4\'%3E%E2%99%9F%3C/text%3E%3Ctext x=\'150\' y=\'170\' font-size=\'50\' text-anchor=\'middle\' fill=\'%23222222\'%3E%E2%99%9B%3C/text%3E%3C/svg%3E")',
    backgroundSize: '200px 200px',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },
  sobreposicaoConteudo: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: '40px 20px'
  },
  cabecalhoGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(32px)',
    WebkitBackdropFilter: 'blur(32px)',
    padding: '40px 60px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    marginBottom: '60px',
    maxWidth: '800px',
    width: '100%'
  },
  tituloMarca: {
    fontSize: '32px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    margin: '0 0 12px 0',
    color: '#111111'
  },
  subtituloMarca: {
    fontSize: '12px',
    letterSpacing: '6px',
    fontWeight: '600',
    color: '#333333',
    display: 'block',
    marginBottom: '20px'
  },
  descricaoEditorial: {
    fontSize: '20px',
    fontWeight: '400',
    letterSpacing: '1px',
    margin: 0,
    color: '#444444'
  },
  secaoModulos: {
    width: '100%',
    maxWidth: '1000px',
    display: 'flex',
    justifyContent: 'center',
  },
  gradeDeModulos: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    width: '100%'
  },
  cartaoGlass: {
    backgroundColor: 'rgba(20, 20, 20, 0.70)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    padding: '30px 24px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textDecoration: 'none',
    transition: 'transform 0.2s',
  },
  tituloCartao: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 6px 0',
    letterSpacing: '1px',
    color: '#FFFFFF'
  },
  subtituloCartao: {
    fontSize: '10px',
    letterSpacing: '2px',
    color: '#A0A0A0',
    margin: 0,
    fontWeight: '600'
  },
  setaDourada: {
    fontSize: '20px',
    color: '#C5A059'
  }
};