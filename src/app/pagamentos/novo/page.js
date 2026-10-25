"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NovoPagamento() {
  const roteador = useRouter();
  const [erro, definirErro] = useState('');
  const [dados, definirDados] = useState({
    id_aluguel: '',
    valor: '',
    forma_pagamento: 'PIX'
  });

  function atualizarCampo(campo, valor) {
    definirDados({ ...dados, [campo]: valor });
  }

  async function submeterFormulario(evento) {
    evento.preventDefault();
    definirErro('');

    const token = localStorage.getItem('token_ufci');
    if (!token) {
      roteador.push('/login');
      return;
    }

    const cargaDeDados = {
      id_aluguel: parseInt(dados.id_aluguel, 10),
      valor: parseFloat(dados.valor),
      forma_pagamento: dados.forma_pagamento
    };

    try {
      const resposta = await fetch('http://localhost:3000/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cargaDeDados)
      });

      if (resposta.ok) {
        roteador.push('/pagamentos');
      } else {
        const erroRetornado = await resposta.json();
        definirErro(erroRetornado.message || 'Falha ao registrar o pagamento.');
      }
    } catch (falha) {
      definirErro('Falha de conexão com o servidor.');
    }
  }

  return (
    <main style={estilos.recipiente}>
      <div style={estilos.bordaSuperiorDourada}></div>
      <div style={estilos.bordaSuperiorFina}></div>

      <header style={estilos.cabecalho}>
        <div style={estilos.linhaTopo}>
          <Link href="/pagamentos" style={estilos.linkVoltar}>&#8592; CANCELAR</Link>
        </div>
        <h1 style={estilos.titulo}>Lançamento Financeiro</h1>
        <div style={estilos.linhaDecorativa}></div>
      </header>

      <section style={estilos.conteudo}>
        <form onSubmit={submeterFormulario} style={estilos.formulario}>
          <div style={estilos.grupoEntrada}>
            <label style={estilos.rotulo}>Nº DO CONTRATO (ID ALUGUEL) *</label>
            <input type="number" min="1" required style={estilos.entradaTexto} value={dados.id_aluguel} onChange={(e) => atualizarCampo('id_aluguel', e.target.value)} />
          </div>

          <div style={estilos.grupoEntrada}>
            <label style={estilos.rotulo}>VALOR DO PAGAMENTO (R$) *</label>
            <input type="number" step="0.01" min="0.01" required style={estilos.entradaTexto} value={dados.valor} onChange={(e) => atualizarCampo('valor', e.target.value)} />
          </div>

          <div style={estilos.grupoEntrada}>
            <label style={estilos.rotulo}>FORMA DE PAGAMENTO *</label>
            <select style={estilos.entradaTexto} value={dados.forma_pagamento} onChange={(e) => atualizarCampo('forma_pagamento', e.target.value)}>
              <option value="PIX">PIX</option>
              <option value="CARTAO_CREDITO">CARTÃO DE CRÉDITO</option>
              <option value="CARTAO_DEBITO">CARTÃO DE DÉBITO</option>
              <option value="DINHEIRO">DINHEIRO</option>
            </select>
          </div>

          {erro && <span style={estilos.mensagemErro}>{erro}</span>}
          
          <button type="submit" style={estilos.botaoAssinar}>PROCESSAR PAGAMENTO</button>
        </form>
      </section>
    </main>
  );
}

const estilos = {
  recipiente: { minHeight: '100vh', backgroundColor: '#FFFFFF', fontFamily: '"Playfair Display", "Georgia", serif', color: '#000000', margin: 0 },
  bordaSuperiorDourada: { width: '100%', height: '4px', backgroundColor: '#C5A059' },
  bordaSuperiorFina: { width: '100%', height: '1px', backgroundColor: '#000000' },
  cabecalho: { padding: '40px 60px 20px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  linhaTopo: { width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '40px' },
  linkVoltar: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '11px', letterSpacing: '2px', color: '#000000', textDecoration: 'none', fontWeight: '600' },
  titulo: { fontSize: '36px', fontWeight: 'normal', letterSpacing: '2px', margin: '0 0 20px 0' },
  linhaDecorativa: { width: '100px', height: '1px', backgroundColor: '#C5A059', margin: '0 auto' },
  conteudo: { padding: '40px 60px', maxWidth: '600px', margin: '0 auto', width: '100%' },
  formulario: { display: 'flex', flexDirection: 'column', gap: '30px', backgroundColor: '#FAF7F2', padding: '50px', border: '1px solid #EAEAEA' },
  grupoEntrada: { display: 'flex', flexDirection: 'column', gap: '10px' },
  rotulo: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '10px', letterSpacing: '2px', color: '#333333', fontWeight: '600' },
  entradaTexto: { padding: '16px', border: '1px solid #CCCCCC', backgroundColor: '#FFFFFF', fontSize: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', outline: 'none' },
  botaoAssinar: { backgroundColor: '#000000', color: '#FFFFFF', padding: '20px', fontSize: '12px', letterSpacing: '3px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  mensagemErro: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#D93025', fontSize: '12px', textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px' }
};