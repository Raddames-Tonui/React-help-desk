import type { User } from '../context/types.ts';

export const getAllUsers = async (): Promise<User[]> => {
    const data = localStorage.getItem('users');
    if (!data) return [];
    return JSON.parse(data);
};

export const saveAllUsers = async (users: User[]) => {
    localStorage.setItem('users', JSON.stringify(users));
};



export const truncateWords = (text?: string, wordLimit = 20) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(" ") + "...";
};





