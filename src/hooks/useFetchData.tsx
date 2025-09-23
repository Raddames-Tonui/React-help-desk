import { useState, useEffect, useCallback } from "react";

interface FetchOptions<T> {
  url: string;
  params?: Record<string, string | number>;
  enabled?: boolean;
  transform?: (data: any) => T;
  token?: string;
}

async function safeJson(res: Response) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export function useFetchData<T>({
  url,
  params = {},
  enabled = true,
  token,
  transform,
}: FetchOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(false);

  const query =
    params && Object.keys(params).length > 0
      ? "?" +
        new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        ).toString()
      : "";

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      if (!enabled) return;
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`${url}${query}`, {
          method: "GET",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            Accept: "application/json",
          },
          signal,
        });

        const json = await safeJson(res);
        if (!res.ok)
          throw new Error(
            (json as any).message || `Failed (status ${res.status})`
          );

        setData(transform ? transform(json) : json);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err.message || "Unknown error");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [url, query, token, enabled, transform]
  );

  useEffect(() => {
    const ac = new AbortController();
    fetchData(ac.signal);
    return () => ac.abort();
  }, [fetchData, reload]);

  const refresh = () => setReload((s) => !s);

  return { data, isLoading, error, refresh };
}
