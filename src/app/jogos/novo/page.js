"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NovoJogo() {
  const roteador = useRouter();
  const [erro, definirErro] = useState('');
  const [dados, definirDados] = useState({
    nome: '',
    descricao: '',
    valor_diaria: '',
    quantidade_total: '',
    ano_lancamento: '',
    numero_jogadores_min: '',
    numero_jogadores_max: '',
    idade_minima: '',
    duracao_minutos: '',
    complexidade: ''
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
      nome: dados.nome,
      valor_diaria: parseFloat(dados.valor_diaria),
      quantidade_total: parseInt(dados.quantidade_total, 10),
    };

    if (dados.descricao) cargaDeDados.descricao = dados.descricao;
    if (dados.ano_lancamento) cargaDeDados.ano_lancamento = parseInt(dados.ano_lancamento, 10);
    if (dados.numero_jogadores_min) cargaDeDados.numero_jogadores_min = parseInt(dados.numero_jogadores_min, 10);
    if (dados.numero_jogadores_max) cargaDeDados.numero_jogadores_max = parseInt(dados.numero_jogadores_max, 10);
    if (dados.idade_minima) cargaDeDados.idade_minima = parseInt(dados.idade_minima, 10);
    if (dados.duracao_minutos) cargaDeDados.duracao_minutos = parseInt(dados.duracao_minutos, 10);
    if (dados.complexidade) cargaDeDados.complexidade = parseInt(dados.complexidade, 10);

    try {
      const resposta = await fetch('http://localhost:3000/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cargaDeDados)
      });

      if (resposta.ok) {
        roteador.push('/jogos');
      } else {
        const erroRetornado = await resposta.json();
        definirErro(erroRetornado.message || 'Falha ao cadastrar o jogo.');
      }
    } catch (falha) {
      definirErro('Falha de conexão com o servidor.');
    }
  }

  return (
    <main style={estilos.recipiente}>
      <header style={estilos.barraSitema}>
        <div style={estilos.pontosJanela}>
          <span style={{...estilos.ponto, background: '#FF5F56'}}></span>
          <span style={{...estilos.ponto, background: '#FFBD2E'}}></span>
          <span style={{...estilos.ponto, background: '#27C93F'}}></span>
        </div>
        <span style={estilos.tituloSistema}>Cadastro de Jogo</span>
      </header>

      <div style={estilos.conteudo}>
        <div style={estilos.linhaCabecalho}>
          <Link href="/jogos" style={estilos.botaoVoltar}>← Voltar</Link>
          <h1 style={estilos.titulo}>Adicionar Novo Jogo</h1>
        </div>

        <form onSubmit={submeterFormulario} style={estilos.formulario}>
          <div style={estilos.grupoGrade}>
            <input 
              type="text" 
              placeholder="Nome do Jogo *" 
              required 
              style={estilos.entrada}
              value={dados.nome}
              onChange={(e) => atualizarCampo('nome', e.target.value)}
            />
            <input 
              type="number" 
              step="0.01" 
              min="0.01" 
              placeholder="Valor da Diária *" 
              required 
              style={estilos.entrada}
              value={dados.valor_diaria}
              onChange={(e) => atualizarCampo('valor_diaria', e.target.value)}
            />
            <input 
              type="number" 
              min="1" 
              placeholder="Quantidade Total *" 
              required 
              style={estilos.entrada}
              value={dados.quantidade_total}
              onChange={(e) => atualizarCampo('quantidade_total', e.target.value)}
            />
            <input 
              type="number" 
              min="1901" 
              max="2155" 
              placeholder="Ano de Lançamento" 
              style={estilos.entrada}
              value={dados.ano_lancamento}
              onChange={(e) => atualizarCampo('ano_lancamento', e.target.value)}
            />
            <input 
              type="number" 
              min="1" 
              placeholder="Jogadores Mínimo" 
              style={estilos.entrada}
              value={dados.numero_jogadores_min}
              onChange={(e) => atualizarCampo('numero_jogadores_min', e.target.value)}
            />
            <input 
              type="number" 
              min="1" 
              placeholder="Jogadores Máximo" 
              style={estilos.entrada}
              value={dados.numero_jogadores_max}
              onChange={(e) => atualizarCampo('numero_jogadores_max', e.target.value)}
            />
            <input 
              type="number" 
              min="0" 
              placeholder="Idade Mínima" 
              style={estilos.entrada}
              value={dados.idade_minima}
              onChange={(e) => atualizarCampo('idade_minima', e.target.value)}
            />
            <input 
              type="number" 
              min="1" 
              placeholder="Duração (minutos)" 
              style={estilos.entrada}
              value={dados.duracao_minutos}
              onChange={(e) => atualizarCampo('duracao_minutos', e.target.value)}
            />
            <input 
              type="number" 
              min="1" 
              max="5" 
              placeholder="Complexidade (1 a 5)" 
              style={estilos.entrada}
              value={dados.complexidade}
              onChange={(e) => atualizarCampo('complexidade', e.target.value)}
            />
          </div>
          
          <textarea 
            placeholder="Descrição do jogo" 
            maxLength="5000"
            style={estilos.areaTexto}
            value={dados.descricao}
            onChange={(e) => atualizarCampo('descricao', e.target.value)}
          />

          {erro && <span style={estilos.mensagemErro}>{erro}</span>}
          
          <button type="submit" style={estilos.botaoSalvar}>Salvar Jogo</button>
        </form>
      </div>
    </main>
  );
}

const estilos = {
  recipiente: { minHeight: '100vh', background: '#f9f9fb', fontFamily: 'sans-serif', color: '#333', margin: 0 },
  barraSitema: { height: '38px', background: '#ffffff', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', padding: '0 16px' },
  pontosJanela: { display: 'flex', gap: '8px' },
  ponto: { width: '12px', height: '12px', borderRadius: '50%' },
  tituloSistema: { position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '13px', color: '#666' },
  conteudo: { padding: '40px', maxWidth: '800px', margin: '0 auto' },
  linhaCabecalho: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  botaoVoltar: { padding: '8px 16px', background: '#fff', border: '1px solid #D4AF37', borderRadius: '8px', textDecoration: 'none', color: '#333', fontWeight: 'bold' },
  titulo: { fontSize: '24px' },
  formulario: { display: 'flex', flexDirection: 'column', gap: '20px', background: '#ffffff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  grupoGrade: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  entrada: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' },
  areaTexto: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', minHeight: '100px', resize: 'vertical' },
  botaoSalvar: { background: '#111', color: '#fff', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' },
  mensagemErro: { color: '#FF5F56', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }
};