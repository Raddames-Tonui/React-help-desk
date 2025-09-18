import { useState } from "react";

const { createContext } = require("react");

interface User {
    [key: string ]: any
}

interface AuthContextType {
    user: User | null;
    login: (data: User) => void;
    logout: () => void;
    getUser: () => User | null;
}

const AuthContext = createContext < AuthContextType | undefined > (undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState < User | null > (() => {
        const stored = sessionStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    })
}

const login = (data: User) => {
    const 
}