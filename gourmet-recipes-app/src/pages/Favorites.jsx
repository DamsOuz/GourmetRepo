import React, { useEffect, useState, useContext } from 'react';
import { favoritesApi } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { token } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (token) {
      favoritesApi.getMyFavorites(token)
        .then(data => {
          setFavorites(data);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des favoris:", error);
        });
    }
  }, [token]);

  if (!token) return <p>Vous devez être connecté pour voir vos favoris.</p>;

  return (
    <div>
      <h1>Mes Favoris</h1>
      {favorites.length === 0 ? (
        <p>Aucun favori trouvé.</p>
      ) : (
        <ul>
          {favorites.map(fav => (
            <li key={fav.id}>
              <Link to={`/recettes/${fav.recipeId}`}>
                {fav.recipe?.title || "Recette sans titre"}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
