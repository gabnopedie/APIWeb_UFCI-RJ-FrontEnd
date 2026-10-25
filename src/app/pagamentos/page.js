"use client";
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Pagamentos() {
  const [pagamentos, definirPagamentos] = useState([]);
  const [filtros, definirFiltros] = useState({
    status: '',
    forma_pagamento: '',
    startDate: '',
    endDate: ''
  });
  const roteador = useRouter();

  const buscarPagamentos = useCallback(async () => {
    const token = localStorage.getItem('token_ufci');
    if (!token) {
      roteador.push('/login');
      return;
    }

    try {
      const parametros = new URLSearchParams();
      if (filtros.status) parametros.append('status', filtros.status);
      if (filtros.forma_pagamento) parametros.append('forma_pagamento', filtros.forma_pagamento);
      if (filtros.startDate) parametros.append('startDate', filtros.startDate);
      if (filtros.endDate) parametros.append('endDate', filtros.endDate);

      const url = `http://localhost:3000/payments?${parametros.toString()}`;
      const resposta = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (resposta.status === 401) {
        localStorage.removeItem('token_ufci');
        roteador.push('/login');
        return;
      }

      const json = await resposta.json();
      if (json.data) definirPagamentos(json.data);
    } catch (erro) {
      console.error(erro);
    }
  }, [filtros, roteador]);

  useEffect(() => {
    buscarPagamentos();
  }, [buscarPagamentos]);

  function atualizarFiltro(campo, valor) {
    definirFiltros(prev => ({ ...prev, [campo]: valor }));
  }

  async function alterarStatus(id, acao) {
    const token = localStorage.getItem('token_ufci');
    try {
      const resposta = await fetch(`http://localhost:3000/payments/${id}/${acao}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resposta.ok) buscarPagamentos();
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
          <Link href="/pagamentos/novo" style={estilos.botaoNovo}>REGISTRAR PAGAMENTO</Link>
        </div>
        <h1 style={estilos.titulo}>Gestão Financeira</h1>
        <div style={estilos.linhaDecorativa}></div>
      </header>

      <section style={estilos.areaFiltros}>
        <select style={estilos.entradaFiltro} value={filtros.status} onChange={(e) => atualizarFiltro('status', e.target.value)}>
          <option value="">TODOS OS STATUS</option>
          <option value="PENDENTE">PENDENTE</option>
          <option value="PAGO">PAGO</option>
          <option value="ESTORNADO">ESTORNADO</option>
        </select>
        <select style={estilos.entradaFiltro} value={filtros.forma_pagamento} onChange={(e) => atualizarFiltro('forma_pagamento', e.target.value)}>
          <option value="">TODAS AS FORMAS</option>
          <option value="PIX">PIX</option>
          <option value="CARTAO_CREDITO">CARTÃO DE CRÉDITO</option>
          <option value="CARTAO_DEBITO">CARTÃO DE DÉBITO</option>
          <option value="DINHEIRO">DINHEIRO</option>
        </select>
        <input type="date" style={estilos.entradaFiltro} value={filtros.startDate} onChange={(e) => atualizarFiltro('startDate', e.target.value)} />
        <input type="date" style={estilos.entradaFiltro} value={filtros.endDate} onChange={(e) => atualizarFiltro('endDate', e.target.value)} />
      </section>

      <section style={estilos.conteudo}>
        {pagamentos.length === 0 && <p style={estilos.textoVazio}>Nenhum registro financeiro localizado.</p>}
        
        <div style={estilos.gradeContratos}>
          {pagamentos.map(pagamento => (
            <div key={pagamento.id} style={estilos.cartao}>
              <div style={estilos.cabecalhoCartao}>
                <span style={estilos.numeroContrato}>RECIBO Nº {pagamento.id}</span>
                <span style={estilos.etiquetaStatus}>{pagamento.status}</span>
              </div>
              <h2 style={estilos.nomeJogo}>R$ {Number(pagamento.valor).toFixed(2)}</h2>
              <p style={estilos.detalheTexto}>Contrato Origem: {pagamento.id_aluguel}</p>
              <p style={estilos.detalheTexto}>Método: {pagamento.forma_pagamento}</p>
              
              {pagamento.status === 'PENDENTE' && (
                <div style={estilos.areaAcoes}>
                  <button onClick={() => alterarStatus(pagamento.id, 'confirm')} style={estilos.botaoAcao}>CONFIRMAR</button>
                  <button onClick={() => alterarStatus(pagamento.id, 'refund')} style={estilos.botaoAcaoVazado}>ESTORNAR</button>
                </div>
              )}
              {pagamento.status === 'PAGO' && (
                <div style={estilos.areaAcoes}>
                  <button onClick={() => alterarStatus(pagamento.id, 'refund')} style={estilos.botaoAcaoVazado}>ESTORNAR</button>
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
  areaFiltros: { display: 'flex', justifyContent: 'center', gap: '16px', padding: '0 60px 30px 60px', flexWrap: 'wrap' },
  entradaFiltro: { padding: '12px', border: '1px solid #EAEAEA', backgroundColor: '#FAF7F2', fontSize: '11px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', letterSpacing: '1px', outline: 'none' },
  conteudo: { padding: '0 60px 60px 60px', maxWidth: '1200px', margin: '0 auto', width: '100%' },
  textoVazio: { textAlign: 'center', fontSize: '18px', fontStyle: 'italic', color: '#666666' },
  gradeContratos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' },
  cartao: { border: '1px solid #EAEAEA', padding: '30px', backgroundColor: '#FAF7F2' },
  cabecalhoCartao: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  numeroContrato: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '10px', letterSpacing: '2px', color: '#C5A059', fontWeight: 'bold' },
  etiquetaStatus: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '9px', letterSpacing: '1px', color: '#FFFFFF', backgroundColor: '#2A1F19', padding: '4px 8px' },
  nomeJogo: { fontSize: '28px', fontWeight: 'normal', margin: '0 0 16px 0', color: '#000000' },
  detalheTexto: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '11px', letterSpacing: '1px', margin: '0 0 8px 0', color: '#333333' },
  areaAcoes: { display: 'flex', gap: '10px', marginTop: '24px', flexWrap: 'wrap' },
  botaoAcao: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '9px', letterSpacing: '1px', color: '#FFFFFF', backgroundColor: '#000000', border: 'none', padding: '10px 16px', cursor: 'pointer', fontWeight: 'bold' },
  botaoAcaoVazado: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '9px', letterSpacing: '1px', color: '#000000', backgroundColor: 'transparent', border: '1px solid #000000', padding: '10px 16px', cursor: 'pointer', fontWeight: 'bold' }
};