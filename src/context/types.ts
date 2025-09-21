export type Role = 'admin' | 'client' | 'vendor' | 'trainee';

export interface User {
    name: string;
    firstname: string;
    lastname: string;
    email: string;
    role: Role;
    password: string;
    company: string;
    status: string;
}



// ----------- GENERIC API RESPONSE -----------
export type ApiResponse<T> = {
    domain: string;
    current_page: number;
    last_page: number;
    page_size: number;
    total_count: number;
    records: T[];
}

export type ApiError = {
    message: string;
    code?: string;
    details?: any;
};


// type UserApiResponse = ApiResponse<UserData>;
// type SubjectApiResponse = ApiResponse<SubjectData>;

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

export type UserProfile = {
    id: number;
    email: string;
    name: string;
    role: string;
    status: string;
}

export type SingleUser = {
    user: {
        id: number;
        email: string;
        name: string;
        google_id: string;
        role: "admin" | "trainee";
        status: "approved" | "pending" | "rejected";
        avatar_url: string | null;
        created_at: string;
        updated_at: string;
    };
    message: string;
};



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

export type SingleSubjectData = {
    subject : {
        id : number;
        name: string;
        description: string;
        created_by: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        created_by_name: string;
    },
    message: string;
}


export type SubjectPayload = {
    name: string;
    description: string;
}

