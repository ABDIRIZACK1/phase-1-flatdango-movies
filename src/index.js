document.addEventListener('DOMContentLoaded', () => {
          const baseURL = 'http://localhost:3000';
        
          // Function to fetch and display movie details
          const fetchMovieDetails = async (filmId) => {
            try {
              const response = await fetch(`${baseURL}/films/${filmId}`);
              if (!response.ok) {
                throw new Error('Failed to fetch movie details');
              }
              const movieData = await response.json();
        
              // Update DOM with movie details
              const posterImg = document.getElementById('poster');
              posterImg.src = movieData.poster;
              posterImg.alt = movieData.title;
        
              const titleElement = document.getElementById('title');
              titleElement.textContent = movieData.title;
        
              const runtimeElement = document.getElementById('runtime');
              runtimeElement.textContent = `${movieData.runtime} minutes`;
        
              const filmInfoElement = document.getElementById('film-info');
              filmInfoElement.textContent = movieData.description;
        
              const showtimeElement = document.getElementById('showtime');
              showtimeElement.textContent = movieData.showtime;
        
              const ticketNumElement = document.getElementById('ticket-num');
              const availableTickets = movieData.capacity - movieData.tickets_sold;
              ticketNumElement.textContent = `${availableTickets} remaining tickets`;
        
              // Add event listener for Buy Ticket button
              const buyTicketButton = document.getElementById('buy-ticket');
              buyTicketButton.addEventListener('click', async () => {
                if (availableTickets > 0) {
                  const updatedTicketsSold = movieData.tickets_sold + 1;
                  const patchResponse = await fetch(`${baseURL}/films/${movieData.id}`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
                  });
                  if (patchResponse.ok) {
                    // Update DOM with new ticket count
                    ticketNumElement.textContent = `${availableTickets - 1} remaining tickets`;
                  } else {
                    console.error('Failed to update tickets sold');
                  }
                } else {
                  alert('Sorry, this showing is sold out.');
                }
              });
            } catch (error) {
              console.error('Error fetching movie details:', error);
            }
          };
        
          // Function to fetch all movies and populate the films menu
          const fetchAllMovies = async () => {
            try {
              const response = await fetch(`${baseURL}/films`);
              if (!response.ok) {
                throw new Error('Failed to fetch movies list');
              }
              const moviesList = await response.json();
        
              // Populate films menu
              const filmsMenu = document.getElementById('films');
              filmsList.innerHTML = ''; // Clear existing items
              moviesList.forEach((movie) => {
                const filmItem = document.createElement('li');
                filmItem.classList.add('film', 'item');
                filmItem.dataset.filmId = movie.id;
                filmItem.textContent = movie.title;
                filmsMenu.appendChild(filmItem);
        
                filmItem.addEventListener('click', () => {
                  fetchMovieDetails(movie.id);
                });
              });
            } catch (error) {
              console.error('Error fetching movies list:', error);
            }
          };
        
          // Call fetchAllMovies when the page loads
          fetchAllMovies();
        
          // Add event listener for Delete Film button (assuming there's a delete button in the film item)
          const filmsList = document.getElementById('films');
          filmsList.addEventListener('click', async (event) => {
            if (event.target.classList.contains('delete-btn')) {
              const filmItem = event.target.closest('.film.item');
              const filmId = filmItem.dataset.filmId;
              if (confirm('Are you sure you want to delete this film?')) {
                try {
                  const deleteResponse = await fetch(`${baseURL}/films/${filmId}`, {
                    method: 'DELETE',
                  });
                  if (deleteResponse.ok) {
                    filmItem.remove();
                  } else {
                    console.error('Failed to delete film');
                  }
                } catch (error) {
                  console.error('Error deleting film:', error);
                }
              }
            }
          });
        });
        
        
        
        
