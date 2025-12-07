const API_URL = 'http://localhost:3000/movies';

const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');

let allMovies = [];

// ------------------ RENDER MOVIES ------------------
function renderMovies(moviesToDisplay) {
    movieListDiv.innerHTML = '';

    if (moviesToDisplay.length === 0) {
        movieListDiv.innerHTML = '<p>No movies found matching your criteria.</p>';
        return;
    }

    moviesToDisplay.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-item');

        movieElement.innerHTML = `
            <p><strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}</p>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        movieListDiv.appendChild(movieElement);

        // Edit button
        movieElement.querySelector('.edit-btn').addEventListener('click', function() {
            showEditForm(movie, movieElement);
        });

        // Delete button
        movieElement.querySelector('.delete-btn').addEventListener('click', function() {
            deleteMovie(movie.id);
        });
    });
}

// ------------------ FETCH MOVIES ------------------
function fetchMovies() {
    fetch(API_URL)
        .then(response => response.json())
        .then(movies => {
            allMovies = movies;
            renderMovies(allMovies);
        })
        .catch(error => console.error('Error fetching movies:', error));
}

fetchMovies();

// ------------------ SEARCH MOVIES ------------------
searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredMovies = allMovies.filter(movie => {
        return movie.title.toLowerCase().includes(searchTerm) ||
               movie.genre.toLowerCase().includes(searchTerm);
    });
    renderMovies(filteredMovies);
});

// ------------------ ADD NEW MOVIE ------------------
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const newMovie = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        year: parseInt(document.getElementById('year').value)
    };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie),
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to add movie');
        return response.json();
    })
    .then(() => {
        form.reset();
        fetchMovies();
    })
    .catch(error => console.error('Error adding movie:', error));
});

// ------------------ SHOW EDIT FORM ------------------
function showEditForm(movie, movieElement) {
    movieElement.innerHTML = `
        <input type="text" id="edit-title" value="${movie.title}">
        <input type="number" id="edit-year" value="${movie.year}">
        <input type="text" id="edit-genre" value="${movie.genre}">
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
    `;

    movieElement.querySelector('.save-btn').addEventListener('click', function() {
        const updatedMovie = {
            title: document.getElementById('edit-title').value,
            year: parseInt(document.getElementById('edit-year').value),
            genre: document.getElementById('edit-genre').value
        };
        updateMovie(movie.id, updatedMovie);
    });

    movieElement.querySelector('.cancel-btn').addEventListener('click', function() {
        renderMovies(allMovies);
    });
}

// ------------------ UPDATE MOVIE ------------------
function updateMovie(movieId, updatedMovieData) {
    fetch(`${API_URL}/${movieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovieData),
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to update movie');
        return response.json();
    })
    .then(() => fetchMovies())
    .catch(error => console.error('Error updating movie:', error));
}

// ------------------ DELETE MOVIE ------------------
function deleteMovie(movieId) {
    fetch(`${API_URL}/${movieId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to delete movie');
        fetchMovies();
    })
    .catch(error => console.error('Error deleting movie:', error));
}
