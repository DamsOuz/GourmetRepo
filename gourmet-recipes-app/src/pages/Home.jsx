import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecipes } from '../api/API';
import SearchBar from '../components/SearchBar';
import Spinner from '../components/Spinner';
import './Home.css';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [error, setError] = useState(null);

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
    return <div style={{ color: 'red' }}>Erreur : {error}</div>;
  }

  if (recipes.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Liste des recettes</h1>
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="recipes-grid">
        {filteredRecipes.length === 0 ? (
          <p>Aucune recette trouvée.</p>
        ) : (
          filteredRecipes.map((recipe) => (
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
