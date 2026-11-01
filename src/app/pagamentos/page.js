"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useApi } from '../../hooks/useApi';
import Input from '../../components/Input';

const statusLegivel = {
  PENDENTE: 'Pendente',
  PAGO: 'Pago',
  ESTORNADO: 'Estornado'
};

const formasPagamentoLegiveis = {
  PIX: 'Pix',
  CARTAO_CREDITO: 'Cartão de crédito',
  CARTAO_DEBITO: 'Cartão de débito',
  DINHEIRO: 'Dinheiro'
};

export default function Pagamentos() {
  const [filtros, definirFiltros] = useState({
    status: '',
    forma_pagamento: '',
    startDate: '',
    endDate: ''
  });

  const parametros = new URLSearchParams();
  if (filtros.status) parametros.append('status', filtros.status);
  if (filtros.forma_pagamento) parametros.append('forma_pagamento', filtros.forma_pagamento);
  if (filtros.startDate) parametros.append('startDate', filtros.startDate);
  if (filtros.endDate) parametros.append('endDate', filtros.endDate);

  const { data: respostaApi, loading, refetch } = useApi(`/payments?${parametros.toString()}`);
  const pagamentos = respostaApi?.data || [];

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
            <Link href="/pagamentos/novo" style={estilos.botaoNovo}>Registrar pagamento</Link>
          </div>
          <h1 style={estilos.titulo}>Gestão financeira</h1>
          <div style={estilos.linhaDecorativa}></div>
        </header>

        <section style={estilos.areaFiltrosGlass}>
          <select style={estilos.entradaFiltro} value={filtros.status} onChange={(e) => atualizarFiltro('status', e.target.value)}>
            <option value="">Todos os status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="PAGO">Pago</option>
            <option value="ESTORNADO">Estornado</option>
          </select>
          <select style={estilos.entradaFiltro} value={filtros.forma_pagamento} onChange={(e) => atualizarFiltro('forma_pagamento', e.target.value)}>
            <option value="">Todas as formas</option>
            <option value="PIX">Pix</option>
            <option value="CARTAO_CREDITO">Cartão de crédito</option>
            <option value="CARTAO_DEBITO">Cartão de débito</option>
            <option value="DINHEIRO">Dinheiro</option>
          </select>
          
          <div style={{ width: '160px' }}>
            <Input type="date" value={filtros.startDate} onChange={(e) => atualizarFiltro('startDate', e.target.value)} />
          </div>
          <div style={{ width: '160px' }}>
            <Input type="date" value={filtros.endDate} onChange={(e) => atualizarFiltro('endDate', e.target.value)} />
          </div>
        </section>

        <section style={estilos.conteudo}>
          {loading && <p style={estilos.textoVazio}>Carregando pagamentos...</p>}
          {!loading && pagamentos.length === 0 && <p style={estilos.textoVazio}>Nenhum registro financeiro localizado.</p>}
          
          <div style={estilos.gradeContratos}>
            {pagamentos.map(pagamento => (
              <div key={pagamento.id} style={estilos.cartaoGlass}>
                <div style={estilos.cabecalhoCartao}>
                  <span style={estilos.numeroContrato}>Recibo nº {pagamento.id}</span>
                  <span style={estilos.etiquetaStatus}>
                    {statusLegivel[pagamento.status] || String(pagamento.status).toLowerCase()}
                  </span>
                </div>
                <h2 style={estilos.nomeJogo}>R$ {Number(pagamento.valor).toFixed(2)}</h2>
                <p style={estilos.detalheTexto}>Contrato origem: {pagamento.id_aluguel}</p>
                <p style={estilos.detalheTexto}>
                  Método: {formasPagamentoLegiveis[pagamento.forma_pagamento] || String(pagamento.forma_pagamento).toLowerCase()}
                </p>
                
                {pagamento.status === 'PENDENTE' && (
                  <div style={estilos.areaAcoes}>
                    <button onClick={() => alterarStatus(pagamento.id, 'confirm')} style={estilos.botaoAcao}>Confirmar</button>
                    <button onClick={() => alterarStatus(pagamento.id, 'refund')} style={estilos.botaoAcaoVazado}>Estornar</button>
                  </div>
                )}
                {pagamento.status === 'PAGO' && (
                  <div style={estilos.areaAcoes}>
                    <button onClick={() => alterarStatus(pagamento.id, 'refund')} style={estilos.botaoAcaoVazado}>Estornar</button>
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
  botaoAcaoVazado: { fontSize: '12px', color: '#ffffff', backgroundColor: 'transparent', border: '1px solid #ffffff', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }
};