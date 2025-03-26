import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Recipe.css';

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

  // Charger la recette principale
  useEffect(() => {
    fetch(`https://gourmet.cours.quimerch.com/recipes/${id}`, {
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Erreur HTTP ${res.status} : ${txt}`);
        }
        const raw = await res.text();
        try {
          const data = JSON.parse(raw);
          setRecipe(data);
        } catch (err) {
          console.error("Impossible de parser la recette:", err);
          setError("Le serveur n’a pas renvoyé de JSON valide pour la recette.");
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération de la recette:", err);
        setError(err.message);
      });
  }, [id]);

  // Charger les recettes liées
  useEffect(() => {
    fetch(`https://gourmet.cours.quimerch.com/recipes/${id}/related`, {
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(async (res) => {
        if (!res.ok) return; // pas critique si ça échoue
        const raw = await res.text();
        try {
          const data = JSON.parse(raw);
          setRelated(data);
        } catch {
          console.warn("Impossible de parser les recettes liées.");
        }
      })
      .catch((err) => {
        console.warn("Erreur lors de la récupération des recettes liées:", err);
      });
  }, [id]);

  // Ajouter aux favoris
  const handleAddFavorite = async () => {
    if (!token || !user) {
      alert("Vous devez être connecté pour ajouter aux favoris.");
      return;
    }
    try {
      const response = await fetch(
        `https://gourmet.cours.quimerch.com/users/${user.username}/favorites?recipeID=${id}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: `Bearer ${token}`
          }
        }
      );
      const txt = await response.text();
      if (!response.ok) {
        if (txt.toLowerCase().includes("déjà")) {
          throw new Error("Cette recette est déjà dans vos favoris.");
        } else {
          throw new Error(`Impossible d’ajouter la recette aux favoris : ${txt}`);
        }
      }
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
          <p><strong>Temps :</strong> {recipe.cook_time} min</p>
          <p><strong>Difficulté :</strong> {recipe.difficulty || "N/A"}</p>
          <p><strong>Coût :</strong> {recipe.cost || "N/A"}</p>
          <p><strong>Calories :</strong> {recipe.calories || "N/A"}</p>
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

      {/* Partie droite : related recipes */}
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
