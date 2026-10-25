"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const roteador = useRouter();
  const [email, definirEmail] = useState('');
  const [senha, definirSenha] = useState('');
  const [erro, definirErro] = useState('');

  async function lidarComLogin(evento) {
    evento.preventDefault();
    definirErro('');

    try {
      const resposta = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        const token = dados.access_token || dados.token;
        if (token) {
          localStorage.setItem('token_ufci', token);
          roteador.push('/');
        } else {
          definirErro('Token não retornado pelo servidor.');
        }
      } else {
        const erroRetornado = await resposta.json();
        definirErro(erroRetornado.message || 'Credenciais inválidas.');
      }
    } catch (falha) {
      definirErro('Erro de ligação ao servidor.');
    }
  }

  return (
    <main style={estilos.recipiente}>
      <div style={estilos.bordaSuperiorDourada}></div>
      <div style={estilos.bordaSuperiorFina}></div>

      <header style={estilos.cabecalho}>
        <h1 style={estilos.tituloMarca}>SISTEMA DE ALUGUEL DE JOGOS DE TABULEIRO</h1>
        <span style={estilos.subtituloMarca}>Programação WeB | UFCI - RJ</span>
      </header>

      <section style={estilos.conteudo}>
        <form onSubmit={lidarComLogin} style={estilos.formulario}>
          <h2 style={estilos.tituloFormulario}>Seu Acesso</h2>
          
          <div style={estilos.grupoEntrada}>
            <label style={estilos.rotulo}>E-MAIL</label>
            <input 
              type="email" 
              required 
              style={estilos.entradaTexto} 
              value={email} 
              onChange={(e) => definirEmail(e.target.value)} 
            />
          </div>

          <div style={estilos.grupoEntrada}>
            <label style={estilos.rotulo}>SENHA</label>
            <input 
              type="password" 
              required 
              style={estilos.entradaTexto} 
              value={senha} 
              onChange={(e) => definirSenha(e.target.value)} 
            />
          </div>

          {erro && <span style={estilos.mensagemErro}>{erro}</span>}

          <button type="submit" style={estilos.botaoEntrar}>ENTRAR NO SISTEMA</button>
        </form>
      </section>
    </main>
  );
}

const estilos = {
  recipiente: { minHeight: '100vh', backgroundColor: '#FFFFFF', fontFamily: '"Playfair Display", "Georgia", serif', color: '#000000', margin: 0, display: 'flex', flexDirection: 'column' },
  bordaSuperiorDourada: { width: '100%', height: '4px', backgroundColor: '#C5A059' },
  bordaSuperiorFina: { width: '100%', height: '1px', backgroundColor: '#000000' },
  cabecalho: { padding: '60px 20px 20px 20px', textAlign: 'center' },
  tituloMarca: { fontSize: '28px', fontWeight: 'normal', letterSpacing: '3px', margin: '0 0 10px 0' },
  subtituloMarca: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '11px', letterSpacing: '4px', fontWeight: '600' },
  conteudo: { padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 },
  formulario: { display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: '#FAF7F2', padding: '50px', border: '1px solid #EAEAEA', width: '100%', maxWidth: '450px' },
  tituloFormulario: { fontSize: '24px', fontWeight: 'normal', textAlign: 'center', margin: '0 0 10px 0' },
  grupoEntrada: { display: 'flex', flexDirection: 'column', gap: '8px' },
  rotulo: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '10px', letterSpacing: '2px', color: '#333333', fontWeight: '600' },
  entradaTexto: { padding: '14px', border: '1px solid #CCCCCC', backgroundColor: '#FFFFFF', fontSize: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', outline: 'none' },
  botaoEntrar: { backgroundColor: '#000000', color: '#FFFFFF', padding: '16px', fontSize: '11px', letterSpacing: '2px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  mensagemErro: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#D93025', fontSize: '11px', textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px' }
};