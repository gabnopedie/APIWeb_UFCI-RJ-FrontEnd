"use client";
import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';

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
      <div style={estilos.sobreposicaoConteudo}>
        <header style={estilos.cabecalhoGlass}>
          <div style={estilos.linhaTopo}>
            <Link href="/alugueis" style={estilos.linkVoltar}>← Cancelar</Link>
          </div>
          <h1 style={estilos.titulo}>Prorrogar contrato nº {unwrappedParams.id}</h1>
          <div style={estilos.linhaDecorativa}></div>
        </header>

        <section style={estilos.conteudo}>
          <form onSubmit={submeterFormulario} style={estilos.formularioGlass}>
            <Input 
              label="Dias adicionais (1 a 90) *" 
              type="number" 
              value={dias} 
              onChange={(e) => definirDias(e.target.value)} 
              required 
            />

            {erro && <span style={estilos.mensagemErro}>{erro}</span>}
            
            <Button type="submit">Confirmar prorrogação</Button>
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
    maxWidth: '600px',
    marginBottom: '30px'
  },
  linhaTopo: { display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' },
  linkVoltar: { fontSize: '14px', color: '#111111', textDecoration: 'none', fontWeight: '600' },
  titulo: { fontSize: '32px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#111111', textAlign: 'center' },
  linhaDecorativa: { width: '80px', height: '2px', backgroundColor: '#C5A059', margin: '0 auto' },
  conteudo: { width: '100%', maxWidth: '600px' },
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
  mensagemErro: { color: '#ff4d4d', fontSize: '13px', textAlign: 'center', fontWeight: '500' }
};