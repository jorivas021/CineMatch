# 🎬 CinéMatch — Catalogue de Films Dynamique (TMDB)

> **Projet de module JavaScript** — Application web Single Page Application (SPA) permettant de consulter les tendances du cinéma, de rechercher des films et de gérer ses favoris via l'API publique TMDB.

---

## 📌 Présentation du Projet

**CinéMatch** est une interface interactive dédiée aux passionnés de cinéma. Connectée en temps réel à l'API REST **The Movie Database (TMDB)**, l'application offre un parcours fluide pour explorer les sorties populaires, analyser les notes de la communauté, consulter les fiches détaillées dans une modale dédiée et enregistrer ses films coup de cœur en local.

Le projet met l'accent sur l'**expérience utilisateur (UX)**, l'**accessibilité**, l'**ergonomie responsive** et l'**optimisation de la mémoire du navigateur**.

---

## 🚀 Fonctionnalités Principales

### 🔴 Niveau 1 : Les Fondamentaux & Intégration API
* **Connexion à TMDB API** : Consommation de l'endpoint `/movie/popular` via `fetch()` et `async/await`.
* **Grille de Cartes Responsive** : Affichage fluide avec CSS Grid incluant les affiches de films (posters), les titres, les dates de sortie et les notes globales.
* **États UX Dynamiques** : 
  * Indicateur de chargement (**Loader**) pendant la récupération réseau.
  * Gestion d'erreurs lisible avec retours visuels explicites pour l'utilisateur.

### 🟡 Niveau 2 : Interactivité, Recherche & Filtres Visuels
* **Moteur de Recherche Intégré** : Requêtes en temps réel sur l'endpoint `/search/movie` de l'API.
* **Code Couleur Dynamique des Notes** :
  * 🟢 **Vert** : Note $\ge 7.0$ (Film très bien noté)
  * 🟠 **Orange** : Note entre $5.0$ et $6.9$ (Film moyennement noté)
  * 🔴 **Rouge** : Note $< 5.0$ (Film faiblement noté)
* **Barre de Navigation par Onglets** : Basculement instantané entre l'onglet *Tendances* et la vue *Favoris*.

### 🟢 Niveau 3 : UX Avancée & Persistance
* **Modale de Détails Responsive** : Fenêtre modale superposée sans rechargement de page, affichant :
  * Le synopsis complet (*overview*)
  * La liste des genres du film
  * La durée et la date de sortie exacte
  * La note détaillée et le nombre de votes
  * *Zone de défilement scrollable adaptée aux écrans mobiles et synopsis longs*.
* **Gestion des Favoris (`localStorage`)** :
  * Ajout/Retrait d'un film via le bouton "Cœur" (Event Delegation).
  * Persistance des données au rafraîchissement ou à la fermeture du navigateur.
  * Compteur dynamique de favoris dans la barre de navigation.

---

## 🛠️ Technologies Utilisées

| Domaine | Technologie |
| :--- | :--- |
| **HTML5** | Sémantique conforme W3C, hiérarchie de titres stricte |
| **CSS3** | CSS Grid, Flexbox, Variables CSS, Modale responsive avec `max-height` & `overflow-y` |
| **JavaScript (ES6+)** | `async/await`, API `fetch()`, `localStorage`, Event Delegation |
| **API Externe** | [The Movie Database (TMDB API v3)](https://www.themoviedb.org/documentation/api) |
| **Typographie / Icônes** | Google Fonts (Inter), Icônes SVG inline |

---

## 📂 Structure du Projet

```text
cinematch/
├── index.html        # Structure HTML5 principale de la SPA
├── css/style.css        # Styles UI, grille responsive, thèmes et modale
├── js/app.js            # Logique REST API, manipulation du DOM, gestion des favoris
└── README.md         # Documentation de présentation du projet