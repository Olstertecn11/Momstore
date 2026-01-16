import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setupInterceptors } from "../api/axios";
import * as authApi from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [booting, setBooting] = useState(true);

  // Instalar interceptors una sola vez
  useEffect(() => {
    setupInterceptors({
      getAccessToken: () => accessToken,
      setAccessToken,
      onLogout: () => {
        setAccessToken(null);
        setUser(null);
      },
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const hasSession = localStorage.getItem("momstore_has_session") === "1";
        if (!hasSession) return;

        const r = await authApi.refresh();
        if (!mounted) return;
        setAccessToken(r.accessToken);

        const me = await authApi.getMe();
        if (!mounted) return;
        console.log("Auth bootstrap - user:", me.user);
        setUser(me.user);
      } catch (err) {
        localStorage.removeItem("momstore_has_session");

        if (err?.response?.status !== 401) {
          console.error("Auth bootstrap error:", err);
        }
      } finally {
        if (mounted) setBooting(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  async function doLogin(email, password) {
    const data = await authApi.login(email, password);
    setAccessToken(data.accessToken);
    setUser(data.user);
    localStorage.setItem("momstore_has_session", "1");

    return data;
  }

  async function doLogout() {
    try { await authApi.logout(); } catch (_) { }
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("momstore_has_session"); // ✅
  }

  const value = useMemo(() => ({
    user,
    accessToken,
    booting,
    isAuthed: !!user && !!accessToken,
    login: doLogin,
    logout: doLogout,
  }), [user, accessToken, booting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
