import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { recipesApi, favoritesApi } from '../api/api';
import { AuthContext } from '../context/AuthContext';

const Recipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    recipesApi.getById(id)
      .then(data => {
        setRecipe(data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération de la recette:", error);
      });
  }, [id]);

  const addFavorite = () => {
    if (!token) {
      alert("Vous devez être connecté pour ajouter aux favoris");
      return;
    }
    favoritesApi.addFavorite(token, id)
      .then(() => {
        alert("Recette ajoutée aux favoris !");
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout aux favoris:", error);
        alert("Erreur lors de l'ajout aux favoris");
      });
  };

  const removeFavorite = () => {
    if (!token) {
      alert("Vous devez être connecté pour retirer des favoris");
      return;
    }
    favoritesApi.removeFavorite(token, id)
      .then(() => {
        alert("Recette retirée des favoris !");
      })
      .catch(error => {
        console.error("Erreur lors du retrait des favoris:", error);
        alert("Erreur lors du retrait des favoris");
      });
  };

  if (!recipe) return <p>Chargement...</p>;

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <button onClick={addFavorite}>Ajouter aux favoris</button>
      <button onClick={removeFavorite}>Retirer des favoris</button>
    </div>
  );
};

export default Recipe;
