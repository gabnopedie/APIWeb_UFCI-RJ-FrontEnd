"use client";

import { useCallback, useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000";

export function useApi(endpoint, { autoFetch = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (requestEndpoint, options = {}) => {
      const headers = new Headers(options.headers);
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("token_ufci")
          : null;

      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const response = await fetch(`${API_BASE_URL}${requestEndpoint}`, {
        ...options,
        headers,
      });

      let resultado = null;
      if (response.status !== 204) {
        const texto = await response.text();
        if (texto) {
          resultado = response.headers
            .get("content-type")
            ?.includes("application/json")
            ? JSON.parse(texto)
            : texto;
        }
      }

      if (!response.ok) {
        const mensagem =
          resultado &&
          typeof resultado === "object" &&
          typeof resultado.message === "string"
            ? resultado.message
            : `Erro na requisição à API (${response.status})`;
        throw new Error(mensagem);
      }

      return resultado;
    },
    [],
  );

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await request(endpoint);
      setData(resultado);
      return resultado;
    } catch (erroRequisicao) {
      const mensagem =
        erroRequisicao instanceof Error
          ? erroRequisicao.message
          : String(erroRequisicao);
      setError(mensagem);
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint, request]);

  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch]);

  return { data, loading, error, refetch, request };
}
