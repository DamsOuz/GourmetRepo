import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const { token, user, logout } = useContext(AuthContext);

  return (
    <header style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/">Accueil</Link>
        {token && <Link to="/fav">Mes Favoris</Link>}
        {!token && <Link to="/login">Se connecter</Link>}
        {token && (
          <button onClick={logout}>
            Se déconnecter
          </button>
        )}
      </nav>

      {token && user && (
        <p style={{ marginTop: '0.5rem' }}>
          Connecté en tant que <strong>{user.username || "inconnu"}</strong>
        </p>
      )}
    </header>
  );
}

export default Header;
