export const API_BASE_URL = "https://gourmet.cours.quimerch.com";

// Fonction générique d'appel à l'API
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error ${response.status}: ${errorText}`);
  }
  return response.json();
}

// Fonctions d'authentification
export const authApi = {
  login: async (credentials) => {
    // POST sur /Auth/Login
    const data = await apiFetch("/Auth/Login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return data; // attend { token, user }
  },
  getMe: async (token) => {
    // GET sur /Auth/Me avec Authorization
    const data = await apiFetch("/Auth/Me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};

// Fonctions pour les recettes
export const recipesApi = {
  getAll: async () => await apiFetch("/Recipes"),
  getById: async (id) => await apiFetch(`/Recipes/${id}`),
};

// Fonctions pour les favoris
export const favoritesApi = {
  getMyFavorites: async (token) =>
    await apiFetch("/Favorites", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  addFavorite: async (token, recipeId) =>
    await apiFetch("/Favorites", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ recipeId }),
    }),
  removeFavorite: async (token, recipeId) =>
    await apiFetch(`/Favorites/${recipeId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};
