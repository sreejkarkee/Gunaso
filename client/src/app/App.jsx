import { useEffect, useState } from "react";
import { createApi } from "../api/client";
import Layout from "../components/Layout";
import AboutPage from "../pages/AboutPage";
import AuthPage from "../pages/AuthPage";
import ComplaintDetailPage from "../pages/ComplaintDetailPage";
import ComplaintFormPage from "../pages/ComplaintFormPage";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/HomePage";
import ManagePage from "../pages/ManagePage";

function readUser() { try { return JSON.parse(localStorage.getItem("gunaso_user") || "null"); } catch { return null; } }

export default function App() {
  const [user, setUser] = useState(readUser); const [token, setToken] = useState(() => localStorage.getItem("gunaso_token")); const [page, setPage] = useState(window.location.hash.slice(1) || "home"); const [toast, setToast] = useState("");
  useEffect(() => { const change = () => setPage(window.location.hash.slice(1) || "home"); window.addEventListener("hashchange", change); return () => window.removeEventListener("hashchange", change); }, []);
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(""), 2600); return () => clearTimeout(timer); } }, [toast]);
  const logout = () => { localStorage.clear(); setUser(null); setToken(null); window.location.hash = "home"; };
  const api = createApi(token, logout);
  const authenticate = (data) => { setUser(data.user); setToken(data.token); localStorage.setItem("gunaso_user", JSON.stringify(data.user)); localStorage.setItem("gunaso_token", data.token); window.location.hash = "dashboard"; };
  const protectedPage = !user && ["dashboard", "new", "manage"].includes(page);
  let content;
  if (page === "about") content = <AboutPage />;
  else if (page === "login" || page === "register" || protectedPage) content = <AuthPage mode={page === "register" ? "register" : "login"} api={api} onAuth={authenticate} />;
  else if (page === "dashboard") content = <DashboardPage api={api} />;
  else if (page === "new") content = <ComplaintFormPage api={api} notify={setToast} />;
  else if (page === "manage" && user && ["officer", "admin"].includes(user.role)) content = <ManagePage api={api} notify={setToast} />;
  else if (page.startsWith("complaint/")) content = <ComplaintDetailPage api={api} id={page.split("/")[1]} />;
  else content = <HomePage user={user} />;
  return <Layout user={user} onLogout={logout}>{content}{toast && <div className="toast">{toast}</div>}</Layout>;
}
