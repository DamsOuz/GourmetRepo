import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const { token, user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Détermine quel lien afficher à gauche en fonction de la route actuelle
  let leftLink = null;
  if (location.pathname === '/fav') {
    // Sur la page Favoris, afficher uniquement le bouton Liste des recettes
    leftLink = <Link to="/">Liste des recettes</Link>;
  } else if (location.pathname === '/') {
    // Sur la page Accueil, afficher uniquement le bouton Favoris
    leftLink = <Link to="/fav">Favoris</Link>;
  } else {
    // Sur les autres pages, afficher les deux liens : Favoris et Liste des recettes
    leftLink = (
      <>
        <Link to="/">Liste des recettes</Link>
        <span> | </span>
        <Link to="/fav">Favoris</Link>
      </>
    );
  }

  return (
    <header
      style={{
        borderBottom: '1px solid #ccc',
        marginBottom: '1rem',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      {/* Partie gauche : lien selon la route */}
      <div>{leftLink}</div>

      {/* Partie droite : bouton de connexion/déconnexion */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {!token && <Link to="/login">Connexion</Link>}
        {token && (
          <>
            <span>
              Connecté en tant que <strong>{user ? user.username : 'inconnu'}</strong>
            </span>
            <button onClick={logout}>Déconnexion</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
