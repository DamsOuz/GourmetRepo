// Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { loginUser, fetchUser } from '../api/API';

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
      // Utilisation de la fonction centralisée loginUser
      const data = await loginUser(pseudonym, password);
      console.log("Réponse login:", data);

      // Récupération des informations utilisateur avec fetchUser
      const userData = await fetchUser(pseudonym, data.token);
      console.log("Infos utilisateur:", userData);

      // Stockage dans le AuthContext
      login(data.token, userData);

      toast.success('Connexion réussie !');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Erreur de connexion :', error);
      toast.error('Identifiants invalides ou erreur de connexion.');
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
