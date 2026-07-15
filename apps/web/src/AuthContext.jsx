import { createContext, useContext, useState } from "react";
import { loginUser, registerUser, logoutUser } from "./api";
import { getToken, setToken, clearToken } from "./cookies";

const Ctx = createContext(null);

const roleFromToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1])).role ?? null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken);

  const store = (t) => {
    setToken(t);
    setTokenState(t);
  };

  const login = async (email, password) =>
    store((await loginUser(email, password)).token);
  const register = async (email, password, name) =>
    store((await registerUser(email, password, name)).token);
  const logout = async () => {
    try {
      await logoutUser(token);
    } finally {
      clearToken();
      setTokenState(null);
    }
  };

  return (
    <Ctx.Provider
      value={{
        token,
        isAuthenticated: !!token,
        isAdmin: roleFromToken(token) === "ADMIN",
        login,
        register,
        logout,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
