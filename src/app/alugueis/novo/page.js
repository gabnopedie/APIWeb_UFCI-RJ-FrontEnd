"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NovoAluguel() {
  const roteador = useRouter();
  const [erro, definirErro] = useState('');
  const [dados, definirDados] = useState({
    id_usuario: '',
    id_jogo: '',
    quantidade: 1,
    data_prevista_devolucao: '',
    local: false,
    observacoes: ''
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
      id_usuario: parseInt(dados.id_usuario, 10),
      id_jogo: parseInt(dados.id_jogo, 10),
      quantidade: parseInt(dados.quantidade, 10),
      local: dados.local,
    };

    if (dados.data_prevista_devolucao) {
      cargaDeDados.data_prevista_devolucao = new Date(dados.data_prevista_devolucao).toISOString();
    }
    if (dados.observacoes) {
      cargaDeDados.observacoes = dados.observacoes;
    }

    try {
      const resposta = await fetch('http://localhost:3000/rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cargaDeDados)
      });

      if (resposta.ok) {
        roteador.push('/alugueis');
      } else {
        const erroRetornado = await resposta.json();
        definirErro(erroRetornado.message || 'Falha ao registrar o contrato.');
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
          <Link href="/alugueis" style={estilos.linkVoltar}>&#8592; CANCELAR OPERAÇÃO</Link>
        </div>
        <h1 style={estilos.titulo}>Formalizar Contrato</h1>
        <div style={estilos.linhaDecorativa}></div>
      </header>

      <section style={estilos.conteudo}>
        <form onSubmit={submeterFormulario} style={estilos.formulario}>
          <div style={estilos.linhaGrade}>
            <div style={estilos.grupoEntrada}>
              <label style={estilos.rotulo}>ID DO CLIENTE *</label>
              <input type="number" min="1" required style={estilos.entradaTexto} value={dados.id_usuario} onChange={(e) => atualizarCampo('id_usuario', e.target.value)} />
            </div>
            <div style={estilos.grupoEntrada}>
              <label style={estilos.rotulo}>ID DO JOGO *</label>
              <input type="number" min="1" required style={estilos.entradaTexto} value={dados.id_jogo} onChange={(e) => atualizarCampo('id_jogo', e.target.value)} />
            </div>
          </div>

          <div style={estilos.linhaGrade}>
            <div style={estilos.grupoEntrada}>
              <label style={estilos.rotulo}>QUANTIDADE *</label>
              <input type="number" min="1" required style={estilos.entradaTexto} value={dados.quantidade} onChange={(e) => atualizarCampo('quantidade', e.target.value)} />
            </div>
            <div style={estilos.grupoEntrada}>
              <label style={estilos.rotulo}>DEVOLUÇÃO PREVISTA</label>
              <input type="date" style={estilos.entradaTexto} value={dados.data_prevista_devolucao} onChange={(e) => atualizarCampo('data_prevista_devolucao', e.target.value)} />
            </div>
          </div>

          <div style={estilos.grupoEntradaUnico}>
            <label style={estilos.rotuloCaixa}>
              <input type="checkbox" style={estilos.caixaSelecao} checked={dados.local} onChange={(e) => atualizarCampo('local', e.target.checked)} />
              USO EXCLUSIVO NAS DEPENDÊNCIAS (LOCAL)
            </label>
          </div>

          <div style={estilos.grupoEntradaUnico}>
            <label style={estilos.rotulo}>OBSERVAÇÕES DO CONTRATO</label>
            <textarea maxLength="5000" style={estilos.areaTexto} value={dados.observacoes} onChange={(e) => atualizarCampo('observacoes', e.target.value)} />
          </div>

          {erro && <span style={estilos.mensagemErro}>{erro}</span>}
          
          <button type="submit" style={estilos.botaoAssinar}>EMITIR CONTRATO</button>
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
  conteudo: { padding: '40px 60px', maxWidth: '800px', margin: '0 auto', width: '100%' },
  formulario: { display: 'flex', flexDirection: 'column', gap: '30px', backgroundColor: '#FAF7F2', padding: '50px', border: '1px solid #EAEAEA' },
  linhaGrade: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  grupoEntrada: { display: 'flex', flexDirection: 'column', gap: '10px' },
  grupoEntradaUnico: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
  rotulo: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '10px', letterSpacing: '2px', color: '#333333', fontWeight: '600' },
  rotuloCaixa: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '11px', letterSpacing: '1px', color: '#000000', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: '600' },
  caixaSelecao: { width: '16px', height: '16px', accentColor: '#C5A059' },
  entradaTexto: { padding: '16px', border: '1px solid #CCCCCC', backgroundColor: '#FFFFFF', fontSize: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', outline: 'none' },
  areaTexto: { padding: '16px', border: '1px solid #CCCCCC', backgroundColor: '#FFFFFF', fontSize: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '120px', resize: 'vertical', outline: 'none' },
  botaoAssinar: { backgroundColor: '#000000', color: '#FFFFFF', padding: '20px', fontSize: '12px', letterSpacing: '3px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  mensagemErro: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#D93025', fontSize: '12px', textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px' }
};