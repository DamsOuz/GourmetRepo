import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");

    if (storedToken && storedToken !== "undefined") {
      setToken(storedToken);
    }

    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Erreur de parsing du user dans sessionStorage :", err);
      }
    }
  }, []);

  // Stocke l'utilisateur et le token
  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);

    sessionStorage.setItem("token", newToken || "");
    sessionStorage.setItem("user", userData ? JSON.stringify(userData) : "");
  };

  // Réinitialise l'état et vide le sessionStorage
  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
