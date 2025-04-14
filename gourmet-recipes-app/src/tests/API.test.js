import {
    loginUser,
    fetchUser,
    fetchRecipes,
    fetchRecipe,
    fetchRelatedRecipes,
    addFavorite,
    fetchFavorites,
    removeFavorite
} from '../api/API';

const API_BASE_URL = 'https://gourmet.cours.quimerch.com';

describe('loginUser', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('doit retourner les données en cas de succès pour loginUser', async () => {
        const fakeResponse = { token: '123456' };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => fakeResponse,
        });

        const data = await loginUser('monUser', 'monPassword');

        expect(data).toEqual(fakeResponse);
        expect(global.fetch).toHaveBeenCalledWith(
            `${API_BASE_URL}/login`,
            expect.objectContaining({
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: 'monUser', password: 'monPassword' })
            })
        );
    });

    test('doit lever une erreur en cas de réponse non ok pour loginUser', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
            text: async () => 'Unauthorized'
        });

        await expect(loginUser('monUser', 'mauvaisPassword'))
            .rejects.toThrow('Erreur HTTP 401 : Unauthorized');
    });
});

describe('fetchUser', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('doit retourner les données utilisateur en cas de succès pour fetchUser', async () => {
        const fakeUser = { username: 'monUser', name: 'Test User' };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => fakeUser,
        });

        const data = await fetchUser('monUser', 'monToken');

        expect(data).toEqual(fakeUser);
        expect(global.fetch).toHaveBeenCalledWith(
            `${API_BASE_URL}/users/monUser`,
            expect.objectContaining({
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer monToken'
                }
            })
        );
    });

    test('doit lever une erreur en cas de réponse non ok pour fetchUser', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            text: async () => 'User not found'
        });

        await expect(fetchUser('monUser', 'mauvaisToken'))
            .rejects.toThrow("Erreur lors de la récupération de l'utilisateur : User not found");
    });
});

describe('fetchRecipes', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('doit retourner les recettes si le JSON est valide', async () => {
        const fakeRecipes = [{ id: 1, name: 'Recette 1' }, { id: 2, name: 'Recette 2' }];
        global.fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => JSON.stringify(fakeRecipes)
        });

        const recipes = await fetchRecipes();

        expect(recipes).toEqual(fakeRecipes);
    });

    test('doit lever une erreur en cas de JSON invalide pour fetchRecipes', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => "Not a JSON"
        });

        await expect(fetchRecipes())
            .rejects.toThrow("Le serveur n’a pas renvoyé de JSON valide.");
    });

    test('doit lever une erreur en cas de réponse non ok pour fetchRecipes', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: async () => 'Internal Server Error'
        });

        await expect(fetchRecipes())
            .rejects.toThrow('Erreur HTTP 500 : Internal Server Error');
    });
});

describe('fetchRecipe', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('doit retourner la recette si le JSON est valide', async () => {
        const fakeRecipe = { id: 1, name: 'Recette 1' };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => JSON.stringify(fakeRecipe)
        });

        const recipe = await fetchRecipe(1);

        expect(recipe).toEqual(fakeRecipe);
    });

    test('doit lever une erreur en cas de JSON invalide pour fetchRecipe', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => "Not a JSON"
        });

        await expect(fetchRecipe(1))
            .rejects.toThrow("Le serveur n’a pas renvoyé de JSON valide pour la recette.");
    });

    test('doit lever une erreur en cas de réponse non ok pour fetchRecipe', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            text: async () => "Not found"
        });

        await expect(fetchRecipe(1))
            .rejects.toThrow("Erreur HTTP 404 : Not found");
    });
});

describe('fetchRelatedRecipes', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('doit retourner les recettes liées si le JSON est valide', async () => {
        const fakeRelated = [{ id: 2, name: 'Recette liée' }];
        global.fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => JSON.stringify(fakeRelated)
        });

        const related = await fetchRelatedRecipes(1);

        expect(related).toEqual(fakeRelated);
    });

    test('doit retourner un tableau vide si la réponse n’est pas ok', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            text: async () => 'Error'
        });

        const related = await fetchRelatedRecipes(1);

        expect(related).toEqual([]);
    });

    test('doit retourner un tableau vide si le JSON est invalide', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => "Invalid JSON"
        });

        const related = await fetchRelatedRecipes(1);

        expect(related).toEqual([]);
    });
});

describe('addFavorite', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('doit retourner le texte de confirmation en cas de succès pour addFavorite', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => "Favorite added"
        });

        const response = await addFavorite('monUser', 'monToken', 1);

        expect(response).toEqual("Favorite added");
        expect(global.fetch).toHaveBeenCalledWith(
            `${API_BASE_URL}/users/monUser/favorites?recipeID=1`,
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    Authorization: 'Bearer monToken'
                })
            })
        );
    });

    test('doit lever une erreur en cas d’échec pour addFavorite', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            text: async () => "Could not add"
        });

        await expect(addFavorite('monUser', 'monToken', 1))
            .rejects.toThrow("Impossible d’ajouter la recette aux favoris : Could not add");
    });
});

describe('fetchFavorites', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('doit retourner la liste des favoris en cas de succès pour fetchFavorites', async () => {
        const fakeFavorites = [1, 2, 3];
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => fakeFavorites,
        });

        const favorites = await fetchFavorites('monToken');

        expect(favorites).toEqual(fakeFavorites);
        expect(global.fetch).toHaveBeenCalledWith(
            `${API_BASE_URL}/favorites`,
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    Authorization: 'Bearer monToken'
                })
            })
        );
    });

    test('doit lever une erreur en cas de réponse non ok pour fetchFavorites', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: async () => 'Server error'
        });

        await expect(fetchFavorites('monToken'))
            .rejects.toThrow('Erreur HTTP 500 : Server error');
    });
});

describe('removeFavorite', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('doit retourner le texte de confirmation en cas de succès pour removeFavorite', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => "Favorite removed"
        });

        const response = await removeFavorite('monUser', 'monToken', 1);

        expect(response).toEqual("Favorite removed");
        expect(global.fetch).toHaveBeenCalledWith(
            `${API_BASE_URL}/users/monUser/favorites?recipeID=1`,
            expect.objectContaining({
                method: 'DELETE',
                headers: expect.objectContaining({
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    Authorization: 'Bearer monToken'
                })
            })
        );
    });

    test('doit lever une erreur en cas d’échec pour removeFavorite', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            text: async () => "Not Found"
        });

        await expect(removeFavorite('monUser', 'monToken', 1))
            .rejects.toThrow("Erreur HTTP 404 : Not Found");
    });
});