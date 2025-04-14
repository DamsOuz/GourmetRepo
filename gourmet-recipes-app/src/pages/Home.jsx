import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecipes } from '../api/API';
import SearchBar from '../components/SearchBar';
import './Home.css';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [error, setError] = useState(null);

  // Charge les recettes au montage
  useEffect(() => {
    fetchRecipes()
      .then((data) => {
        setRecipes(data);
        setFilteredRecipes(data);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des recettes:", err);
        setError(err.message);
      });
  }, []);

  // Filtre les recettes selon la requête de recherche
  const handleSearch = (query) => {
    if (!query) {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  };

  if (error) {
    return <div style={{ color: 'red', padding: '1rem' }}>Erreur : {error}</div>;
  }

  if (recipes.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
  }

  return (
    <div className="home-wrapper">
      <div className="home-header">
        <h2 className="home-title">Liste des recettes</h2>
        <div className="search-controls">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      <div className="recipes-grid">
        {filteredRecipes.length === 0 ? (
          <p>Aucune recette trouvée.</p>
        ) : (
          filteredRecipes.map((recipe) => (
            <Link key={recipe.id} to={`/recettes/${recipe.id}`} className="recipe-card">
              <img src={recipe.image_url} alt={recipe.name} />
              <div className="recipe-info">
                <h3>{recipe.name}</h3>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
