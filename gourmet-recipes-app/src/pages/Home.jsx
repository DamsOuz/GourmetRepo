// Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecipes } from '../api/API'; // Import de la fonction centralisée
import './Home.css';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes()
      .then((data) => setRecipes(data))
      .catch((err) => {
        console.error("Erreur lors de la récupération des recettes:", err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return <div style={{ color: 'red' }}>Erreur : {error}</div>;
  }

  return (
    <div>
      <h1>Liste des recettes</h1>
      <div className="recipes-grid">
        {recipes.length === 0 ? (
          <p>Aucune recette trouvée.</p>
        ) : (
          recipes.map((recipe) => (
            <Link key={recipe.id} to={`/recettes/${recipe.id}`} className="recipe-card">
              <img src={recipe.image_url} alt={recipe.name} />
              <div className="recipe-info">
                <h2>{recipe.name}</h2>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
