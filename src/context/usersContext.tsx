import type { ApiResponse, UserData, SingleUser } from "@/context/types.ts";
import React, { useCallback, useEffect, useState } from "react";
import { UsersContext, TOKEN, type UsersContextValue } from "@/context/hooks";
import toast from "react-hot-toast";

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ApiResponse<UserData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [params, setParams] = useState<Record<string, string>>({});
  const [reload, setReload] = useState(false);

  // ----- FETCH USERS -----
  const fetchUsers = useCallback(async (signal?: AbortSignal) => {
    try {
      setError(null);

      const query = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
        ...params, // role/status
      }).toString();
      // console.log(query)

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
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setData(null);
    }
  }, [page, pageSize, params]);

  useEffect(() => {
    const ac = new AbortController();
    fetchUsers(ac.signal);
    return () => ac.abort();
  }, [fetchUsers, reload]);

  const refresh = () => setReload((s) => !s);

  // ----- SINGLE USER -----
  const viewUserPage = async (userId: number): Promise<SingleUser["user"] | null> => {
    try {
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
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      return null;
    }
  };

  // ----- EDIT STATUS -----
  const editStatus = async (userId: number, status: string): Promise<UserData | null> => {
    try {
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
      toast.success("User status updated successfully");
      refresh();
      return json.user as UserData;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      throw err;
    }
  };

  // ----- EDIT ROLE -----
  const editRole = async (userId: number, role: string): Promise<UserData | null> => {
    try {
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
      toast.success("User role updated successfully");
      refresh();
      return json.user as UserData;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      throw err;
    }
  };

  // ----- DELETE USER -----
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
      toast.success("User deleted successfully");
      return json.message || "User deleted successfully";
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ----- CONTEXT VALUE -----
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
