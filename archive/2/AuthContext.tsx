import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, UserProfile } from "./types";
import axiosClient from "@/utils/constants/axiosClient";
import { toast } from "react-hot-toast";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile().finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosClient.post("/auth/login", { email, password });
      const userData = response.data?.user;

      if (!userData) throw new Error("Login failed: No user returned");

      const mappedProfile: UserProfile = {
        uuid: userData.uuid,
        fullName: userData.full_name,
        email: userData.email,
        roleName: userData.role_name,
        companyName: userData.company_name,
        userContacts: userData.user_contacts || [],
        userPreferences: {
          alertChannel: userData.user_preferences.alert_channel,
          receiveWeeklyReports: userData.user_preferences.receive_weekly_reports,
          language: userData.user_preferences.language,
          timezone: userData.user_preferences.timezone,
          dashboardLayout: userData.user_preferences.dashboard_layout?.value
            ? JSON.parse(userData.user_preferences.dashboard_layout.value)
            : {},
        },
      };

      setUser(mappedProfile);

    } catch (err: any) {
      console.error(err);
      setUser(null);
      const message = err.message || "Login failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get("/auth/profile");
      const profile = response.data;

      if (!profile) {
        setUser(null);
        const msg = "Profile not found";
        setError(msg);
        toast.error(msg);
        return;
      }

      const mappedProfile: UserProfile = {
        uuid: profile.uuid,
        fullName: profile.full_name,
        email: profile.email,
        roleName: profile.role_name,
        companyName: profile.company_name,
        userContacts: profile.user_contacts || [],
        userPreferences: {
          alertChannel: profile.user_preferences.alert_channel,
          receiveWeeklyReports: profile.user_preferences.receive_weekly_reports,
          language: profile.user_preferences.language,
          timezone: profile.user_preferences.timezone,
          dashboardLayout: profile.user_preferences.dashboard_layout?.value
            ? JSON.parse(profile.user_preferences.dashboard_layout.value)
            : {},
        },
      };

      setUser(mappedProfile);

    } catch (err: any) {
      console.error(err);
      setUser(null);

      const msg =
        err.code === "ERR_NETWORK"
          ? "Cannot connect to server. Please try again later."
          : err.message || "Failed to load profile.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await axiosClient.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (err: any) {
      console.error("Logout failed", err);
      const msg = err.message || "Logout failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (error && !isLoading) {
    return (
      <div className="server-error">
        <h1>Server Error</h1>
        <p>{error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchProfile();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, fetchProfile, error }}>
      {children}
    </AuthContext.Provider>
  );
};
