import React, { useEffect, useState } from 'react';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://gourmet.cours.quimerch.com/recipes', {
      method: 'GET',
      headers: {
        // On indique qu'on veut du JSON
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
      // AUCUN header Authorization, donc pas de token
    })
      .then(async (res) => {
        console.log("HTTP status:", res.status);

        // Si le status HTTP est >= 400, on récupère le texte d’erreur
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Erreur HTTP ${res.status} : ${txt}`);
        }

        // On lit la réponse brute
        const rawData = await res.text();
        console.log("Réponse brute :", rawData);

        try {
          // On parse en JSON
          const data = JSON.parse(rawData);
          setRecipes(data);
          setError(null);
        } catch (parseError) {
          console.error("Impossible de parser la réponse en JSON :", parseError);
          setError("Le serveur n’a pas renvoyé de JSON valide.");
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des recettes :", err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return <div style={{ color: 'red' }}>Erreur : {error}</div>;
  }

  return (
    <div>
      <h1>Liste des recettes</h1>
      {recipes.length === 0 ? (
        <p>Aucune recette trouvée ou erreur lors du fetch.</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>{recipe.name || "Recette sans nom"}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
