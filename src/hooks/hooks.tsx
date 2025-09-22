import { useCallback, useState } from "react";


export function usePagination(initialPage = 1, initialPageSize = 10) {
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [params, setParams] = useState<Record<string, string>>({});
    const [reload, setReload] = useState(false);


    const refresh = () => setReload((s) => !s);
    return {
        page, setPage, pageSize, setPageSize, params, setParams, reload, setReload, refresh
    };
}


export function useApi(baseUrl: string, token: string): {
    isLoading: boolean;
    error: string | null;
    request: (url: string, options?: RequestInit) => Promise<any>;
} {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const request = useCallback(async (url: string, options: RequestInit = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    ...options.headers
                },
                ...options
            })
            const json = await res.json();

            if (!res.ok) throw new Error(json.message || `Request failed (status ${res.status})`);
            return json;
        } catch (err: any) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [baseUrl, token]);
    
    return {isLoading, error, request};
}