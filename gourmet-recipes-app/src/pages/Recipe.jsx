import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  fetchRecipe,
  fetchRelatedRecipes,
  fetchFavorites,
  addFavorite,
  removeFavorite
} from '../api/API';
import { FaHeart, FaRegHeart, FaClock, FaFire, FaUserFriends, FaEuroSign } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import "./Recipe.css";

function Recipe() {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);

  const [recipe, setRecipe] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Découpe le texte d'instructions en étapes (suppose un format numéroté ou avec tirets)
  const extractSteps = (instructions) => {
    const cleaned = instructions.replace(/\n+/g, ' ').trim();
    const steps = cleaned.split(/(?:\d+\.\s+|-+\s+)/).filter(step => step.trim() !== '');
    return steps;
  };

  // Charge les infos de la recette
  useEffect(() => {
    fetchRecipe(id)
      .then((data) => setRecipe(data))
      .catch((err) => {
        console.error("Erreur lors de la récupération de la recette:", err);
        setError(err.message);
      });
  }, [id]);

  // Charge les recettes liées
  useEffect(() => {
    fetchRelatedRecipes(id)
      .then((data) => setRelated(data))
      .catch((err) => {
        console.warn("Erreur lors de la récupération des recettes liées:", err);
      });
  }, [id]);

  // Vérifie si la recette est déjà dans les favoris
  useEffect(() => {
    if (token && user) {
      fetchFavorites(token)
        .then((data) => {
          const favorited = data.some(
            (fav) => fav.recipe && fav.recipe.id.toString() === id.toString()
          );
          setIsFavorite(favorited);
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération des favoris :", err);
        });
    }
  }, [token, user, id]);

  // Ajoute ou retire des favoris
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
    return <div className="error" style={{ color: "red" }}>{error}</div>;
  }
  if (!recipe) {
    return <div>Chargement...</div>;
  }

  const steps = recipe.instructions ? extractSteps(recipe.instructions) : [];

  return (
    <div className="recipe-container">
      <div className="recipe-main">
        <div className="recipe-details">
          <div className="recipe-image-left">
            <img src={recipe.image_url} alt={recipe.name} className="recipe-image" />
          </div>
          <div className="recipe-characteristics">
            <div className="recipe-title-container">
              <h1>{recipe.name}</h1>
              <button
                onClick={toggleFavorite}
                className="favorite-btn"
                aria-label={isFavorite ? "Retirer de vos favoris" : "Ajouter aux favoris"}
              >
                {isFavorite ? <FaHeart size={24} color="red" /> : <FaRegHeart size={24} color="red" />}
              </button>
            </div>
            <p
              className="recipe-description"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(recipe.description) }}
            />
            <ul className="recipe-meta-icons">
              <li><FaClock /> <span>Prépa : {recipe.prep_time} min</span></li>
              <li><FaClock /> <span>Cuisson : {recipe.cook_time} min</span></li>
              <li><FaUserFriends /> <span>{recipe.servings} portions</span></li>
              <li><FaEuroSign /> <span>Coût : {recipe.cost ?? "N/A"} euros</span></li>
              <li><FaFire /> <span>Calories : {recipe.calories ?? "N/A"} kcal</span></li>
            </ul>
          </div>
        </div>

        <div className="recipe-instructions">
          <h2>Instructions</h2>
          {steps.length > 0 ? (
            steps.map((step, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(step) }} />
            ))
          ) : (
            <p>Aucune instruction disponible.</p>
          )}
        </div>
      </div>

      <div className="recipe-sidebar">
        <h3>Recettes liées</h3>
        {related.length === 0 ? (
          <p>Aucune recette liée.</p>
        ) : (
          related.map((rel) => (
            <div key={rel.id} className="related-recipe">
              <a href={`/recettes/${rel.id}`}>
                <img src={rel.image_url} alt={rel.name} className="related-recipe-image" />
                <p>{rel.name}</p>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Recipe;
