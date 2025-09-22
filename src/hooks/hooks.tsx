import { createContext, useContext } from "react";
import type {
    ApiResponse,  SingleSubjectData,
    SingleUser, SubjectData, SubjectPayload, TaskData, TaskPayload, User,
    UserData,
} from "@/context/types.ts";

// export const TOKEN =
//     "0b008ea4-07fa-435f-906d-76f134078e3d-mdcedoc7";

    export const TOKEN = import.meta.env.VITE_TOKEN;


// ----------- AUTH CONTEXT------------

export interface AuthContextType {
    user: Omit<User, 'password'> | null;
    register: (data: User) => Promise<void>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    resetPassword: (email: string, newPassword: string) => Promise<void>;
    getUser: () => Omit<User, 'password'> | null;
    isLoading:  boolean;
    error: string | null;
    fetchUserProfile: () => Promise<Omit<User, 'password'> | null>

}



export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};


// -------- USERS CONTEXT--------------------------
export type UsersContextValue = {
    data: ApiResponse<UserData> | null;
    users: UserData[];
    isLoading: boolean;
    error: string | null;

    page: number;
    pageSize: number;
    params: Record<string, string>;

    setPage: (n: number) => void;
    setPageSize: (n: number) => void;
    setParams: (params: Record<string, string>) => void;
    refresh: () => void;

    viewUserPage: (userId: number) => Promise<SingleUser["user"] | null>;
    editStatus: (userId: number, status: string) => Promise<UserData | null>;
    editRole: (userId: number, role: string) => Promise<UserData | null>;
    deleteUser: (userId: number) => Promise<string>;
};

export const UsersContext = createContext<UsersContextValue | undefined>(undefined);

export function useUsers() {
    const ctx = useContext(UsersContext);
    if (!ctx) throw new Error("useUsers must be used within a UsersProvider");
    return ctx;
}


// -------- SUBJECTS CONTEXT-----------------------

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

    fetchSingleSubject: (subjectId: number) => Promise<SingleSubjectData | null>;
    createSubject: (payload: SubjectPayload) => Promise<SingleSubjectData | null>;
    updateSubject: (
        subjectId: number,
        payload: SubjectPayload
    ) => Promise<SingleSubjectData | null>;
    deleteSubject: (subjectId: number) => Promise<string>;
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




// ---------- TASKS CONTEXT ------------------

export type TasksContextValue = {
  tasksData: ApiResponse<TaskData> | null;
  tasks: TaskData[];
  isLoading: boolean;
  error: string | null;

  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setParams: (params: Record<string, string>) => void;
  refresh: () => void;

  fetchTasksBySubject: (subjectId: number) => Promise<TaskData[] | null>;
  fetchSingleTask: (taskId: number) => Promise<TaskData | null>;
  createTask: (payload: TaskPayload) => Promise<TaskData | null>;
  updateTask: (
    taskId: number,
    payload: TaskPayload
  ) => Promise<TaskData | null>;
  deleteTask: (taskId: number) => Promise<string>;
};

export const TasksContext = createContext<TasksContextValue | undefined>(
  undefined
);

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within a TasksProvider");
  return ctx;
}