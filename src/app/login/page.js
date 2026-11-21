"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../../components/Input';
import Button from '../../components/Button';

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
        <h1 style={estilos.tituloMarca}>Sistema de Aluguel de Jogos de Tabuleiro</h1>
        <span style={estilos.subtituloMarca}>Programação WeB | UFCI - RJ</span>
      </header>

      <section style={estilos.conteudo}>
        <form onSubmit={lidarComLogin} style={estilos.formulario}>
          <h2 style={estilos.tituloFormulario}>Seu Acesso</h2>
          
          <Input 
            label="E-mail"
            type="email" 
            value={email} 
            onChange={(e) => definirEmail(e.target.value)} 
            required 
          />

          <Input 
            label="Senha"
            type="password" 
            value={senha} 
            onChange={(e) => definirSenha(e.target.value)} 
            required 
          />

          {erro && <span style={estilos.mensagemErro}>{erro}</span>}

          <Button type="submit">Entrar no sistema</Button>
        </form>
      </section>
    </main>
  );
}

const estilos = {
  recipiente: { minHeight: '100vh', backgroundColor: 'transparent', fontFamily: 'var(--font-serif), Georgia, serif', color: '#ffffff', margin: 0, display: 'flex', flexDirection: 'column' },
  bordaSuperiorDourada: { width: '100%', height: '4px', backgroundColor: '#aeb6bf' },
  bordaSuperiorFina: { width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.16)' },
  cabecalho: { padding: '60px 20px 20px 20px', textAlign: 'center' },
  tituloMarca: { fontSize: '28px', fontWeight: 'normal', letterSpacing: '3px', margin: '0 0 10px 0' },
  subtituloMarca: { fontFamily: 'var(--font-serif), Georgia, serif', fontSize: '11px', letterSpacing: '4px', fontWeight: '600' },
  conteudo: { padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 },
  formulario: { display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'rgba(15, 18, 22, 0.82)', backdropFilter: 'blur(16px) saturate(120%)', padding: 'clamp(1.25rem, 5vw, 3.125rem)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)', width: '100%', maxWidth: '450px' },
  tituloFormulario: { fontSize: '24px', fontWeight: 'normal', textAlign: 'center', margin: '0 0 10px 0' },
  mensagemErro: { fontFamily: 'var(--font-serif), Georgia, serif', color: '#D93025', fontSize: '11px', textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px' }
};