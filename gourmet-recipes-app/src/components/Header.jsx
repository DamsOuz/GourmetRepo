import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { token, user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-top">
        <h1 className="site-title">Gourmet Recipes</h1>
        <div className="header-user">
          {token && user && (
            <span>Connecté en tant que <strong>{user.username || "inconnu"}</strong></span>
          )}
          {token ? (
            <button onClick={logout} className="btn logout-btn">Déconnexion</button>
          ) : (
            <Link to="/login" className="btn login-btn">Connexion</Link>
          )}
        </div>
      </div>
      <nav className="header-nav">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Accueil</Link>
        {token && <Link to="/fav" className={location.pathname === '/fav' ? 'active' : ''}>Favoris</Link>}
      </nav>
    </header>
  );
}

export default Header;
