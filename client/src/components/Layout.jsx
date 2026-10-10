import { useEffect, useState } from "react";

export default function Layout({ user, onLogout, children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("gunaso_theme") || "light");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("gunaso_theme", theme);
  }, [theme]);
  return <div className="app-shell">
    <header className="navbar">
      <a className="logo" href="#home">gunaso<span>.</span></a>
      <nav>
        <button className="theme-toggle" type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
          <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
        {user ? <>
          <a href="#dashboard">Dashboard</a><a href="#new">File complaint</a>
          {["officer", "admin"].includes(user.role) && <a href="#manage">Manage</a>}
          <button className="button muted-button" onClick={onLogout}>Log out</button>
        </> : <><a href="#about">About</a><a href="#login">Log in</a><a className="button" href="#register">Create account</a></>}
      </nav>
    </header>
    <main>{children}</main>
  </div>;
}
