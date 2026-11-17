"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, definirToken] = useState(null);
  const [usuario, definirUsuario] = useState(null);
  const [carregandoAuth, definirCarregandoAuth] = useState(true);

  useEffect(() => {
    const tokenSalvo =
      window.localStorage.getItem("token") ||
      window.localStorage.getItem("token_ufci");
    const usuarioSalvo = window.localStorage.getItem("usuario");

    if (tokenSalvo) {
      definirToken(tokenSalvo);
    }
    if (usuarioSalvo) {
      definirUsuario(JSON.parse(usuarioSalvo));
    }
    definirCarregandoAuth(false);
  }, []);

  function salvarLogin(novoToken, dadosUsuario) {
    window.localStorage.setItem("token", novoToken);
    window.localStorage.setItem("token_ufci", novoToken);
    window.localStorage.setItem("usuario", JSON.stringify(dadosUsuario));
    definirToken(novoToken);
    definirUsuario(dadosUsuario);
  }

  function sair() {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("token_ufci");
    window.localStorage.removeItem("usuario");
    definirToken(null);
    definirUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, usuario, carregandoAuth, salvarLogin, sair }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
