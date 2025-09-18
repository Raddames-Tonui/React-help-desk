import { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { User, AuthContextType } from '@/utils/types';
import { getAllUsers, saveAllUsers } from '@/utils/utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<Omit<User, 'password'> | null>(() => {
        const stored = sessionStorage.getItem('user');
        if (stored) {
            return JSON.parse(stored);
        } else {
            return null;
        }
    });

    const register = async (newUser: User) => {
        const users = await getAllUsers();

        const existingUser = users.find(function(u) {
            return u.email === newUser.email;
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        users.push(newUser);
        await saveAllUsers(users);
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        const users = await getAllUsers();

        const userFound = users.find(function(u) {
            return u.email === email;
        });

        if (!userFound) {
            return false;
        }

        if (userFound.password === password) {
            const { password: _, ...safeUser } = userFound;

            sessionStorage.setItem('user', JSON.stringify(safeUser));
            setUser(safeUser);

            // Redirect based on role
            if (safeUser.role === 'admin') {
                navigate({ to: '/admin' });
            } else if (safeUser.role === 'vendor') {
                navigate({ to: '/vendor' });
            } else if (safeUser.role === 'client') {
                navigate({ to: '/client' });
            } else if (safeUser.role === 'trainee') {
                navigate({ to: '/trainee' });
            }

            return true;
        }

        return false;
    };

    const logout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
        navigate({ to: '/auth/login' });
    };

    const resetPassword = async (email: string, newPassword: string) => {
        const users = await getAllUsers();

        const index = users.findIndex(function(u) {
            return u.email === email;
        });

        if (index === -1) {
            throw new Error('User not found');
        }

        users[index].password = newPassword;
        await saveAllUsers(users);
    };

    const getUser = () => {
        return user;
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout, resetPassword, getUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
