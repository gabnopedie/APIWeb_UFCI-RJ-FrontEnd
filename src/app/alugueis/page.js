"use client";
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Alugueis() {
  const [alugueis, definirAlugueis] = useState([]);
  const [filtros, definirFiltros] = useState({
    status: '',
    id_usuario: '',
    id_jogo: ''
  });
  const roteador = useRouter();

  const buscarAlugueis = useCallback(async () => {
    const token = localStorage.getItem('token_ufci');
    if (!token) {
      roteador.push('/login');
      return;
    }

    try {
      const parametros = new URLSearchParams();
      if (filtros.status) parametros.append('status', filtros.status);
      if (filtros.id_usuario) parametros.append('id_usuario', filtros.id_usuario);
      if (filtros.id_jogo) parametros.append('id_jogo', filtros.id_jogo);

      const url = `http://localhost:3000/rentals?${parametros.toString()}`;
      const resposta = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (resposta.status === 401) {
        localStorage.removeItem('token_ufci');
        roteador.push('/login');
        return;
      }

      const json = await resposta.json();
      if (json.data) definirAlugueis(json.data);
    } catch (erro) {
      console.error(erro);
    }
  }, [filtros, roteador]);

  useEffect(() => {
    buscarAlugueis();
  }, [buscarAlugueis]);

  function atualizarFiltro(campo, valor) {
    definirFiltros(prev => ({ ...prev, [campo]: valor }));
  }

  async function alterarStatus(id, acao) {
    const token = localStorage.getItem('token_ufci');
    try {
      const resposta = await fetch(`http://localhost:3000/rentals/${id}/${acao}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resposta.ok) buscarAlugueis();
    } catch (erro) {
      console.error(erro);
    }
  }

  return (
    <main style={estilos.recipiente}>
      <div style={estilos.bordaSuperiorDourada}></div>
      <div style={estilos.bordaSuperiorFina}></div>

      <header style={estilos.cabecalho}>
        <div style={estilos.linhaTopo}>
          <Link href="/" style={estilos.linkVoltar}>&#8592; PAINEL</Link>
          <Link href="/alugueis/novo" style={estilos.botaoNovo}>NOVO CONTRATO</Link>
        </div>
        <h1 style={estilos.titulo}>Contratos de Aluguel</h1>
        <div style={estilos.linhaDecorativa}></div>
      </header>

      <section style={estilos.areaFiltros}>
        <select style={estilos.entradaFiltro} value={filtros.status} onChange={(e) => atualizarFiltro('status', e.target.value)}>
          <option value="">TODOS OS STATUS</option>
          <option value="ATIVO">ATIVO</option>
          <option value="CONCLUIDO">CONCLUÍDO</option>
          <option value="ATRASADO">ATRASADO</option>
          <option value="CANCELADO">CANCELADO</option>
        </select>
        <input type="number" placeholder="ID CLIENTE" style={estilos.entradaFiltro} value={filtros.id_usuario} onChange={(e) => atualizarFiltro('id_usuario', e.target.value)} />
        <input type="number" placeholder="ID JOGO" style={estilos.entradaFiltro} value={filtros.id_jogo} onChange={(e) => atualizarFiltro('id_jogo', e.target.value)} />
      </section>

      <section style={estilos.conteudo}>
        {alugueis.length === 0 && <p style={estilos.textoVazio}>Nenhum contrato localizado.</p>}
        
        <div style={estilos.gradeContratos}>
          {alugueis.map(aluguel => (
            <div key={aluguel.id} style={estilos.cartao}>
              <div style={estilos.cabecalhoCartao}>
                <span style={estilos.numeroContrato}>LOTE Nº {aluguel.id}</span>
                <span style={estilos.etiquetaStatus}>{aluguel.status}</span>
              </div>
              <h2 style={estilos.nomeJogo}>Acervo: {aluguel.id_jogo}</h2>
              <p style={estilos.detalheTexto}>Cliente: {aluguel.id_usuario}</p>
              <p style={estilos.detalheTexto}>Peças: {aluguel.quantidade}</p>
              <p style={estilos.detalheTexto}>Devolução: {aluguel.data_prevista_devolucao ? new Date(aluguel.data_prevista_devolucao).toLocaleDateString('pt-BR') : '-'}</p>
              
              {aluguel.status === 'ATIVO' && (
                <div style={estilos.areaAcoes}>
                  <button onClick={() => alterarStatus(aluguel.id, 'return')} style={estilos.botaoAcao}>DEVOLVER</button>
                  <button onClick={() => alterarStatus(aluguel.id, 'cancel')} style={estilos.botaoAcaoVazado}>CANCELAR</button>
                  <Link href={`/alugueis/${aluguel.id}/estender`} style={estilos.botaoAcaoDourado}>PRORROGAR</Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const estilos = {
  recipiente: { minHeight: '100vh', backgroundColor: '#FFFFFF', fontFamily: '"Playfair Display", "Georgia", serif', color: '#000000', margin: 0 },
  bordaSuperiorDourada: { width: '100%', height: '4px', backgroundColor: '#C5A059' },
  bordaSuperiorFina: { width: '100%', height: '1px', backgroundColor: '#000000' },
  cabecalho: { padding: '40px 60px 20px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  linhaTopo: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  linkVoltar: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '11px', letterSpacing: '2px', color: '#000000', textDecoration: 'none', fontWeight: '600' },
  botaoNovo: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '11px', letterSpacing: '2px', color: '#FFFFFF', backgroundColor: '#000000', padding: '12px 24px', textDecoration: 'none', fontWeight: '600' },
  titulo: { fontSize: '36px', fontWeight: 'normal', letterSpacing: '2px', margin: '0 0 20px 0' },
  linhaDecorativa: { width: '100px', height: '1px', backgroundColor: '#C5A059', margin: '0 auto' },
  areaFiltros: { display: 'flex', justifyContent: 'center', gap: '16px', padding: '0 60px 30px 60px' },
  entradaFiltro: { padding: '12px', border: '1px solid #EAEAEA', backgroundColor: '#FAF7F2', fontSize: '11px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', letterSpacing: '1px', outline: 'none' },
  conteudo: { padding: '0 60px 60px 60px', maxWidth: '1200px', margin: '0 auto', width: '100%' },
  textoVazio: { textAlign: 'center', fontSize: '18px', fontStyle: 'italic', color: '#666666' },
  gradeContratos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' },
  cartao: { border: '1px solid #EAEAEA', padding: '30px', backgroundColor: '#FAF7F2' },
  cabecalhoCartao: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  numeroContrato: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '10px', letterSpacing: '2px', color: '#C5A059', fontWeight: 'bold' },
  etiquetaStatus: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '9px', letterSpacing: '1px', color: '#FFFFFF', backgroundColor: '#2A1F19', padding: '4px 8px' },
  nomeJogo: { fontSize: '22px', fontWeight: 'normal', margin: '0 0 16px 0', color: '#000000' },
  detalheTexto: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '11px', letterSpacing: '1px', margin: '0 0 8px 0', color: '#333333' },
  areaAcoes: { display: 'flex', gap: '10px', marginTop: '24px', flexWrap: 'wrap' },
  botaoAcao: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '9px', letterSpacing: '1px', color: '#FFFFFF', backgroundColor: '#000000', border: 'none', padding: '10px 16px', cursor: 'pointer', fontWeight: 'bold' },
  botaoAcaoVazado: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '9px', letterSpacing: '1px', color: '#000000', backgroundColor: 'transparent', border: '1px solid #000000', padding: '10px 16px', cursor: 'pointer', fontWeight: 'bold' },
  botaoAcaoDourado: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '9px', letterSpacing: '1px', color: '#FFFFFF', backgroundColor: '#C5A059', textDecoration: 'none', padding: '10px 16px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }
};