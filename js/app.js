// Configuration API TMDB
const API_KEY = '69d37b87deac944221af488552302f52'; // <-- Assure-toi d'y mettre ta clé !
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
const tabPopular = document.getElementById('tab-popular');
const tabFavorites = document.getElementById('tab-favorites');
const favCountBadge = document.getElementById('fav-count');

// Modale
const movieModal = document.getElementById('movie-modal');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.getElementById('close-modal-btn');
const overlay = document.getElementById('overlay');

// ==========================================
// 1. REQUÊTES API
// ==========================================

// Récupération des films populaires
async function fetchPopularMovies() {
  showLoader(true);
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR`);
    if (!response.ok) throw new Error('Impossible de récupérer les films');
    
    const data = await response.json();
    movies = data.results;
    renderMovies(movies);
  } catch (error) {
    showError('Erreur de chargement. Vérifiez votre connexion ou votre clé API.');
  } finally {
    showLoader(false);
  }
}

// Recherche de films
async function searchMovies(query) {
  if (!query.trim()) {
    fetchPopularMovies();
    return;
  }

  showLoader(true);
  errorMessage.classList.add('hidden');

  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error('Erreur lors de la recherche');

    const data = await response.json();
    movies = data.results;

    sectionTitle.textContent = `Résultats pour "${query}"`;
    renderMovies(movies);
  } catch (error) {
    showError('Échec de la recherche.');
  } finally {
    showLoader(false);
  }
}

// Récupérer les détails d'un film spécifique pour la modale
async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`);
    if (!response.ok) throw new Error('Détails non disponibles');
    
    const movie = await response.json();
    openModal(movie);
  } catch (error) {
    alert('Impossible de charger les détails du film.');
  }
}

// ==========================================
// 2. RENDU DU DOM & CARTES
// ==========================================

function renderMovies(movieList) {
  moviesGrid.innerHTML = '';
  updateFavCount();

  if (!movieList || movieList.length === 0) {
    moviesGrid.innerHTML = '<p class="no-results">Aucun film trouvé.</p>';
    return;
  }

  movieList.forEach(movie => {
    const card = document.createElement('article');
    card.classList.add('movie-card');
    card.dataset.id = movie.id;

    const poster = movie.poster_path 
      ? `${IMAGE_URL}${movie.poster_path}` 
      : 'https://via.placeholder.com/500x750?text=Affiche+Indisponible';

    const isFav = favorites.some(fav => fav.id === movie.id);
    const ratingClass = getRatingClass(movie.vote_average);

    card.innerHTML = `
      <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${movie.id}" aria-label="Ajouter aux favoris">
        ${isFav ? '❤️' : '🤍'}
      </button>
      <img src="${poster}" alt="${escapeHtml(movie.title)}" class="movie-poster" loading="lazy">
      <div class="movie-info">
        <h3 class="movie-title">${escapeHtml(movie.title)}</h3>
        <div class="movie-meta">
          <span>${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
          <span class="rating-badge ${ratingClass}">${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
        </div>
      </div>
    `;

    moviesGrid.appendChild(card);
  });
}

function getRatingClass(vote) {
  if (vote >= 7) return 'rating-green';
  if (vote >= 5) return 'rating-orange';
  return 'rating-red';
}

// ==========================================
// 3. GESTION DES FAVORIS (localStorage)
// ==========================================

function toggleFavorite(movieId) {
  const movie = movies.find(m => m.id === movieId) || favorites.find(m => m.id === movieId);
  if (!movie) return;

  const existingIndex = favorites.findIndex(fav => fav.id === movieId);

  if (existingIndex > -1) {
    favorites.splice(existingIndex, 1);
  } else {
    favorites.push(movie);
  }

  localStorage.setItem('cinematch_favs', JSON.stringify(favorites));
  updateFavCount();

  // Si on est dans l'onglet favoris, rafraîchir la vue
  if (tabFavorites.classList.contains('active')) {
    renderMovies(favorites);
  } else {
    // Sinon mettre à jour le bouton cœur de la carte
    const cardBtn = document.querySelector(`.fav-btn[data-id="${movieId}"]`);
    if (cardBtn) {
      const isFav = favorites.some(fav => fav.id === movieId);
      cardBtn.classList.toggle('active', isFav);
      cardBtn.textContent = isFav ? '❤️' : '🤍';
    }
  }
}

function updateFavCount() {
  favCountBadge.textContent = favorites.length;
}

// ==========================================
// 4. MODALE DE DÉTAILS
// ==========================================

function openModal(movie) {
  const poster = movie.poster_path 
    ? `${IMAGE_URL}${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=Affiche+Indisponible';

  const genres = movie.genres ? movie.genres.map(g => `<span class="genre-tag">${escapeHtml(g.name)}</span>`).join('') : '';

  modalBody.innerHTML = `
    <div class="modal-grid">
      <img src="${poster}" alt="${escapeHtml(movie.title)}" class="modal-poster">
      <div class="modal-details">
        <h2>${escapeHtml(movie.title)}</h2>
        <p class="modal-tagline"><em>${movie.tagline ? escapeHtml(movie.tagline) : ''}</em></p>
        <div class="genres-container">${genres}</div>
        <h4>Synopsis</h4>
        <p class="modal-overview">${movie.overview ? escapeHtml(movie.overview) : 'Aucun synopsis disponible pour ce film.'}</p>
        <div class="modal-extra">
          <p><strong>Date de sortie :</strong> ${movie.release_date || 'Inconnue'}</p>
          <p><strong>Durée :</strong> ${movie.runtime ? movie.runtime + ' min' : 'Inconnue'}</p>
          <p><strong>Note moyenne :</strong> ⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10 (${movie.vote_count} votes)</p>
        </div>
      </div>
    </div>
  `;

  movieModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Empêcher le scroll en arrière-plan
}

function closeModal() {
  movieModal.classList.add('hidden');
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

// ==========================================
// 5. ÉVÉNEMENTS & DELEGATION
// ==========================================

// Gestion des clics sur la grille de films (Délégation)
moviesGrid.addEventListener('click', (e) => {
  const favBtn = e.target.closest('.fav-btn');
  if (favBtn) {
    e.stopPropagation();
    const movieId = parseInt(favBtn.dataset.id, 10);
    toggleFavorite(movieId);
    return;
  }

  const card = e.target.closest('.movie-card');
  if (card) {
    const movieId = parseInt(card.dataset.id, 10);
    fetchMovieDetails(movieId);
  }
});

// Événements de fermeture de la modale
closeModalBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Recherche
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value;
  tabPopular.classList.add('active');
  tabFavorites.classList.remove('active');
  searchMovies(query);
});

// Onglets
tabPopular.addEventListener('click', () => {
  tabPopular.classList.add('active');
  tabFavorites.classList.remove('active');
  searchInput.value = '';
  sectionTitle.textContent = 'Films Populaires';
  fetchPopularMovies();
});

tabFavorites.addEventListener('click', () => {
  tabFavorites.classList.add('active');
  tabPopular.classList.remove('active');
  searchInput.value = '';
  sectionTitle.textContent = 'Mes Films Favoris';
  renderMovies(favorites);
});

// Utilitaires
function showLoader(isLoading) {
  if (isLoading) loader.classList.remove('hidden');
  else loader.classList.add('hidden');
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove('hidden');
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, match => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[match]));
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  updateFavCount();
  fetchPopularMovies();
});