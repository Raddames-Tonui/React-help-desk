import { useState } from "react";

interface MutateOptions<TRequest, TResponse> {
  url: string;
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string;
  onSuccess?: (data: TResponse) => void;
  onError?: (err: Error) => void;
  transform?: (data: unknown) => TResponse;
}

async function safeJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export function useMutateData<TRequest = unknown, TResponse = unknown>({
  url,
  method = "POST",
  token,
  onSuccess,
  onError,
  transform,
}: MutateOptions<TRequest, TResponse>) {
  const [data, setData] = useState<TResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (body?: TRequest): Promise<TResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const json = await safeJson(res);

      if (!res.ok) {
        const msg =
          (json as { message?: string }).message ||
          `Failed (status ${res.status})`;
        throw new Error(msg);
      }

      const result = transform ? transform(json) : (json as TResponse);
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Unknown error");
      setError(e.message);
      onError?.(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, error };
}














// 5. Use Utility Types

// TS gives you tools so you don’t need any:
// Partial<T> → all props optional

// Pick<T, K> → only some props

// Omit<T, K> → everything except some props

// Record<K, T> → map keys to a type