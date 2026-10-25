import Link from 'next/link';

export default function PaginaInicial() {
  return (
    <main style={estilos.recipiente}>
      <div style={estilos.bordaSuperiorDourada}></div>
      <div style={estilos.bordaSuperiorFina}></div>

      <header style={estilos.cabecalho}>
        <h1 style={estilos.tituloMarca}>SISTEMA DE ALUGUEL DE JOGOS DE TABULEIRO</h1>
        <span style={estilos.subtituloMarca}>Programação WeB | UFCI - RJ</span>
      </header>

      <section style={estilos.areaTabuleiro}>
        <div style={estilos.conteudoInvertido}>
          <p style={estilos.descricaoEditorial}>
            Painel de controle e catalogação
          </p>
        </div>
      </section>

      <section style={estilos.secaoModulos}>
        <div style={estilos.gradeDeModulos}>
          
          <Link href="/categorias" style={{...estilos.cartaoBase, ...estilos.fundoBranco}}>
            <div>
              <h3 style={estilos.tituloEscuro}>CATEGORIAS</h3>
              <p style={estilos.subtituloEscuro}>CLASSIFICAÇÃO</p>
            </div>
            <div style={estilos.setaEscura}>&#10132;</div>
          </Link>

          <Link href="/jogos" style={{...estilos.cartaoBase, ...estilos.fundoDourado}}>
            <div>
              <h3 style={estilos.tituloEscuro}>JOGOS DO ACERVO</h3>
              <p style={estilos.subtituloEscuro}>CATÁLOGO</p>
            </div>
            <div style={estilos.setaEscura}>&#10132;</div>
          </Link>

          <Link href="/usuarios" style={{...estilos.cartaoBase, ...estilos.fundoMarromClaro}}>
            <div>
              <h3 style={estilos.tituloClaro}>USUÁRIOS</h3>
              <p style={estilos.subtituloClaro}>MEMBROS REGISTRADOS</p>
            </div>
            <div style={estilos.setaClara}>&#10132;</div>
          </Link>

          <Link href="/alugueis" style={{...estilos.cartaoBase, ...estilos.fundoMarromEscuro}}>
            <div>
              <h3 style={estilos.tituloClaro}>ALUGUÉIS</h3>
              <p style={estilos.subtituloDourado}>CONTRATOS ATIVOS</p>
            </div>
            <div style={estilos.setaDourada}>&#10132;</div>
          </Link>

          <Link href="/pagamentos" style={{...estilos.cartaoBase, ...estilos.fundoPretoMisto}}>
            <div>
              <h3 style={estilos.tituloClaro}>PAGAMENTOS</h3>
              <p style={estilos.subtituloDourado}>GESTÃO FINANCEIRA</p>
            </div>
            <div style={estilos.setaDourada}>&#10132;</div>
          </Link>

          <Link href="/reviews" style={{...estilos.cartaoBase, ...estilos.fundoPretoAbsoluto}}>
            <div>
              <h3 style={estilos.tituloClaro}>REVIEWS</h3>
              <p style={estilos.subtituloDourado}>AVALIAÇÕES</p>
            </div>
            <div style={estilos.setaDourada}>&#10132;</div>
          </Link>

        </div>
      </section>
    </main>
  );
}

const estilos = {
  recipiente: {
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
    fontFamily: '"Playfair Display", "Georgia", serif',
    margin: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  bordaSuperiorDourada: {
    width: '100%',
    height: '4px',
    backgroundColor: '#C5A059'
  },
  bordaSuperiorFina: {
    width: '100%',
    height: '1px',
    backgroundColor: '#000000'
  },
  cabecalho: {
    padding: '60px 20px 40px 20px',
    textAlign: 'center',
    backgroundColor: '#FFFFFF'
  },
  tituloMarca: {
    fontSize: '32px',
    fontWeight: 'normal',
    letterSpacing: '4px',
    margin: '0 0 12px 0',
    color: '#000000'
  },
  subtituloMarca: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '12px',
    letterSpacing: '6px',
    fontWeight: '600',
    color: '#000000'
  },
  areaTabuleiro: {
    flexGrow: 1,
    width: '100%',
    maxHeight: '200px',
    backgroundColor: '#FFFFFF',
    backgroundImage: 'conic-gradient(#000000 90deg, transparent 90deg 180deg, #000000 180deg 270deg, transparent 270deg)',
    backgroundSize: '100px 100px',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '40px 0'
  },
  conteudoInvertido: {
    color: '#FFFFFF',
    mixBlendMode: 'difference',
    textAlign: 'center',
    width: '100%',
    padding: '20px 0'
  },
  descricaoEditorial: {
    fontSize: '28px',
    fontStyle: 'italic',
    letterSpacing: '2px',
    margin: 0
  },
  secaoModulos: {
    width: '100%',
    padding: '0',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'auto'
  },
  gradeDeModulos: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '0',
    width: '100%'
  },
  cartaoBase: {
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textDecoration: 'none',
    transition: 'transform 0.2s',
    height: '90px'
  },
  fundoBranco: { backgroundColor: '#FFFFFF' },
  fundoDourado: { backgroundColor: '#C5A059' },
  fundoMarromClaro: { backgroundColor: '#8C6239' },
  fundoMarromEscuro: { backgroundColor: '#4A2C1B' },
  fundoPretoMisto: { backgroundColor: '#2A1F19' },
  fundoPretoAbsoluto: { backgroundColor: '#0A0A0A' },
  
  tituloEscuro: {
    fontSize: '15px',
    fontWeight: 'normal',
    color: '#000000',
    margin: '0 0 4px 0',
    letterSpacing: '1px'
  },
  subtituloEscuro: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '9px',
    letterSpacing: '1px',
    color: '#000000',
    margin: 0,
    fontWeight: '600'
  },
  setaEscura: {
    fontSize: '16px',
    color: '#000000'
  },
  tituloClaro: {
    fontSize: '15px',
    fontWeight: 'normal',
    color: '#FFFFFF',
    margin: '0 0 4px 0',
    letterSpacing: '1px'
  },
  subtituloClaro: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '9px',
    letterSpacing: '1px',
    color: '#E0E0E0',
    margin: 0,
    fontWeight: '600'
  },
  subtituloDourado: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '9px',
    letterSpacing: '1px',
    color: '#C5A059',
    margin: 0,
    fontWeight: '600'
  },
  setaClara: {
    fontSize: '16px',
    color: '#FFFFFF'
  },
  setaDourada: {
    fontSize: '16px',
    color: '#C5A059'
  }
};