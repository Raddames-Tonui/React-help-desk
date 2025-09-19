import type { ApiResponse, UserData } from "@/utils/types";
import type { UserProfile } from "@/utils/types";
import { createContext, useContext, useEffect, useState } from "react";
import { Route } from "@/routes/_protected/admin/users";

const TOKEN = "0b008ea4-07fa-435f-906d-76f134078e3d-mdcedoc7";

type UsersContextValue = {
    data: ApiResponse<UserData> | null;
    users: UserData[];
    loading: boolean;
    error: string | null;
    page: number;
    pageSize: number;
    params: Record<string, string>;
    setPage: (n: number) => void;
    setPageSize: (n: number) => void;
    setParams: (params: Record<string, string>) => void;
    refresh: () => void;

    viewProfile: (userId: number) => Promise<UserProfile | null>;
    editStatus: (userId: number, status: string) => Promise<void>;
    editRole: (userId: number, role: string) => Promise<void>;
    deleteUser: (userId: number) => Promise<void>;
    navigateToUserPage: (userId: number) => void;
};

const usersContext = createContext<UsersContextValue | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<ApiResponse<UserData> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [params, setParams] = useState<Record<string, string>>({});
    const [reload, setReload] = useState(false);

    const fetchUsers = async (signal: AbortSignal) => {
        setLoading(true);
        setError(null);

        const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize), ...params }).toString();
        const url = `/api/admin/users/?${query}`;

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

            const json = (await res.json()) as ApiResponse<UserData>;
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
    }, [page, pageSize, params, reload]);

    const refresh = () => setReload((s) => !s);

    const viewProfile = async (): Promise<UserProfile | null> => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/users/profile`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    Accept: "application/json"
                },
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`Failed to fetch profile: ${res.status} ${res.statusText} ${text}`);
            }

            const json = (await res.json()) as { user: UserProfile; message: string };
            return json.user;
        } catch (err: any) {
            setError(err.message ?? "Unknown error fetching profile");
            return null;
        } finally {
            setLoading(false);
        }
    };


    const editStatus = async (userId: number, status: string): Promise<UserData | null> => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/users/${userId}/status`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`Failed to edit status: ${res.status} ${res.statusText} ${text}`);
            }
            const json = (await res.json()) as { user: UserData; message: string };

            refresh();
            return json.user;
        } catch (err: any) {
            setError(err.message ?? "Unknown error editing status");
            return null;
        } finally {
            setLoading(false);
        }
    };


    const editRole = async (userId: number, role: string): Promise<UserData | null> => {
        try {
            setLoading(true);

            const res = await fetch(`/api/admin/users/${userId}/role`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ role }),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`Failed to edit role: ${res.status} ${res.statusText} ${text}`);
            }

            const json = (await res.json()) as { user: UserData; message: string };

            refresh();
            return json.user;
        } catch (err: any) {
            setError(err.message ?? "Unknown error editing role");
            return null;
        } finally {
            setLoading(false);
        }
    };


    const deleteUser = async (userId: number): Promise<UserData | null> => {
        try {
            setLoading(true);

            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    Accept: "application/json",
                },
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`Failed to delete user: ${res.status} ${res.statusText} ${text}`);
            }

            const json = (await res.json()) as { user: UserProfile; message: string };

            refresh(); 
            return json.user; 
        } catch (err: any) {
            setError(err.message ?? "Unknown error deleting user");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // const navigateToUserPage = (userId: number) => {
    //     Route.navigate(`/admin/users/${userId}`);
    // };

    const value: UsersContextValue = {
        data,
        users: data?.records ?? [],
        loading,
        error,
        page,
        pageSize,
        params,
        setPage,
        setPageSize,
        setParams,
        refresh,
        viewProfile,
        editStatus,
        editRole,
        deleteUser,
        // navigateToUserPage,
    };

    return <usersContext.Provider value={value}>{children}</usersContext.Provider>;
};

export function useUsers() {
    const ctx = useContext(usersContext);
    if (!ctx) throw new Error("useUsers must be used within UsersProvider");
    return ctx;
}
