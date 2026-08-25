import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginService,
  getCurrentUser,
} from "../services/auth.service";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);      // Login button
const [checkingAuth, setCheckingAuth] = useState(true); // Initial auth check

  // Restore user when app loads
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      queueMicrotask(() => setCheckingAuth(false));
      return;
    }

    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data.data);
        setCheckingAuth(false);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        setUser(null);
        setCheckingAuth(false);
      }
    };

    loadUser();
  }, []);

  // Login
const login = async (credentials) => {
  try {
    setLoading(true);

    const data = await loginService(credentials);

    console.log("Login Response:", data);

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return {
      success: true,
    };
  } catch (error) {
    console.log("Login Error:", error);
    console.log("Response:", error.response);

    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  } finally {
    setLoading(false);
  }
};

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        setUser,
        checkingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}