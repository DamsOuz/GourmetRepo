// Favorites.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { fetchFavorites, removeFavorite } from '../api/API'; // Import des fonctions centralisées

function Favorites() {
  const { token, user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  // Fonction pour actualiser la liste des favoris
  const loadFavorites = async () => {
    if (!token || !user) {
      setError("Vous devez être connecté pour voir vos favoris.");
      return;
    }
    try {
      const data = await fetchFavorites(token);
      setFavorites(data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des favoris :", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [token, user]);

  const handleRemoveFavorite = async (recipeID) => {
    if (!token || !user) {
      alert("Vous devez être connecté pour retirer un favori.");
      return;
    }
    try {
      await removeFavorite(user.username, token, recipeID);
      await loadFavorites();
      alert("Favori retiré avec succès.");
    } catch (error) {
      console.error("Erreur lors du retrait du favori:", error);
      alert(error.message);
    }
  };

  if (!token || !user) {
    return <div>Vous devez être connecté pour voir vos favoris.</div>;
  }
  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }
  if (!favorites || favorites.length === 0) {
    return <div>Aucun favori trouvé.</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Mes Favoris</h1>
      {favorites.length === 0 ? (
        <p>Aucun favori trouvé.</p>
      ) : (
        <div className="recipes-grid">
          {favorites.map((fav) => (
            <div key={fav.recipe?.id} className="favorite-item" style={{ display: 'flex', alignItems: 'center' }}>
              <Link to={`/recettes/${fav.recipe?.id}`} className="recipe-card" style={{ textDecoration: 'none', flex: 1 }}>
                <img src={fav.recipe?.image_url} alt={fav.recipe?.name} style={{ width: '100%', display: 'block' }} />
                <div className="recipe-info">
                  <h2>{fav.recipe?.name || "Recette sans titre"}</h2>
                </div>
              </Link>
              <button onClick={() => handleRemoveFavorite(fav.recipe?.id)} className="remove-btn" style={{ marginLeft: '10px' }}>
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

  );
}

export default Favorites;
