import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const { user, startSession } = useAuth();
  const [username, setUsername] = useState(""); const [password, setPassword] = useState(""); const [confirmPassword, setConfirmPassword] = useState(""); const [name, setName] = useState("");
  const [error, setError] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;

  async function submit(event) {
    event.preventDefault(); setError(""); setMessage("");
    if (isSignup && password !== confirmPassword) return setError("Passwords do not match.");
    setBusy(true);
    try { const result = isSignup ? await api.register({ username, password, name }) : await api.login({ username, password }); startSession(result); navigate("/"); } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  return <section className="section auth-page"><form className="auth-form" onSubmit={submit}><p className="eyebrow">Leaf & Ledger</p><h1>{isSignup ? "Create your reader account." : "Welcome back."}</h1><p>{isSignup ? "Save books and share reviews under your own name." : "Log in to continue your reading journey."}</p>{isSignup && <label>Display name<input value={name} onChange={(event) => setName(event.target.value)} /></label>}<label>Username<input required value={username} onChange={(event) => setUsername(event.target.value)} placeholder="aanya" /></label><label>Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" /></label>{isSignup && <label>Confirm password<input required type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>}{error && <p className="notice notice--error">{error}</p>}<button className="button" disabled={busy}>{busy ? "Please wait…" : isSignup ? "Create account" : "Log in"}</button><p className="auth-switch">{isSignup ? "Already have an account?" : "New here?"} <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Create an account"}</Link></p></form></section>;
}
