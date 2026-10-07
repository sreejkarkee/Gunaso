import { useState } from "react";

export default function AuthPage({ mode, api, onAuth }) {
  const login = mode === "login";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    try { onAuth(await api(`/auth/${mode}`, { method: "POST", body: JSON.stringify(form) })); }
    catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
  };
  return <section className="auth-card"><p className="kicker">{login ? "WELCOME BACK" : "JOIN YOUR COMMUNITY"}</p><h2>{login ? "Sign in to Gunaso" : "Create your account"}</h2><form onSubmit={submit}>{!login && <label>Name<input name="name" required minLength="2" value={form.name} onChange={update} /></label>}<label>Email<input type="email" name="email" required value={form.email} onChange={update} /></label><label>Password<input type="password" name="password" required minLength="6" value={form.password} onChange={update} /></label>{error && <p className="error">{error}</p>}<button className="button" disabled={busy}>{busy ? "Please wait..." : login ? "Sign in" : "Create account"}</button></form><p className="switch">{login ? "New to Gunaso?" : "Already registered?"} <a href={`#${login ? "register" : "login"}`}>{login ? "Create an account" : "Sign in"}</a></p></section>;
}
