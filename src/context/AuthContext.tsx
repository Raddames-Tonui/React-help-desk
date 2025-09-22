import { useNavigate } from '@tanstack/react-router';
import { type ReactNode, useState } from "react";
import type { User } from "@/context/types.ts";
import { AuthContext, TOKEN } from "@/context/hooks";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState<Omit<User, 'password'> | null>(() => {
        const stored = sessionStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --------- REGISTER ---------
    const register = async (newUser: User) => {
        const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];
        if (users.find(u => u.email === newUser.email)) throw new Error("User already exists");

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
    };

    // --------- LOGIN ---------
    const login = async (email: string, password: string): Promise<boolean> => {
        const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];
        const found = users.find(u => u.email === email);
        if (!found) return false;

        if (found.password === password) {
            const { password: _, ...safeUser } = found;

            if (safeUser.role === "admin") {
                const fetchedProfile = await fetchUserProfile();
                if (!fetchedProfile) return false;

                // Add company manually
                const updatedUser = { ...fetchedProfile, company: "Sky World Limited" };
                sessionStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
            } else {
                // Non-admin roles: use local user
                sessionStorage.setItem("user", JSON.stringify(safeUser));
                setUser(safeUser);
            }

            if (safeUser.role === "admin") navigate({ to: "/admin" });
            else if (safeUser.role === "vendor") navigate({ to: "/vendor" });
            else if (safeUser.role === "client") navigate({ to: "/client" });
            else if (safeUser.role === "trainee") navigate({ to: "/trainee" });

            return true;
        }

        return false;
    };

    // --------- FETCH USER PROFILE ---------
    const fetchUserProfile = async (): Promise<Omit<User, 'password'> | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/admin/users/profile", {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    Accept: "application/json",
                },
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || "Failed to fetch user profile");

            const fetchedUser: Omit<User, "password"> = json.user;
            return fetchedUser;
        } catch (err: any) {
            setError(err instanceof Error ? err.message : "Unknown error");
            return null;
        } finally {
            setIsLoading(false);
        }
    };


    // --------- LOGOUT ---------
    const logout = () => {
        sessionStorage.removeItem("user");
        setUser(null);
        navigate({ to: "/auth/login" });
    };

    // --------- RESET PASSWORD ---------
    const resetPassword = async (email: string, newPassword: string) => {
        const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];
        const index = users.findIndex(u => u.email === email);
        if (index === -1) throw new Error("User not found");

        users[index].password = newPassword;
        localStorage.setItem("users", JSON.stringify(users));
    };

    // --------- GET USER ---------
    const getUser = () => user;


    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                register,
                login,
                logout,
                resetPassword,
                getUser,
                fetchUserProfile
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
