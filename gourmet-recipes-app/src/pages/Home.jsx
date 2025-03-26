import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://gourmet.cours.quimerch.com/recipes', {
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
        const rawData = await res.text();
        try {
          const data = JSON.parse(rawData);
          setRecipes(data);
        } catch (err) {
          console.error("Impossible de parser en JSON:", err);
          setError("Le serveur n’a pas renvoyé de JSON valide.");
        }
      })
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
