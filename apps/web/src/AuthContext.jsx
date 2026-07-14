import { createContext, useContext, useState } from "react";
import { authApi, apiFetch } from "./api";
import { getToken, setToken, clearToken } from "./cookies";

const Ctx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken);

  const store = (t) => {
    setToken(t);
    setTokenState(t);
  };

  const login = async (email, password) =>
    store((await authApi.login(email, password)).token);
  const register = async (email, password, name) =>
    store((await authApi.register(email, password, name)).token);
  const logout = async () => {
    try {
      await authApi.logout(token);
    } finally {
      clearToken();
      setTokenState(null);
    }
  };

  const authFetch = (path, opts = {}) =>
    apiFetch(path, {
      ...opts,
      headers: { ...opts.headers, Authorization: `Bearer ${token}` },
    });

  return (
    <Ctx.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        authFetch,
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
