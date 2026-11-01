"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

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
      <div style={estilos.sobreposicaoConteudo}>
        <header style={estilos.cabecalhoGlass}>
          <div style={estilos.linhaTopo}>
            <Link href="/alugueis" style={estilos.linkVoltar}>&#8592; Cancelar operação</Link>
          </div>
          <h1 style={estilos.titulo}>Formalizar contrato</h1>
          <div style={estilos.linhaDecorativa}></div>
        </header>

        <section style={estilos.conteudo}>
          <form onSubmit={submeterFormulario} style={estilos.formularioGlass}>
            <div style={estilos.linhaGrade}>
              <Input 
                label="ID do cliente *" 
                type="number" 
                value={dados.id_usuario} 
                onChange={(e) => atualizarCampo('id_usuario', e.target.value)} 
                required 
              />
              <Input 
                label="ID do jogo *" 
                type="number" 
                value={dados.id_jogo} 
                onChange={(e) => atualizarCampo('id_jogo', e.target.value)} 
                required 
              />
            </div>

            <div style={estilos.linhaGrade}>
              <Input 
                label="Quantidade *" 
                type="number" 
                value={dados.quantidade} 
                onChange={(e) => atualizarCampo('quantidade', e.target.value)} 
                required 
              />
              <Input 
                label="Devolução prevista" 
                type="date" 
                value={dados.data_prevista_devolucao} 
                onChange={(e) => atualizarCampo('data_prevista_devolucao', e.target.value)} 
              />
            </div>

            <div style={estilos.grupoEntradaUnico}>
              <label style={estilos.rotuloCaixa}>
                <input type="checkbox" style={estilos.caixaSelecao} checked={dados.local} onChange={(e) => atualizarCampo('local', e.target.checked)} />
                Uso exclusivo nas dependências (local)
              </label>
            </div>

            <div style={estilos.grupoEntradaUnico}>
              <label style={estilos.rotuloSimples}>Observações do contrato</label>
              <textarea maxLength="5000" style={estilos.areaTexto} value={dados.observacoes} onChange={(e) => atualizarCampo('observacoes', e.target.value)} />
            </div>

            {erro && <span style={estilos.mensagemErro}>{erro}</span>}
            
            <Button type="submit">Emitir contrato</Button>
          </form>
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
  linhaTopo: { display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' },
  linkVoltar: { fontSize: '14px', color: '#111111', textDecoration: 'none', fontWeight: '600' },
  titulo: { fontSize: '32px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#111111', textAlign: 'center' },
  linhaDecorativa: { width: '80px', height: '2px', backgroundColor: '#C5A059', margin: '0 auto' },
  conteudo: { width: '100%', maxWidth: '800px' },
  formularioGlass: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '24px', 
    backgroundColor: 'rgba(20, 20, 20, 0.70)', 
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    padding: '40px', 
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' 
  },
  linhaGrade: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  grupoEntradaUnico: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' },
  rotuloSimples: { fontSize: '13px', letterSpacing: '0.5px', color: '#d1d1d1', fontWeight: '500' },
  rotuloCaixa: { fontSize: '14px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: '500' },
  caixaSelecao: { width: '18px', height: '18px', accentColor: '#C5A059' },
  areaTexto: { 
    padding: '14px', 
    borderRadius: '8px', 
    border: '1px solid rgba(255, 255, 255, 0.15)', 
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    color: '#ffffff', 
    fontSize: '15px', 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
    minHeight: '120px', 
    resize: 'vertical', 
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  },
  mensagemErro: { color: '#ff4d4d', fontSize: '13px', textAlign: 'center', fontWeight: '500' }
};