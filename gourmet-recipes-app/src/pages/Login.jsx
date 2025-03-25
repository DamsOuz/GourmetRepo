import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [pseudonym, setPseudonym] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');

    try {
      // Obtenir le token via POST /login
      const response = await fetch('https://gourmet.cours.quimerch.com/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: pseudonym, password })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errorText}`);
      }

      const data = await response.json(); // On suppose que data = { token: "..." }
      console.log("Réponse login:", data);

      // Récupérer les infos de l'utilisateur via GET /users/{username}
      // On utilise le pseudonyme que l'utilisateur a saisi
      const meResponse = await fetch(`https://gourmet.cours.quimerch.com/users/${pseudonym}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${data.token}`
        }
      });

      if (!meResponse.ok) {
        const errorText = await meResponse.text();
        throw new Error(`Impossible de récupérer l'utilisateur : ${errorText}`);
      }

      // On suppose que la réponse ressemble à { "username": "beta", "...": "..." }
      const userData = await meResponse.json();
      console.log("Infos utilisateur:", userData);

      // Stocker le token et les infos dans AuthContext
      // Dans le Header, tu pourras afficher user.username
      login(data.token, userData);

      setFeedback('Connexion réussie !');
      // Redirige vers la page d'accueil après 1.5s
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Erreur de connexion :', error);
      setFeedback('Identifiants invalides ou erreur de connexion.');
    }
  };

  return (
    <div>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pseudonyme :</label>
          <input
            type="text"
            value={pseudonym}
            onChange={(e) => setPseudonym(e.target.value)}
            placeholder="Entrez votre pseudonyme"
            required
          />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
      {feedback && <p>{feedback}</p>}
    </div>
  );
}

export default Login;
