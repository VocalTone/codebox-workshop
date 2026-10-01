import { createContext, useContext, useState } from "react";
import { getToken, setToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem("leaf-ledger-user") || "null"));
  function startSession(result) { setToken(result.token); localStorage.setItem("leaf-ledger-user", JSON.stringify(result.user)); setSession(result.user); }
  function signOut() { setToken(""); localStorage.removeItem("leaf-ledger-user"); setSession(null); }

  return <AuthContext.Provider value={{ user: getToken() ? session : null, startSession, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
