import { useState } from "react";

interface MutateOptions<T, R> {
  url: string;
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string;
  onSuccess?: (data: R) => void;
  onError?: (err: Error) => void;
  transform?: (data: any) => R;
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

export function useMutateData<T = any, R = any>({
  url,
  method = "POST",
  token,
  onSuccess,
  onError,
  transform,
}: MutateOptions<T, R>) {
  const [data, setData] = useState<R | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (body?: T): Promise<R | null> => {
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
      if (!res.ok)
        throw new Error(
          (json as any).message || `Failed (status ${res.status})`
        );

      const result = transform ? transform(json) : json;
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err: any) {
      const e = new Error(err.message || "Unknown error");
      setError(e.message);
      onError?.(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, error };
}
