export type Role = 'admin' | 'client' | 'vendor' | 'trainee';

export interface User {
    firstname: string;
    lastname: string;
    email: string;
    role: Role;
    password: string;
    company: string;
}

export interface AuthContextType {
    user: Omit<User, 'password'> | null;
    register: (data: User) => Promise<void>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    resetPassword: (email: string, newPassword: string) => Promise<void>;
    getUser: () => Omit<User, 'password'> | null;
}



// -------DOJO API USERS ---------------
export type UserData = {
    id: number;
    email: string;
    name: string;
    role: string;
    status: string;
    avatar_url: string;
    created_at: string; 
}

export type ApiResponse = {
    domain: string;
    current_page: number;
    last_page: number;
    page_size: number;
    total_count: number;
    records: UserData[];
}
