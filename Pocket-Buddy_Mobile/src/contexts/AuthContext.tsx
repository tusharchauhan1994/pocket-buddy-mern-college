import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_KEYS = { ID: "id", ROLE: "role" };

type AuthState = {
  userId: string | null;
  role: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
};

type AuthContextType = AuthState & {
  login: (userId: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    userId: null,
    role: null,
    isLoading: true,
    isLoggedIn: false,
  });

  const refreshAuth = async () => {
    try {
      const id = await AsyncStorage.getItem(AUTH_KEYS.ID);
      const role = await AsyncStorage.getItem(AUTH_KEYS.ROLE);
      setState({
        userId: id,
        role,
        isLoading: false,
        isLoggedIn: !!id,
      });
    } catch {
      setState({
        userId: null,
        role: null,
        isLoading: false,
        isLoggedIn: false,
      });
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const login = async (userId: string, role: string) => {
    await AsyncStorage.setItem(AUTH_KEYS.ID, userId);
    await AsyncStorage.setItem(AUTH_KEYS.ROLE, role);
    await AsyncStorage.setItem("token", userId); // Use userId as token for now, to satisfy interceptor logic
    setState({
      userId,
      role,
      isLoading: false,
      isLoggedIn: true,
    });
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([AUTH_KEYS.ID, AUTH_KEYS.ROLE, "token"]);
    setState({
      userId: null,
      role: null,
      isLoading: false,
      isLoggedIn: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
