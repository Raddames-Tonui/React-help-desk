import { createContext, useContext } from "react";
import type {ApiError, ApiResponse, SubjectData, UserProfile} from "@/context/types.ts";
import type { SingleUser, UserData} from "@/context/types.ts";

export const TOKEN = "0b008ea4-07fa-435f-906d-76f134078e3d-mdcedoc7";


// --------USERS -------------------------
export type UsersContextValue = {
    data: ApiResponse<UserData> | null;
    users: UserData[];
    loading: boolean;
    error: ApiError | null;
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
    viewUserPage: (userId: number) => Promise<SingleUser["user"] | null>;
};

export const usersContext = createContext<UsersContextValue | undefined>(undefined);

export function useUsers() {
    const ctx = useContext(usersContext);
    if (!ctx) throw new Error("useUsers must be used within UsersProvider");
    return ctx;
}

// -------- SUBJECTS----------------------
export type SubjectContextValue = {
    subjectData: ApiResponse<SubjectData> | null;
    subjects: SubjectData[];
    isLoading: boolean;
    error: string | null;
    page: number;
    pageSize: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setParams: (params: Record<string, string>) => void;
    refresh: () => void;
};

export const SubjectContext = createContext<SubjectContextValue | undefined>(
    undefined
);

export const useSubjects = () => {
    const ctx = useContext(SubjectContext);
    if (!ctx) {
        throw new Error("useSubjects must be used within a SubjectProvider");
    }
    return ctx;
};
