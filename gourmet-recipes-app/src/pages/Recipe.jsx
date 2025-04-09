// Recipe.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchRecipe, fetchRelatedRecipes, addFavorite } from '../api/API'; // Import des fonctions centralisées
import "./Recipe.css"
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

  // Charger la recette principale via fetchRecipe
  useEffect(() => {
    fetchRecipe(id)
      .then((data) => setRecipe(data))
      .catch((err) => {
        console.error("Erreur lors de la récupération de la recette:", err);
        setError(err.message);
      });
  }, [id]);

  // Charger les recettes liées via fetchRelatedRecipes
  useEffect(() => {
    fetchRelatedRecipes(id)
      .then((data) => setRelated(data))
      .catch((err) => {
        console.warn("Erreur lors de la récupération des recettes liées:", err);
      });
  }, [id]);

  // Ajouter aux favoris via addFavorite
  const handleAddFavorite = async () => {
    if (!token || !user) {
      alert("Vous devez être connecté pour ajouter aux favoris.");
      return;
    }
    try {
      await addFavorite(user.username, token, id);
      alert("Recette ajoutée aux favoris !");
    } catch (err) {
      console.error("Erreur lors de l’ajout aux favoris:", err);
      alert(err.message);
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }
  if (!recipe) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="recipe-container">
      {/* Partie principale */}
      <div className="recipe-main">
        <div className="recipe-header">
          <h1>{recipe.name}</h1>
        </div>
        <img
          src={recipe.image_url}
          alt={recipe.name}
          className="recipe-image"
        />

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

        <button onClick={handleAddFavorite} className="favorite-btn">
          Ajouter aux favoris
        </button>
      </div>

      {/* Partie droite : recettes liées */}
      <div className="recipe-sidebar">
        <h3>Recettes liées</h3>
        {related.map((rel) => (
          <div key={rel.id} className="related-recipe">
            <a href={`/recettes/${rel.id}`}>
              <img
                src={rel.image_url}
                alt={rel.name}
                className="related-recipe-image"
              />
              <p>{rel.name}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recipe;
