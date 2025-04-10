# GourmetRepo

Gourmet Recipes est une application web qui permet de découvrir, rechercher et consulter des recettes de cuisine. Le site propose une liste complète des recettes. L’utilisateur peut également se connecter, consulter les détails d’une recette, et ajouter ses recettes préférées en favorites.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture et structure du projet](#architecture-et-structure-du-projet)
- [Installation et exécution](#installation-et-exécution)
- [Utilisation](#utilisation)
- [Déploiement via Docker](#déploiement-via-docker)
- [API externe](#api-externe)

## Fonctionnalités

- **Liste des recettes** : Affichage de toutes les recettes disponibles.
- **Recherche** : Une barre de recherche permet de filtrer localement les recettes affichées.
- **Détail d'une recette** : En cliquant sur une recette, l’utilisateur accède à une page détaillée affichant l'image, la description, les temps de préparation et cuisson, les calories, etc.
- **Favoris** : Authentification utilisateur et ajout/retrait de recettes dans une liste de favoris.
- **Design sobre et moderne** : Utilisation de CSS pour un rendu élégant sans recourir à des frameworks externes.

## Technologies utilisées

- **React** – Pour la création des composants interactifs.
- **React Router** – Pour la navigation entre les pages (Home, Recipe, Login, Favorites).
- **CSS** – Pour la mise en forme et le design.
- **Fetch API** – Pour communiquer avec l’API externe.
- **Docker** – Pour le déploiement de l’application.
- **DOMPurify** – Pour sécuriser l’affichage de contenus HTML venant de l’API.
- **React Icons** – Pour les icônes utilisées dans l’interface.
- **React Toastify** – Pour afficher des notifications de succès ou d’erreur.
- **Swagger** – Documentation de l’API externe utilisée (https://gourmet.cours.quimerch.com/swagger/).

## Architecture et structure du projet

La structure du projet est organisée de manière modulaire et suit les standards d'une application React

## Installation et exécution

### En local

1. **Cloner le dépôt :**
   git clone https://github.com/DamsOuz/GourmetRepo.git
   cd gourmet-recipes-app
2. **Installer les dépendances :**
   npm install
3. **Exécuter le serveur de développement :**
   npm run dev
4. **Ouvrir le navigateur :**
   Aller sur http://localhost:8080 (ou le port indiqué dans le terminal) pour voir l'application en local

## Utilisation

- Page d'accueil : Affiche la liste des recettes et une barre de recherche pour filtrer.

- Détails d'une recette : En cliquant sur une carte de recette, l’utilisateur accède à la page de détails où il peut voir toutes les informations (temps, calories, etc.) et ajouter la recette aux favoris.

- Authentification et Favoris : L’utilisateur peut se connecter via la page de connexion. Une fois connecté, il peut ajouter ou retirer des recettes de ses favoris.


## Déploiement via Docker

1. Construire l'image Docker :
   docker build --no-cache --platform linux/amd64 -t damsouz/gourmet-recipes-app:latest .

2. Push l'image sur Docker Hub :
   docker push damsouz/gourmet-recipes-app:latest

## API externe :

L’application consomme l’API située à l’adresse https://gourmet.cours.quimerch.com, dont la documentation complète est disponible via Swagger : https://gourmet.cours.quimerch.com/swagger/
