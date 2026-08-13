// Configuration API TMDB
const API_KEY = '69d37b87deac944221af488552302f52'; // <-- Mets ta clé ici !
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// État de l'application
let movies = [];
let favorites = JSON.parse(localStorage.getItem('cinematch_favs')) || [];

// Éléments du DOM
const moviesGrid = document.getElementById('movies-grid');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const sectionTitle = document.getElementById('section-title');

// 1. Récupération des films populaires (Niveau 1)
async function fetchPopularMovies() {
  showLoader(true);
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR`);
    if (!response.ok) throw new Error('Impossible de récupérer les films');
    
    const data = await response.json();
    movies = data.results;
    renderMovies(movies);
  } catch (error) {
    showError('Erreur de chargement des films. Vérifiez votre connexion ou votre clé API.');
  } finally {
    showLoader(false);
  }
}

// 2. Affichage des films dans le DOM
function renderMovies(movieList) {
  moviesGrid.innerHTML = '';

  if (movieList.length === 0) {
    moviesGrid.innerHTML = '<p>Aucun film trouvé.</p>';
    return;
  }

  movieList.forEach(movie => {
    const card = document.createElement('article');
    card.classList.add('movie-card');

    const poster = movie.poster_path 
      ? `${IMAGE_URL}${movie.poster_path}` 
      : 'https://via.placeholder.com/500x750?text=Affiche+Non+Disponible';

    const ratingClass = getRatingClass(movie.vote_average);

    card.innerHTML = `
      <img src="${poster}" alt="${movie.title}" class="movie-poster" loading="lazy">
      <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <div class="movie-meta">
          <span>${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
          <span class="rating-badge ${ratingClass}">${movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
    `;

    moviesGrid.appendChild(card);
  });
}

// Code couleur pour la note (Niveau 2)
function getRatingClass(vote) {
  if (vote >= 7) return 'rating-green';
  if (vote >= 5) return 'rating-orange';
  return 'rating-red';
}

function showLoader(isLoading) {
  if (isLoading) loader.classList.remove('hidden');
  else loader.classList.add('hidden');
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove('hidden');
}

// Initialisation
document.addEventListener('DOMContentLoaded', fetchPopularMovies);