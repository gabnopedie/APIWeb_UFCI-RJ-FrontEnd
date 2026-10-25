"use client";
import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EstenderAluguel({ params }) {
  const unwrappedParams = use(params);
  const roteador = useRouter();
  const [dias, definirDias] = useState(7);
  const [erro, definirErro] = useState('');

  async function submeterFormulario(evento) {
    evento.preventDefault();
    definirErro('');

    const token = localStorage.getItem('token_ufci');
    if (!token) {
      roteador.push('/login');
      return;
    }

    try {
      const resposta = await fetch(`http://localhost:3000/rentals/${unwrappedParams.id}/extend`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ dias: parseInt(dias, 10) })
      });

      if (resposta.ok) {
        roteador.push('/alugueis');
      } else {
        const erroRetornado = await resposta.json();
        definirErro(erroRetornado.message || 'Falha ao prorrogar prazo.');
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
          <Link href="/alugueis" style={estilos.linkVoltar}>&#8592; CANCELAR</Link>
        </div>
        <h1 style={estilos.titulo}>Prorrogar Contrato Nº {unwrappedParams.id}</h1>
        <div style={estilos.linhaDecorativa}></div>
      </header>

      <section style={estilos.conteudo}>
        <form onSubmit={submeterFormulario} style={estilos.formulario}>
          <div style={estilos.grupoEntrada}>
            <label style={estilos.rotulo}>DIAS ADICIONAIS (1 A 90) *</label>
            <input 
              type="number" 
              min="1" 
              max="90" 
              required 
              style={estilos.entradaTexto} 
              value={dias} 
              onChange={(e) => definirDias(e.target.value)} 
            />
          </div>

          {erro && <span style={estilos.mensagemErro}>{erro}</span>}
          
          <button type="submit" style={estilos.botaoAssinar}>CONFIRMAR PRORROGAÇÃO</button>
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