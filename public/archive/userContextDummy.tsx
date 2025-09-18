import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { ApiResponse, UserData } from "@/utils/types";

const TOKEN = "0b008ea4-07fa-435f-906d-76f134078e3d-mdcedoc7";

// --- State & Actions ---
type State = {
  data: ApiResponse | null;
  users: UserData[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: ApiResponse }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number };

// --- Reducer ---
function usersReducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload, users: action.payload.records };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload, data: null, users: [] };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload, page: 1 }; // reset to page 1
    default:
      return state;
  }
}

// --- Context ---
type UsersContextValue = State & {
  refresh: () => void;
  setPage: (n: number) => void;
  setPageSize: (n: number) => void;
};

const usersContext = createContext<UsersContextValue | undefined>(undefined);

// --- Provider ---
export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, {
    data: null,
    users: [],
    loading: true,
    error: null,
    page: 1,
    pageSize: 10,
  });

  const fetchUsers = async (signal: AbortSignal) => {
    dispatch({ type: "FETCH_START" });

    try {
      const res = await fetch(`/api/admin/users/?page=${state.page}&pageSize=${state.pageSize}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        },
        signal,
      });

      if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);

      const json = (await res.json()) as ApiResponse;
      dispatch({ type: "FETCH_SUCCESS", payload: json });
    } catch (err: any) {
      if (err.name !== "AbortError") {
        dispatch({ type: "FETCH_ERROR", payload: err.message ?? "Unknown error" });
      }
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchUsers(ac.signal);
    return () => ac.abort();
  }, [state.page, state.pageSize]);

  const refresh = () => fetchUsers(new AbortController().signal);

  const value: UsersContextValue = {
    ...state,
    refresh,
    setPage: (n) => dispatch({ type: "SET_PAGE", payload: n }),
    setPageSize: (n) => dispatch({ type: "SET_PAGE_SIZE", payload: n }),
  };

  return <usersContext.Provider value={value}>{children}</usersContext.Provider>;
};

// --- Hook ---
export function useUsers() {
  const ctx = useContext(usersContext);
  if (!ctx) throw new Error("useUsers must be used within UsersProvider");
  return ctx;
}
