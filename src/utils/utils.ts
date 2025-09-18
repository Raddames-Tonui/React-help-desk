import type { User } from './types';

export const getAllUsers = async (): Promise<User[]> => {
    const data = localStorage.getItem('users');
    if (!data) return [];
    return JSON.parse(data);
};

export const saveAllUsers = async (users: User[]) => {
    localStorage.setItem('users', JSON.stringify(users));
};










// import type { User } from './types';
// import { encryptData, decryptData } from './cryptoUtils';

// const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY as string;

// export const getAllUsers = async (): Promise<User[]> => {
//     const data = localStorage.getItem('users');
//     if (!data) return [];
//     const decrypted = await decryptData(data, ENCRYPTION_KEY);
//     return JSON.parse(decrypted);
// };

// export const saveAllUsers = async (users: User[]) => {
//     const encrypted = await encryptData(JSON.stringify(users), ENCRYPTION_KEY);
//     localStorage.setItem('users', encrypted);
// };



