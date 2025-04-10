import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Au montage, on relit le token et l'utilisateur depuis le sessionStorage
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");

    // Vérifie que storedToken n'est pas "undefined" avant de l'utiliser
    if (storedToken && storedToken !== "undefined") {
      setToken(storedToken);
    }

    // Vérifie que storedUser n'est pas "undefined" avant de faire JSON.parse
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Erreur de parsing du user dans sessionStorage :", err);
      }
    }
  }, []);

  // La fonction login reçoit un token "propre" (sans "Bearer ")
  // et un objet userData, puis les stocke
  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);

    sessionStorage.setItem("token", newToken || "");
    sessionStorage.setItem("user", userData ? JSON.stringify(userData) : "");
  };

  // logout efface tout
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
