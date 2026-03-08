import { useEffect, useMemo, useState } from "react";
import api, { getApiError, storage } from "../api/http";
import AuthContext from "./auth-context";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(storage.getToken());
  const [user, setUser] = useState(storage.getUser());
  const [loading, setLoading] = useState(true);

  const hydrateMe = async () => {
    const currentToken = storage.getToken();
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
      storage.setUser(response.data.user);
      setToken(currentToken);
    } catch {
      storage.clearAll();
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrateMe();
  }, []);

  const login = async (credentials, mode = "customer") => {
    const endpoint = mode === "admin" ? "/auth/admin/login" : "/auth/login";
    const response = await api.post(endpoint, credentials);
    const sessionToken = response.data.token;
    const sessionUser = response.data.user;
    storage.setToken(sessionToken);
    storage.setUser(sessionUser);
    setToken(sessionToken);
    setUser(sessionUser);
    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    const sessionToken = response.data.token;
    const sessionUser = response.data.user;
    storage.setToken(sessionToken);
    storage.setUser(sessionUser);
    setToken(sessionToken);
    setUser(sessionUser);
    return response.data;
  };

  const logout = () => {
    storage.clearAll();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
      storage.setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      throw new Error(getApiError(error, "Failed to refresh user."));
    }
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      refreshUser,
      setUser,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
