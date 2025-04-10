import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchRecipe, fetchRelatedRecipes, fetchFavorites, addFavorite, removeFavorite } from '../api/API';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import "./Recipe.css";

// Fonction utilitaire pour formater les instructions
function formatInstructions(instr) {
  if (!instr) return [<p key="empty">Aucune instruction disponible.</p>];

  // Supprime les balises <script> ... </script>
  const safe = instr.replace(/<script.*?>.*?<\/script>/gis, '');

  // Sépare sur \n et filtre les lignes vides
  const lines = safe.split(/\r?\n/).filter(line => line.trim() !== '');

  // Convertit '- ' en <li>, sinon <p>
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      return <li key={idx}>{trimmed.slice(2)}</li>;
    }
    return <p key={idx}>{line}</p>;
  });
}

function Recipe() {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);

  const [recipe, setRecipe] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Chargement de la recette principale
  useEffect(() => {
    fetchRecipe(id)
      .then((data) => setRecipe(data))
      .catch((err) => {
        console.error("Erreur lors de la récupération de la recette:", err);
        setError(err.message);
      });
  }, [id]);

  // Chargement des recettes liées
  useEffect(() => {
    fetchRelatedRecipes(id)
      .then((data) => setRelated(data))
      .catch((err) => {
        console.warn("Erreur lors de la récupération des recettes liées:", err);
      });
  }, [id]);

  // Vérifier l'état du favori
  useEffect(() => {
    if (token && user) {
      fetchFavorites(token)
        .then((data) => {
          const favorited = data.some(fav => fav.recipe && fav.recipe.id.toString() === id.toString());
          setIsFavorite(favorited);
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération des favoris :", err);
        });
    }
  }, [token, user, id]);

  // Fonction switch pour favoris
  const toggleFavorite = async () => {
    if (!token || !user) {
      toast.warn("Vous devez être connecté pour gérer vos favoris.");
      return;
    }
    try {
      if (!isFavorite) {
        await addFavorite(user.username, token, id);
        setIsFavorite(true);
        toast.success("Recette ajoutée aux favoris !");
      } else {
        await removeFavorite(user.username, token, id);
        setIsFavorite(false);
        toast.success("Recette retirée des favoris !");
      }
    } catch (err) {
      console.error("Erreur lors du changement du statut de favori:", err);
      toast.error(err.message);
    }
  };

  if (error) {
    return <div className="error" style={{ color: 'red' }}>{error}</div>;
  }

  if (!recipe) {
    return <Spinner />;
  }

  return (
    <div className="recipe-container">
      <div className="recipe-main">
        <div className="recipe-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{recipe.name}</h1>
          <button
            onClick={toggleFavorite}
            className="favorite-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label={isFavorite ? 'Retirer de vos favoris' : 'Ajouter aux favoris'}
          >
            {isFavorite ? <FaHeart size={24} color="red" /> : <FaRegHeart size={24} color="red" />}
          </button>

        </div>
        <img src={recipe.image_url} alt={recipe.name} className="recipe-image" />
        <div className="recipe-meta">
          <p><strong>Temps de préparation :</strong> {recipe.prep_time} min</p>
          <p><strong>Temps de cuisson :</strong> {recipe.cook_time} min</p>
          <p><strong>Portions :</strong> {recipe.servings}</p>
          <p><strong>Coût :</strong> {recipe.cost ?? "N/A"} euros</p>
          <p><strong>Calories :</strong> {recipe.calories ?? "N/A"} kcal</p>
          <p><strong>Description :</strong> {recipe.description ?? "N/A"}</p>
          <p><strong>Date de Création :</strong> {recipe.created_at ?? "N/A"}</p>
        </div>
        <div className="recipe-description">
          <h2>Instructions</h2>
          <div className="instructions-content">
            {formatInstructions(recipe.instructions)}
          </div>
        </div>
      </div>
      <div className="recipe-sidebar">
        <h3>Recettes liées</h3>
        {related.map((rel) => (
          <div key={rel.id} className="related-recipe">
            <a href={`/recettes/${rel.id}`}>
              <img src={rel.image_url} alt={rel.name} className="related-recipe-image" />
              <p>{rel.name}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recipe;
