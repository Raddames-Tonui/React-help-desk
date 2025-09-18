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
