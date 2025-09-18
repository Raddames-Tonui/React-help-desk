import type { ApiResponse, UserData } from "@/utils/types"
import { createContext, useContext, useEffect, useState } from "react";

const TOKEN = "0b008ea4-07fa-435f-906d-76f134078e3d-mdcedoc7";

type UsersContextValue = {
    data: ApiResponse | null;
    users: UserData[];
    loading: boolean;
    error: string | null;
    page: number;
    pageSize: number;
    setPage: (n: number) => void;
    setPageSize: (n: number) => void;
    refresh: () => void;
}

const usersContext = createContext<UsersContextValue | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [lastPage, setLastPage] = useState<number | null>(null)
    const [reload, setReload] = useState(false);

    const fetchUsers = async (signal: AbortSignal) => {
        setLoading(true);
        setError(null);

        const url = `/api/admin/users/?page=${page}&pageSize=${pageSize}`;
        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    Accept: "application/json",
                },
                signal,
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`Failed to fetch users: ${res.status} ${res.statusText} ${text ? `- ${text}` : ""}`);
            }

            const json = (await res.json()) as ApiResponse;
            setData(json);
        } catch (err: any) {
            if (err.name === "AbortError") return;
            setError(err.message ?? "Unknown error");
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const ac = new AbortController();
        fetchUsers(ac.signal);
        return () => ac.abort();
    }, [page, pageSize, reload]);

    const refresh = () => setReload((s) => !s);

    const value: UsersContextValue = {
        data,
        users: data?.records ?? [],
        loading,
        error,
        page,
        pageSize,
        setPage,
        setPageSize,
        refresh,
    };

    return <usersContext.Provider value={value}>{children}</usersContext.Provider>;
};

export function useUsers() {
    const ctx = useContext(usersContext);
    if (!ctx) throw new Error("useUsers must be used within UsersProvider");
    return ctx;
}
