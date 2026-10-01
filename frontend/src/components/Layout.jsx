import { NavLink, Outlet } from "react-router-dom";

export default function Layout({ user, onSignOut }) {
  return (
    <>
      <header className="site-header">
        <NavLink className="brand" to="/">Leaf <span>&</span> Ledger</NavLink>
        <nav aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/browse">Browse</NavLink>
          {user && <NavLink to="/tbr">My TBR</NavLink>}
        </nav>
        {user ? <div className="account-actions"><span className="account-name">{user.user_metadata?.display_name || user.email}</span><button className="token-button" onClick={onSignOut}>Log out</button></div> : <div className="account-actions"><NavLink className="nav-action" to="/login">Log in</NavLink><NavLink className="token-button" to="/signup">Sign up</NavLink></div>}
      </header>
      <main><Outlet /></main>
      <footer>Leaf & Ledger · A local reading journal</footer>
    </>
  );
}
