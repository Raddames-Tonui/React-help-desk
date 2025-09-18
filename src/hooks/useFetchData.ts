import { useEffect, useState } from "react";

interface ApiResponse<T> {
  domain: string;
  current_page: number;
  last_page: number;
  page_size: number;
  total_count: number;
  records: T[];
}

export function useFetchData<T>(url: string, token: string) {
  const [data, setData] = useState<ApiResponse<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [url, token]);

  return { data, loading, error };
}
