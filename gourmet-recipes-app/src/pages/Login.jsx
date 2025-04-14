import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { loginUser, fetchUser } from '../api/API';
import './Login.css';

function Login() {
  const [pseudonym, setPseudonym] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Envoie les identifiants, récupère les infos utilisateur et connecte
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    try {
      const data = await loginUser(pseudonym, password);
      console.log("Réponse login:", data);
      const userData = await fetchUser(pseudonym, data.token);
      console.log("Infos utilisateur:", userData);
      login(data.token, userData);
      toast.success('Connexion réussie !');
      setTimeout(() => {
        navigate('/');
      }, 750);
    } catch (error) {
      console.error('Erreur de connexion :', error);
      toast.error('Identifiants invalides ou erreur de connexion.');
    }
  };

  return (
    <div className="login-container">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} className="login-form">
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
