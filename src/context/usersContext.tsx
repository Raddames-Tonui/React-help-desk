import type {
    ApiResponse,
    UserProfile,
    UserData,
    SingleUser, ApiError,
} from "@/context/types.ts";
import { useEffect, useState } from "react";
import { TOKEN, usersContext, type UsersContextValue } from "@/hooks";

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                           children,
                                                                       }) => {
    const [data, setData] = useState<ApiResponse<UserData> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [params, setParams] = useState<Record<string, string>>({});
    const [reload, setReload] = useState(false);

     const handleError = async (
        res: Response,
        fallbackMsg: string
    ): Promise<ApiError> => {
        const json = await res.json().catch(() => null);
        return {
            message: json?.error || `${fallbackMsg}: ${res.status} ${res.statusText}`,
            code: String(res.status),
            details: json,
        };
    };

    // Fetch all users
    const fetchUsers = async (signal: AbortSignal) => {
        setLoading(true);
        setError(null);

        const query = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize),
            ...params,
        }).toString();
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
                setError(await handleError(res, "Failed to fetch users"));
                setData(null);
                return;
            }

            const json = (await res.json()) as ApiResponse<UserData>;
            setData(json);
        } catch (err: any) {
            if (err.name === "AbortError") return;
            setError({
                message: err.message ?? "Unknown error",
                code: "FETCH_ERROR",
                details: err,
            });
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

    // Fetch single user details
    const viewUserPage = async (
        userId: number
    ): Promise<SingleUser["user"] | null> => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    Accept: "application/json",
                },
            });

            if (!res.ok) throw await handleError(res, "Failed to fetch user profile");

            const json = (await res.json()) as SingleUser;
            return json.user;
        } catch (err: any) {
            console.error("viewUserPage error:", err.message);
            setError(err);
            return null;
        }
    };


    // Fetch logged-in profile
    const viewProfile = async (): Promise<UserProfile | null> => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/users/profile`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    Accept: "application/json",
                },
            });

            if (!res.ok) throw await handleError(res, "Failed to fetch profile");

            const json = (await res.json()) as { user: UserProfile; message: string };
            return json.user;
        } catch (err: any) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Edit user status
    const editStatus = async (
        userId: number,
        status: string
    ): Promise<UserData | null> => {
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

            if (!res.ok) throw await handleError(res, "Failed to edit status");

            const json = (await res.json()) as { user: UserData; message: string };
            refresh();
            return json.user;
        } catch (err: any) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };


    // Edit user role
    const editRole = async (
        userId: number,
        role: string
    ): Promise<UserData | null> => {
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

            if (!res.ok) throw await handleError(res, "Failed to edit role");

            const json = (await res.json()) as { user: UserData; message: string };
            refresh();
            return json.user;
        } catch (err: any) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Delete user
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

            if (!res.ok) throw await handleError(res, "Failed to delete user");

            const json = (await res.json()) as { user: UserData; message: string };

            setData((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    records: prev.records.filter((u) => u.id !== userId),
                    total: prev.total - 1,
                };
            });

            return json.user;
        } catch (err: any) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    //
    // Provide context value
    //
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
        viewUserPage,
    };

    return (
        <usersContext.Provider value={value}>{children}</usersContext.Provider>
    );
};
