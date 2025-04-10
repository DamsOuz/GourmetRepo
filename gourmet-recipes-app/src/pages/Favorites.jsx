import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { fetchFavorites, removeFavorite } from '../api/API';
import "./Favorites.css"; // On crée un fichier dédié pour les styles de la page des favoris

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
      toast.warn("Vous devez être connecté pour retirer un favori.");
      return;
    }
    try {
      await removeFavorite(user.username, token, recipeID);
      await loadFavorites();
      toast.success("Favori retiré avec succès.");
    } catch (error) {
      console.error("Erreur lors du retrait du favori:", error);
      toast.error(error.message);
    }
  };

  if (!token || !user) {
    return <div>Vous devez être connecté pour voir vos favoris.</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!favorites || favorites.length === 0) {
    return (
      <div className="no-favorites-message">
        <h2>Toujours pas de favori ?</h2>
        <p>Allez découvrir toutes nos recettes et ajoutez vos préférées !</p>
        <Link to="/" className="discover-recipes-link">Découvrir les recettes</Link>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h1 className="favorites-title">Mes Favoris</h1>
      <div className="recipes-grid">
        {favorites.map((fav) => (
          <div key={fav.recipe?.id} className="favorite-item">
            <Link to={`/recettes/${fav.recipe?.id}`} className="recipe-card">
              <img
                src={fav.recipe?.image_url}
                alt={fav.recipe?.name}
                className="recipe-image"
              />
              <div className="recipe-info">
                <h2>{fav.recipe?.name || "Recette sans titre"}</h2>
              </div>
            </Link>
            <button onClick={() => handleRemoveFavorite(fav.recipe?.id)} className="remove-btn">
              Retirer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;
