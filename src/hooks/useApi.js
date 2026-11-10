"use client";

import { useCallback, useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000";

async function lerResposta(response) {
  if (response.status === 204) {
    return null;
  }

  const body = await response.text();
  if (!body) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return JSON.parse(body);
  }

  return body;
}

export function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const request = useCallback(async (requestEndpoint, options = {}) => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("token_ufci")
        : null;
    const headers = new Headers(options.headers);

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
    const result = await lerResposta(response);

    if (!response.ok) {
      const message =
        result &&
        typeof result === "object" &&
        "message" in result &&
        typeof result.message === "string"
          ? result.message
          : `Erro na requisição à API (${response.status})`;
      throw new Error(message);
    }

    return result;
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await request(endpoint);
      setData(result);
      return result;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : String(requestError);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint, request]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch, request };
}
