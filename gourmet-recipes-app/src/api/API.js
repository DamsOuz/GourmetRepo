const API_BASE_URL = 'https://gourmet.cours.quimerch.com';

/**
 * Authentifie l'utilisateur et récupère le token.
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<Object>} Retourne un objet contenant le token.
 */
export async function loginUser(username, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errorText}`);
    }

    const data = await response.json();
    return data; // On attend que data contienne { token: "..." }
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
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la récupération de l'utilisateur : ${errorText}`);
    }

    return response.json();
}

/**
 * Récupère la liste des recettes depuis l'API.
 *
 * @returns {Promise<Array>} Un tableau contenant les recettes.
 * @throws {Error} Si l'appel échoue ou si la réponse n'est pas un JSON valide.
 */
export async function fetchRecipes() {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errorText}`);
    }

    // Récupère la réponse brute sous forme de texte
    const rawData = await response.text();

    try {
        // Essaie de parser le JSON et renvoie les données
        const data = JSON.parse(rawData);
        return data;
    } catch (error) {
        throw new Error("Le serveur n’a pas renvoyé de JSON valide.");
    }
}


/**
 * Récupère les détails d'une recette.
 *
 * @param {string} id - L'ID de la recette.
 * @returns {Promise<Object>} - L'objet recette.
 * @throws {Error} - Si la requête échoue ou si le JSON n'est pas valide.
 */
export async function fetchRecipe(id) {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errorText}`);
    }
    const raw = await response.text();
    try {
        return JSON.parse(raw);
    } catch (error) {
        throw new Error("Le serveur n’a pas renvoyé de JSON valide pour la recette.");
    }
}

/**
 * Récupère les recettes liées à une recette donnée.
 *
 * @param {string} id - L'ID de la recette principale.
 * @returns {Promise<Array>} - Un tableau des recettes liées (ou un tableau vide si l'API échoue à les fournir).
 */
export async function fetchRelatedRecipes(id) {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}/related`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    });

    // Si la réponse n'est pas OK, on retourne un tableau vide (pas critique)
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
 *
 * @param {string} username - Le pseudonyme de l'utilisateur.
 * @param {string} token - Le token d'authentification.
 * @param {string|number} recipeID - L'ID de la recette à ajouter aux favoris.
 * @returns {Promise<string>} - La réponse du serveur (par exemple "1" pour confirmer la suppression, ou un message de succès).
 * @throws {Error} - En cas d'erreur lors de l'ajout aux favoris.
 */
export async function addFavorite(username, token, recipeID) {
    const url = `${API_BASE_URL}/users/${username}/favorites?recipeID=${recipeID}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: `Bearer ${token}`
        }
    });
    const txt = await response.text();
    if (!response.ok) {
        throw new Error(`Impossible d’ajouter la recette aux favoris : ${txt}`);
    }
    return txt;
}

/**
 * Récupère la liste des favoris.
 *
 * @param {string} token - Le token d'authentification.
 * @returns {Promise<Array>} - La liste des favoris.
 */
export async function fetchFavorites(token) {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errorText}`);
    }

    // Retourne directement l'objet JSON (typiquement, un tableau)
    const data = await response.json();
    return data;
}

/**
 * Supprime un favori pour l'utilisateur spécifié.
 *
 * @param {string} username - Le pseudonyme de l'utilisateur.
 * @param {string} token - Le token d'authentification.
 * @param {number|string} recipeID - L'ID de la recette à supprimer des favoris.
 * @returns {Promise<string>} - La réponse du serveur indiquant le résultat de la suppression.
 */
export async function removeFavorite(username, token, recipeID) {
    // Construction de l'URL avec le username et le query parameter recipeID
    const url = `${API_BASE_URL}/users/${username}/favorites?recipeID=${recipeID}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: `Bearer ${token}`
        }
    });

    const txt = await response.text();

    if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status} : ${txt}`);
    }

    return txt;
}
