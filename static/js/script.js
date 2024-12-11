document.getElementById("rating-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const movieRatings = Array.from(document.querySelectorAll(".rating"))
        .filter(select => select.value) // Only include rated movies
        .map(select => `${select.dataset.movieId}:${select.value}`)
        .join(",");

    const response = await fetch("/recommend", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieRatings }),
    });

    const data = await response.json();
    displayRecommendations(data.recommendations);
});

document.getElementById("no-movies").addEventListener("click", async function () {
    const selectedGenres = Array.from(document.querySelectorAll("input[name='genre']:checked"))
        .map(checkbox => checkbox.value);

    const response = await fetch("/recommend-genres", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ genres: selectedGenres }),
    });

    const data = await response.json();
    displayRecommendations(data.recommendations);
});

async function fetchMoviePoster(movieName) {
    const apiKey = "b5588811"; // Your OMDb API key
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
            return data.Poster; // Return the poster URL if the movie is found
        } else {
            return "https://via.placeholder.com/200x300?text=Poster+Not+Available"; // Placeholder for missing poster
        }
    } catch (error) {
        console.error(`Error fetching poster for ${movieName}:`, error);
        return "https://via.placeholder.com/200x300?text=Error+Loading+Poster"; // Placeholder for errors
    }
}

async function displayRecommendations(recommendations) {
    const recommendationsDiv = document.getElementById("recommendations");
    recommendationsDiv.innerHTML = ""; // Clear existing content

    if (recommendations.length > 0) {
        recommendationsDiv.innerHTML = "<h3>Recommendations:</h3>";
        const container = document.createElement("div");
        container.className = "recommendation-container";

        for (const movie of recommendations) {
            const posterUrl = await fetchMoviePoster(movie); // Fetch poster for each movie

            // Create a card for each movie
            const card = document.createElement("div");
            card.className = "movie-card";

            const poster = document.createElement("img");
            poster.src = posterUrl;
            poster.alt = `${movie} Poster`;
            poster.className = "movie-poster";

            const title = document.createElement("h3");
            title.textContent = movie;

            card.appendChild(poster);
            card.appendChild(title);
            container.appendChild(card);
        }

        recommendationsDiv.appendChild(container);
    } else {
        recommendationsDiv.innerHTML = "<p>No recommendations available.</p>";
    }
}
