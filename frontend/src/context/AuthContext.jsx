import { createContext, useContext, useState } from "react";
import { login as loginService } from "../services/auth.service";
const AuthContext = createContext();
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const login = async (credentials) => {
  try {
    setLoading(true);

    const data = await loginService(credentials);

    localStorage.setItem("token", data.token);

    setUser(data.user);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  } finally {
    setLoading(false);
  }
};
  return (
    <AuthContext.Provider
      value={{
    user,
    loading,
    login,
    setUser,
  }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function UseAuth() {
  return useContext(AuthContext);
}