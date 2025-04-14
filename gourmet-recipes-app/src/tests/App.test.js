// src/tests/App.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Favorites from '../pages/Favorites';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Spinner from '../components/Spinner';
import App from '../App';
import * as API from '../api/API';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';

// ----- Mocks ----- //

// Simulation des fonctions de l'API
jest.mock('../api/API', () => ({
    fetchRecipes: jest.fn(),
    fetchRecipe: jest.fn(),
    fetchRelatedRecipes: jest.fn(),
    fetchFavorites: jest.fn(),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    loginUser: jest.fn(),
    fetchUser: jest.fn(),
}));

// Simulation de react-toastify
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    },
    ToastContainer: () => <div data-testid="toast-container" />,
}));

// Nettoyage des mocks après chaque test
afterEach(() => {
    jest.clearAllMocks();
});

//////////////////////////////////////////
//           Favorites Component        //
//////////////////////////////////////////

describe('Favorites Component', () => {
    test("affiche un message si l'utilisateur n'est pas connecté", () => {
        render(
            <AuthContext.Provider value={{ token: null, user: null }}>
                <MemoryRouter>
                    <Favorites />
                </MemoryRouter>
            </AuthContext.Provider>
        );
        expect(
            screen.getByText(/Vous devez être connecté pour voir vos favoris/i)
        ).toBeInTheDocument();
    });

    test("affiche un message lorsqu'il n'y a pas de favoris", async () => {
        API.fetchFavorites.mockResolvedValueOnce([]);
        render(
            <AuthContext.Provider
                value={{
                    token: 'test-token',
                    user: { username: 'testuser' },
                    login: jest.fn(),
                    logout: jest.fn(),
                }}
            >
                <MemoryRouter>
                    <Favorites />
                </MemoryRouter>
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(
                screen.getByText(/Toujours pas de favori/i)
            ).toBeInTheDocument();
        });
    });

    test('affiche la liste des favoris et permet de retirer un favori', async () => {
        const fakeFavorites = [
            { recipe: { id: 1, name: 'Recette 1', image_url: 'image1.jpg' } },
        ];
        API.fetchFavorites.mockResolvedValueOnce(fakeFavorites);
        API.removeFavorite.mockResolvedValueOnce('Favorite removed');

        render(
            <AuthContext.Provider
                value={{
                    token: 'test-token',
                    user: { username: 'testuser' },
                    login: jest.fn(),
                    logout: jest.fn(),
                }}
            >
                <MemoryRouter>
                    <Favorites />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Recette 1/i)).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(/Retirer/i));
        await waitFor(() => {
            expect(API.removeFavorite).toHaveBeenCalledWith('testuser', 'test-token', 1);
            expect(toast.success).toHaveBeenCalledWith('Favori retiré avec succès.');
        });
    });
});

//////////////////////////////////////////
//             Home Component           //
//////////////////////////////////////////

describe('Home Component', () => {
    test("affiche un message d'erreur en cas d'échec de récupération des recettes", async () => {
        API.fetchRecipes.mockRejectedValueOnce(new Error('Erreur test'));
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(screen.getByText(/Erreur : Erreur test/i)).toBeInTheDocument();
        });
    });

    test('affiche "Chargement..." tant que les recettes ne sont pas chargées puis affiche les recettes', async () => {
        const fakeRecipes = [
            { id: 1, name: 'Recette 1', image_url: 'image1.jpg' },
            { id: 2, name: 'Recette 2', image_url: 'image2.jpg' },
        ];
        API.fetchRecipes.mockResolvedValueOnce(fakeRecipes);
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(screen.getByText(/Chargement.../i)).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText(/Recette 1/i)).toBeInTheDocument();
            expect(screen.getByText(/Recette 2/i)).toBeInTheDocument();
        });
    });

    test('filtre les recettes via la SearchBar', async () => {
        const fakeRecipes = [
            { id: 1, name: 'Poulet', image_url: 'image1.jpg' },
            { id: 2, name: 'riz', image_url: 'image2.jpg' },
        ];
        API.fetchRecipes.mockResolvedValueOnce(fakeRecipes);
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(screen.getByText(/Poulet/i)).toBeInTheDocument();
            expect(screen.getByText(/riz/i)).toBeInTheDocument();
        });
        const searchInput = screen.getByPlaceholderText(/Rechercher une recette/i);
        fireEvent.change(searchInput, { target: { value: 'Poulet' } });
        await waitFor(() => {
            expect(screen.getByText(/Poulet/i)).toBeInTheDocument();
            expect(screen.queryByText(/riz/i)).not.toBeInTheDocument();
        });
    });
});

//////////////////////////////////////////
//            Login Component           //
//////////////////////////////////////////

describe('Login Component', () => {
    test('rend le formulaire de connexion', () => {
        render(
            <AuthContext.Provider value={{ login: jest.fn() }}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </AuthContext.Provider>
        );
        expect(screen.getByPlaceholderText(/Entrez votre pseudonyme/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Entrez votre mot de passe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
    });

    test('soumet le formulaire et effectue la connexion avec succès', async () => {
        const fakeToken = 'fake-token';
        const fakeUser = { username: 'testuser', name: 'Test User' };
        API.loginUser.mockResolvedValueOnce({ token: fakeToken });
        API.fetchUser.mockResolvedValueOnce(fakeUser);
        const loginMock = jest.fn();
        render(
            <AuthContext.Provider value={{ login: loginMock }}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </AuthContext.Provider>
        );
        fireEvent.change(screen.getByPlaceholderText(/Entrez votre pseudonyme/i), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Entrez votre mot de passe/i), {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));
        await waitFor(() => {
            expect(API.loginUser).toHaveBeenCalledWith('testuser', 'password123');
            expect(API.fetchUser).toHaveBeenCalledWith('testuser', fakeToken);
            expect(loginMock).toHaveBeenCalledWith(fakeToken, fakeUser);
            expect(toast.success).toHaveBeenCalledWith('Connexion réussie !');
        });
    });

    test("affiche une erreur en cas de connexion échouée", async () => {
        API.loginUser.mockRejectedValueOnce(new Error('Erreur de connexion'));
        render(
            <AuthContext.Provider value={{ login: jest.fn() }}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </AuthContext.Provider>
        );
        fireEvent.change(screen.getByPlaceholderText(/Entrez votre pseudonyme/i), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Entrez votre mot de passe/i), {
            target: { value: 'wrongpassword' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));
        await waitFor(() => {
            expect(API.loginUser).toHaveBeenCalledWith('testuser', 'wrongpassword');
            expect(toast.error).toHaveBeenCalledWith(
                'Identifiants invalides ou erreur de connexion.'
            );
        });
    });
});

//////////////////////////////////////////
//           Header Component           //
//////////////////////////////////////////

describe('Header Component', () => {
    test("affiche le lien de connexion si l'utilisateur n'est pas connecté", () => {
        render(
            <AuthContext.Provider value={{ token: null, user: null }}>
                <MemoryRouter>
                    <Header />
                </MemoryRouter>
            </AuthContext.Provider>
        );
        expect(screen.getByRole('link', { name: /Connexion/i })).toBeInTheDocument();
    });

    test("affiche le nom d'utilisateur et le bouton de déconnexion si connecté", () => {
        const logoutMock = jest.fn();
        render(
            <AuthContext.Provider value={{ token: 'test-token', user: { username: 'testuser' }, logout: logoutMock }}>
                <MemoryRouter>
                    <Header />
                </MemoryRouter>
            </AuthContext.Provider>
        );
        expect(screen.getByText(/Connecté en tant que/i)).toBeInTheDocument();
        expect(screen.getByText(/testuser/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Déconnexion/i })).toBeInTheDocument();
    });
});

//////////////////////////////////////////
//          SearchBar Component         //
//////////////////////////////////////////

describe('SearchBar Component', () => {
    test("appelle la fonction onSearch lors d'un changement de valeur", () => {
        const onSearchMock = jest.fn();
        render(<SearchBar onSearch={onSearchMock} />);
        const input = screen.getByPlaceholderText(/Rechercher une recette/i);
        fireEvent.change(input, { target: { value: 'riz' } });
        expect(onSearchMock).toHaveBeenCalledWith('riz');
    });
});

//////////////////////////////////////////
//           Spinner Component          //
//////////////////////////////////////////

describe('Spinner Component', () => {
    test('rend correctement le spinner', () => {
        render(<Spinner />);
        expect(document.querySelector('.spinner')).toBeInTheDocument();
    });
});

//////////////////////////////////////////
//        App Component Routing         //
//////////////////////////////////////////

describe('App Component Routing', () => {
    test('rend le composant Home par défaut', async () => {
        const fakeRecipes = [
            { id: 1, name: 'Recette 1', image_url: 'image1.jpg' },
        ];
        API.fetchRecipes.mockResolvedValueOnce(fakeRecipes);
        window.history.pushState({}, '', '/');
        // Ici, <App /> gère déjà son Router
        render(
            <AuthContext.Provider value={{ token: null, user: null }}>
                <App />
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(screen.getByText(/Recette 1/i)).toBeInTheDocument();
        });
    });

    test('navigue vers la page de connexion', async () => {
        window.history.pushState({}, '', '/login');
        render(
            <AuthContext.Provider value={{ token: null, user: null }}>
                <App />
            </AuthContext.Provider>
        );
        await waitFor(() => {
            // Utiliser getByRole pour cibler précisément le lien "Connexion"
            expect(screen.getByRole('link', { name: /Connexion/i })).toBeInTheDocument();
        });
    });
});
