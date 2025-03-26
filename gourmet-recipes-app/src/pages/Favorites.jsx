import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Favorites() {
  const { token, user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  // Fonction pour recharger la liste des favoris
  const fetchFavorites = async () => {
    if (!token || !user) {
      setError("Vous devez être connecté pour voir vos favoris.");
      return;
    }
    try {
      const res = await fetch('https://gourmet.cours.quimerch.com/favorites', {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Erreur HTTP ${res.status} : ${txt}`);
      }
      const rawData = await res.text();
      const data = JSON.parse(rawData);
      setFavorites(data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des favoris :", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [token, user]);

  const handleRemoveFavorite = async (recipeId) => {
    if (!token || !user) {
      alert("Vous devez être connecté pour retirer un favori.");
      return;
    }
    try {
      const res = await fetch(
        `https://gourmet.cours.quimerch.com/users/${user.username}/favorites?recipeID=${recipeId}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: `Bearer ${token}`
          }
        }
      );
      const txt = await res.text();
      if (!res.ok) {
        throw new Error(`Erreur HTTP ${res.status} : ${txt}`);
      }
      await fetchFavorites();
      
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
      <ul>
        {favorites.map((fav) => (
          <li key={fav.id ?? fav.recipeID}>
            <Link to={`/recettes/${fav.recipeID}`}>
              {fav.recipe?.name || "Recette sans titre"}
            </Link>
            {" "}
            <button onClick={() => handleRemoveFavorite(fav.recipeID)}>
              Retirer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Favorites;
