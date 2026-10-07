export default function Layout({ user, onLogout, children }) {
  return <div className="app-shell">
    <header className="navbar">
      <a className="logo" href="#home">gunaso<span>.</span></a>
      <nav>
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
