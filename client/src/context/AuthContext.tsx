import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

// Define user and auth types
export interface User {
  id?: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  });

  // Keep state synced from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (storedUser && accessToken && refreshToken) {
      try {
        const user = JSON.parse(storedUser);
        setAuth({
          user,
          accessToken,
          refreshToken,
        });
      } catch (error) {
        console.error("Error parsing stored user:", error);
        logout();
      }
    }
    // eslint-disable-next-line
  }, []);

  // Fetch authenticated user profile from backend using token
  useEffect(() => {
    async function fetchProfile() {
      if (auth.accessToken && !auth.user) {
        try {
          const { data } = await axios.get("http://localhost:3000/profile", {
            headers: { Authorization: `Bearer ${auth.accessToken}` },
          });
          setAuth((prev) => ({
            ...prev,
            user: data.user,
          }));
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          logout();
        }
      }
    }
    fetchProfile();
    // Only run if token is set but user not loaded yet
    // eslint-disable-next-line
  }, [auth.accessToken, auth.user]);

  const logout = () => {
    setAuth({ user: null, accessToken: null, refreshToken: null });
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
