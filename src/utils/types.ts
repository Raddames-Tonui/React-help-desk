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
export type ApiResponse<T> = {
    domain: string;
    current_page: number;
    last_page: number;
    page_size: number;
    total_count: number;
    records: T[];
}
// type UserApiResponse = ApiResponse<UserData>;
// type SubjectApiResponse = ApiResponse<SubjectData>;


export type UserData = {
    id: number;
    email: string;
    name: string;
    role: string;
    status: string;
    avatar_url: string;
    created_at: string; 
}

export type UserProfile = {
    id: number;
    email: string;
    name: string;
    role: string;
    status: string;
}


// --------DOJO SUBJECTS API ------------
export type SubjectData = {
    id: number;
    name: string;
    description: string;
    created_by: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    created_by_name: string;
}

