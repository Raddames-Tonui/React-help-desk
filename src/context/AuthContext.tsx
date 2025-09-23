import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useState, useEffect } from "react";
import type { User } from "@/context/types.ts";
import { AuthContext } from "@/context/hooks";
import { TOKEN } from "@/utils/Constants"
import { encryptData, decryptData } from "@/utils/cryptoUtils.ts";
const ENCRYPTION_KEY = "this_is_a_very_strong_key_32_chars!"; // must be >= 32 chars
const USERS_STORAGE_KEY = "users";

// ----- LocalStorage encryption helpers -----
async function saveEncrypted<T>(key: string, value: T) {
  const encrypted = await encryptData(JSON.stringify(value), ENCRYPTION_KEY);
  localStorage.setItem(key, encrypted);
}

async function loadEncrypted<T>(key: string): Promise<T | null> {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;

  try {
    const decrypted = await decryptData(encrypted, ENCRYPTION_KEY);
    return JSON.parse(decrypted) as T;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<Omit<User, "password"> | null>(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --------- FETCH USER PROFILE ---------
  const fetchUserProfile = async (): Promise<Omit<User, "password"> | null> => {
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

      return json.user as Omit<User, "password">;
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // --------- LOGIN ---------
  const login = async (email: string, password: string): Promise<boolean> => {
    const users = (await loadEncrypted<User[]>(USERS_STORAGE_KEY)) || [];
    const found = users.find((u) => u.email === email);
    if (!found) return false;
    if (found.password !== password) return false;

    const { password: _, ...safeUser } = found;

    if (safeUser.role === "admin") {
      const fetchedProfile = await fetchUserProfile();
      if (!fetchedProfile) return false;

      const updatedUser = { ...fetchedProfile, company: "Sky World Limited" };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } else {
      sessionStorage.setItem("user", JSON.stringify(safeUser));
      setUser(safeUser);
    }

    const roleRoutes: Record<string, string> = {
      admin: "/admin",
      vendor: "/vendor",
      client: "/client",
      trainee: "/trainee",
    };
    navigate({ to: roleRoutes[safeUser.role] || "/" });

    return true;
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);

      if (parsed.role === "admin") {
        fetchUserProfile().then((fetched) => {
          if (fetched) {
            const updated = { ...fetched, company: "Sky World Limited" };
            sessionStorage.setItem("user", JSON.stringify(updated));
            setUser(updated);
          }
        });
      }
    }
  }, []);

  // --------- REGISTER ---------
  const register = async (newUser: User) => {
    const users = (await loadEncrypted<User[]>(USERS_STORAGE_KEY)) || [];
    if (users.find((u) => u.email === newUser.email)) {
      throw new Error("User already exists");
    }

    users.push(newUser);
    await saveEncrypted(USERS_STORAGE_KEY, users);
  };

  // --------- RESET PASSWORD ---------
  const resetPassword = async (email: string, newPassword: string) => {
    const users = (await loadEncrypted<User[]>(USERS_STORAGE_KEY)) || [];
    const index = users.findIndex((u) => u.email === email);
    if (index === -1) throw new Error("User not found");

    users[index].password = newPassword;
    await saveEncrypted(USERS_STORAGE_KEY, users);
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    navigate({ to: "/auth/login" });
  };

  const getUser = () => user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        fetchUserProfile,
        getUser,
        resetPassword,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
