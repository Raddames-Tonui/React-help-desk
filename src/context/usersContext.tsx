import type { ApiResponse, UserData, SingleUser } from "@/context/types.ts";
import React, { useEffect, useState } from "react";
import { UsersContext, TOKEN, type UsersContextValue } from "@/hooks/hooks.tsx";

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<ApiResponse<UserData> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [params, setParams] = useState<Record<string, string>>({});
    const [reload, setReload] = useState(false);

    // ------------------- FETCH ALL USERS -------------------
    const fetchUsers = async (signal?: AbortSignal) => {
        try {
            setIsLoading(true);
            setError(null);

            const query = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
                ...params,
            }).toString();

            const res = await fetch(`/api/admin/users/?${query}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    Accept: "application/json",
                },
                signal,
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.message || `Failed to fetch users (status ${res.status})`);

            setData(json as ApiResponse<UserData>);
        } catch (err) {
            if ((err as any)?.name === "AbortError") return;
            setError(err instanceof Error ? err.message : "Unknown error");
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const ac = new AbortController();
        fetchUsers(ac.signal);
        return () => ac.abort();
    }, [page, pageSize, params, reload]);

    const refresh = () => setReload((s) => !s);

    // ------------------- FETCH SINGLE USER -------------------
    const viewUserPage = async (userId: number): Promise<SingleUser["user"] | null> => {
        try {
            setIsLoading(true);
            setError(null);

            const res = await fetch(`/api/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    Accept: "application/json",
                },
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json?.message || "Failed to fetch user profile");
            }

            const json = (await res.json()) as SingleUser;
            return json.user;
        } catch (err: any) {
            setError(err instanceof Error ? err.message : "Unknown error");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // ------------------- EDIT STATUS -------------------
    const editStatus = async (userId: number, status: string): Promise<UserData | null> => {
        try {
            setIsLoading(true);

            const res = await fetch(`/api/admin/users/${userId}/status`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ status }),
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.message || `Failed to edit status (status ${res.status})`);

            refresh();
            return json.user as UserData;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // ------------------- EDIT ROLE -------------------
    const editRole = async (userId: number, role: string): Promise<UserData | null> => {
        try {
            setIsLoading(true);

            const res = await fetch(`/api/admin/users/${userId}/role`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ role }),
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.message || `Failed to edit role (status ${res.status})`);

            refresh();
            return json.user as UserData;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // ------------------- DELETE USER -------------------
    const deleteUser = async (userId: number): Promise<string> => {
        try {
            setIsLoading(true);

            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    Accept: "application/json",
                },
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.message || `Failed to delete user (status ${res.status})`);

            setData((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    records: prev.records.filter((u) => u.id !== userId),
                    total: prev.total - 1,
                };
            });

            return json.message || "User deleted successfully";
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const value: UsersContextValue = {
        data,
        users: data?.records ?? [],
        isLoading,
        error,
        page,
        pageSize,
        params,
        setPage,
        setPageSize,
        setParams,
        refresh,
        viewUserPage,
        editStatus,
        editRole,
        deleteUser,
    };

    return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
};
