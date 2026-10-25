"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Jogos() {
  const [jogos, definirJogos] = useState([]);
  const roteador = useRouter();

  useEffect(() => {
    async function carregarJogos() {
      const token = localStorage.getItem('token_ufci');
      
      if (!token) {
        roteador.push('/login');
        return;
      }

      try {
        const resposta = await fetch('http://localhost:3000/games', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (resposta.status === 401) {
          localStorage.removeItem('token_ufci');
          roteador.push('/login');
          return;
        }

        const json = await resposta.json();
        if (json.data) definirJogos(json.data);
      } catch (erro) {
        console.error('Erro ao buscar jogos:', erro);
      }
    }
    carregarJogos();
  }, [roteador]);

  return (
    <main style={estilos.recipiente}>
      <header style={estilos.barraSitema}>
        <div style={estilos.pontosJanela}>
          <span style={{...estilos.ponto, background: '#FF5F56'}}></span>
          <span style={{...estilos.ponto, background: '#FFBD2E'}}></span>
          <span style={{...estilos.ponto, background: '#27C93F'}}></span>
        </div>
        <span style={estilos.tituloSistema}>Módulo de Jogos</span>
      </header>

      <div style={estilos.conteudo}>
        <div style={estilos.linhaCabecalho}>
          <Link href="/" style={estilos.botaoVoltar}>← Voltar</Link>
          <h1 style={estilos.titulo}>Catálogo de Jogos</h1>
          <Link href="/jogos/novo" style={estilos.botaoAdicionar}>+ Novo Jogo</Link>
        </div>

        <div style={estilos.grade}>
          {jogos.length === 0 && <p>Carregando...</p>}
          {jogos.map(jogo => (
            <div key={jogo.id} style={estilos.cartao}>
              <h2 style={estilos.tituloCartao}>{jogo.nome}</h2>
              <p>Diária: R$ {jogo.valor_diaria}</p>
              <p>Qtd: {jogo.quantidade_disponivel} / {jogo.quantidade_total}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const estilos = {
  recipiente: { minHeight: '100vh', background: '#ffffff', fontFamily: 'sans-serif', color: '#333', margin: 0 },
  barraSitema: { height: '38px', background: '#f5f5f5', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', padding: '0 16px' },
  pontosJanela: { display: 'flex', gap: '8px' },
  ponto: { width: '12px', height: '12px', borderRadius: '50%' },
  tituloSistema: { position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '13px', color: '#666' },
  conteudo: { padding: '40px' },
  linhaCabecalho: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  botaoVoltar: { padding: '8px 16px', border: '1px solid #D4AF37', borderRadius: '4px', textDecoration: 'none', color: '#333', fontWeight: 'bold' },
  botaoAdicionar: { padding: '8px 16px', background: '#111', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', marginLeft: 'auto' },
  titulo: { fontSize: '24px' },
  grade: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  cartao: { padding: '20px', border: '2px solid #D4AF37', borderRadius: '8px', background: '#fafafa' },
  tituloCartao: { margin: '0 0 10px 0', fontSize: '18px' }
};