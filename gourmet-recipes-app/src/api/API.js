const API_BASE_URL = 'https://gourmet.cours.quimerch.com';

/**
 * Authentifie l'utilisateur et récupère le token.
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<Object>} Un objet contenant le token.
 */
export async function loginUser(username, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errorText}`);
    }

    return response.json();
}

/**
 * Récupère les infos de l'utilisateur.
 * @param {string} username 
 * @param {string} token 
 * @returns {Promise<Object>} Données utilisateur.
 */
export async function fetchUser(username, token) {
    const response = await fetch(`${API_BASE_URL}/users/${username}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la récupération de l'utilisateur : ${errorText}`);
    }

    return response.json();
}

/**
 * Récupère la liste des recettes depuis l'API.
 * @returns {Promise<Array>} Tableau de recettes.
 * @throws {Error} Si l'appel échoue ou si la réponse n'est pas du JSON valide.
 */
export async function fetchRecipes() {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errorText}`);
    }

    const rawData = await response.text();

    try {
        return JSON.parse(rawData);
    } catch {
        throw new Error("Le serveur n’a pas renvoyé de JSON valide.");
    }
}

/**
 * Récupère les détails d'une recette.
 * @param {string} id - ID de la recette.
 * @returns {Promise<Object>} Objet recette.
 */
export async function fetchRecipe(id) {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errorText}`);
    }

    const raw = await response.text();

    try {
        return JSON.parse(raw);
    } catch {
        throw new Error("Le serveur n’a pas renvoyé de JSON valide pour la recette.");
    }
}

/**
 * Récupère les recettes liées à une recette donnée.
 * @param {string} id - ID de la recette principale.
 * @returns {Promise<Array>} Tableau des recettes liées, ou vide si erreur.
 */
export async function fetchRelatedRecipes(id) {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}/related`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });

    if (!response.ok) return [];

    const raw = await response.text();

    try {
        return JSON.parse(raw);
    } catch {
        console.warn("Impossible de parser les recettes liées.");
        return [];
    }
}

/**
 * Ajoute une recette aux favoris de l'utilisateur.
 * @param {string} username 
 * @param {string} token 
 * @param {string|number} recipeID 
 * @returns {Promise<string>} Réponse du serveur.
 */
export async function addFavorite(username, token, recipeID) {
    const url = `${API_BASE_URL}/users/${username}/favorites?recipeID=${recipeID}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: `Bearer ${token}`,
        },
    });

    const txt = await response.text();

    if (!response.ok) {
        throw new Error(`Impossible d’ajouter la recette aux favoris : ${txt}`);
    }

    return txt;
}

/**
 * Récupère la liste des favoris.
 * @param {string} token 
 * @returns {Promise<Array>} Liste des favoris.
 */
export async function fetchFavorites(token) {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errorText}`);
    }

    return response.json();
}

/**
 * Supprime une recette des favoris de l'utilisateur.
 * @param {string} username 
 * @param {string} token 
 * @param {number|string} recipeID 
 * @returns {Promise<string>} Réponse du serveur.
 */
export async function removeFavorite(username, token, recipeID) {
    const url = `${API_BASE_URL}/users/${username}/favorites?recipeID=${recipeID}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: `Bearer ${token}`,
        },
    });

    const txt = await response.text();

    if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status} : ${txt}`);
    }

    return txt;
}
