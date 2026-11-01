"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useApi } from '../../hooks/useApi';
import Input from '../../components/Input';

const statusLegivel = {
  ATIVO: 'Ativo',
  CONCLUIDO: 'Concluído',
  ATRASADO: 'Atrasado',
  CANCELADO: 'Cancelado'
};

export default function Alugueis() {
  const [filtros, definirFiltros] = useState({
    status: '',
    id_usuario: '',
    id_jogo: ''
  });

  const parametros = new URLSearchParams();
  if (filtros.status) parametros.append('status', filtros.status);
  if (filtros.id_usuario) parametros.append('id_usuario', filtros.id_usuario);
  if (filtros.id_jogo) parametros.append('id_jogo', filtros.id_jogo);

  const { data: respostaApi, loading, refetch } = useApi(`/rentals?${parametros.toString()}`);
  const alugueis = respostaApi?.data || [];

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
      if (resposta.ok) refetch();
    } catch (erro) {
      console.error(erro);
    }
  }

  return (
    <main style={estilos.recipiente}>
      <div style={estilos.sobreposicaoConteudo}>
        <header style={estilos.cabecalhoGlass}>
          <div style={estilos.linhaTopo}>
            <Link href="/" style={estilos.linkVoltar}>&#8592; Painel principal</Link>
            <Link href="/alugueis/novo" style={estilos.botaoNovo}>Novo contrato</Link>
          </div>
          <h1 style={estilos.titulo}>Contratos de aluguel</h1>
          <div style={estilos.linhaDecorativa}></div>
        </header>

        <section style={estilos.areaFiltrosGlass}>
          <select style={estilos.entradaFiltro} value={filtros.status} onChange={(e) => atualizarFiltro('status', e.target.value)}>
            <option value="">Todos os status</option>
            <option value="ATIVO">Ativo</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="ATRASADO">Atrasado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
          
          <div style={{ width: '200px' }}>
            <Input type="number" placeholder="ID do cliente" value={filtros.id_usuario} onChange={(e) => atualizarFiltro('id_usuario', e.target.value)} />
          </div>
          <div style={{ width: '200px' }}>
            <Input type="number" placeholder="ID do jogo" value={filtros.id_jogo} onChange={(e) => atualizarFiltro('id_jogo', e.target.value)} />
          </div>
        </section>

        <section style={estilos.conteudo}>
          {loading && <p style={estilos.textoVazio}>Carregando contratos...</p>}
          {!loading && alugueis.length === 0 && <p style={estilos.textoVazio}>Nenhum contrato localizado.</p>}
          
          <div style={estilos.gradeContratos}>
            {alugueis.map(aluguel => (
              <div key={aluguel.id} style={estilos.cartaoGlass}>
                <div style={estilos.cabecalhoCartao}>
                  <span style={estilos.numeroContrato}>Lote nº {aluguel.id}</span>
                  <span style={estilos.etiquetaStatus}>
                    {statusLegivel[aluguel.status] || String(aluguel.status).toLowerCase()}
                  </span>
                </div>
                <h2 style={estilos.nomeJogo}>Acervo: {aluguel.id_jogo}</h2>
                <p style={estilos.detalheTexto}>Cliente: {aluguel.id_usuario}</p>
                <p style={estilos.detalheTexto}>Peças: {aluguel.quantidade}</p>
                <p style={estilos.detalheTexto}>Devolução: {aluguel.data_prevista_devolucao ? new Date(aluguel.data_prevista_devolucao).toLocaleDateString('pt-BR') : '-'}</p>
                
                {aluguel.status === 'ATIVO' && (
                  <div style={estilos.areaAcoes}>
                    <button onClick={() => alterarStatus(aluguel.id, 'return')} style={estilos.botaoAcao}>Devolver</button>
                    <button onClick={() => alterarStatus(aluguel.id, 'cancel')} style={estilos.botaoAcaoVazado}>Cancelar</button>
                    <Link href={`/alugueis/${aluguel.id}/estender`} style={estilos.botaoAcaoDourado}>Prorrogar</Link>
                  </div>
                )}
              </div>
            ))}
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
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%231a1a1a\'/%3E%3Crect x=\'100\' width=\'100\' height=\'100\' fill=\'%23242424\'/%3E%3Crect y=\'100\' width=\'100\' height=\'100\' fill=\'%23242424\'/%3E%3Crect x=\'100\' y=\'100\' width=\'100\' height=\'100\' fill=\'%231a1a1a\'/%3E%3Ctext x=\'50\' y=\'75\' font-size=\'65\' text-anchor=\'middle\' fill=\'%23222222\'%3E%E2%99%9E%3C/text%3E%3Ctext x=\'150\' y=\'75\' font-size=\'65\' text-anchor=\'middle\' fill=\'%232c2c2c\'%3E%E2%99%9C%3C/text%3E%3Ctext x=\'50\' y=\'175\' font-size=\'65\' text-anchor=\'middle\' fill=\'%232c2c2c\'%3E%E2%99%9F%3C/text%3E%3Ctext x=\'150\' y=\'175\' font-size=\'65\' text-anchor=\'middle\' fill=\'%23222222\'%3E%E2%99%9B%3C/text%3E%3C/svg%3E")',
    backgroundSize: '200px 200px',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },
  sobreposicaoConteudo: { 
    minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)', 
    padding: '40px 20px' 
  },
  cabecalhoGlass: { 
    backgroundColor: 'rgba(255, 255, 255, 0.65)', 
    backdropFilter: 'blur(32px)', 
    WebkitBackdropFilter: 'blur(32px)', 
    padding: '30px 50px', 
    borderRadius: '16px', 
    border: '1px solid rgba(255, 255, 255, 0.5)', 
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)', 
    width: '100%', 
    maxWidth: '800px',
    marginBottom: '30px'
  },
  linhaTopo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  linkVoltar: { fontSize: '14px', color: '#111111', textDecoration: 'none', fontWeight: '600' },
  botaoNovo: { fontSize: '13px', color: '#FFFFFF', backgroundColor: '#111111', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' },
  titulo: { fontSize: '32px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#111111', textAlign: 'center' },
  linhaDecorativa: { width: '80px', height: '2px', backgroundColor: '#C5A059', margin: '0 auto' },
  areaFiltrosGlass: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: '16px', 
    padding: '20px', 
    backgroundColor: 'rgba(20, 20, 20, 0.70)', 
    backdropFilter: 'blur(20px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '40px',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '800px'
  },
  entradaFiltro: { 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid rgba(255, 255, 255, 0.15)', 
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    backdropFilter: 'blur(20px)', 
    color: '#ffffff', 
    fontSize: '14px', 
    outline: 'none', 
    height: '44px' 
  },
  conteudo: { width: '100%', maxWidth: '800px' },
  textoVazio: { textAlign: 'center', fontSize: '18px', color: '#ffffff', fontWeight: '500' },
  gradeContratos: { display: 'flex', flexDirection: 'column', gap: '24px' },
  cartaoGlass: { 
    backgroundColor: 'rgba(20, 20, 20, 0.75)', 
    backdropFilter: 'blur(20px)', 
    WebkitBackdropFilter: 'blur(20px)', 
    padding: '24px', 
    borderRadius: '12px', 
    border: '1px solid rgba(255, 255, 255, 0.1)', 
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' 
  },
  cabecalhoCartao: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  numeroContrato: { fontSize: '12px', color: '#C5A059', fontWeight: 'bold' },
  etiquetaStatus: { fontSize: '11px', color: '#111111', backgroundColor: '#ffffff', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' },
  nomeJogo: { fontSize: '20px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#ffffff' },
  detalheTexto: { fontSize: '13px', margin: '0 0 6px 0', color: '#cccccc' },
  areaAcoes: { display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' },
  botaoAcao: { fontSize: '12px', color: '#111111', backgroundColor: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  botaoAcaoVazado: { fontSize: '12px', color: '#ffffff', backgroundColor: 'transparent', border: '1px solid #ffffff', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  botaoAcaoDourado: { fontSize: '12px', color: '#111111', backgroundColor: '#C5A059', textDecoration: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: '600', display: 'flex', alignItems: 'center' }
};