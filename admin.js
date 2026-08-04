const form = document.getElementById("movieForm");

const title = document.getElementById("title");
const description = document.getElementById("description");
const image = document.getElementById("image");
const category = document.getElementById("category");
const trailer = document.getElementById("trailer");

const video = document.getElementById("video");
const year = document.getElementById("year");
const duration = document.getElementById("duration");
const rating = document.getElementById("rating");

const movieList = document.getElementById("movieList");

let editMovieId = null;

// ====================================
// Load Movies
// ====================================

async function loadMovies() {

    try {

        const response = await fetch("http://localhost:5000/api/movies");

        const movies = await response.json();

        movieList.innerHTML = "";

        movies.forEach(movie => {

            movieList.innerHTML += `

                <div class="movie-card">

                    <img src="${movie.image}" alt="${movie.title}">

                    <div class="movie-info">

                        <h3>${movie.title}</h3>

                        <p>${movie.description}</p>

                        <p><strong>Category:</strong> ${movie.category}</p>

                        <p><strong>Year:</strong> ${movie.year || "N/A"}</p>

                        <p><strong>Duration:</strong> ${movie.duration || "N/A"}</p>

                        <p><strong>Rating:</strong> ${movie.rating || "N/A"}</p>

                        <p><strong>Trailer:</strong> ${movie.trailer || "Not Added"}</p>

                        <button onclick="editMovie('${movie._id}')">
                            ✏️ Edit
                        </button>

                        <button onclick="deleteMovie('${movie._id}')">
                            🗑️ Delete
                        </button>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        console.log(error);

    }

}

loadMovies();


// ====================================
// Add / Update Movie
// ====================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

  console.log("Video Input:", video.value);

const movie = {

    title: title.value,

    description: description.value,

    image: image.value,

    category: category.value,

    trailer: trailer.value,

    video: video.value,

    year: year.value,

    duration: duration.value,

    rating: rating.value

};

console.log("Movie Object:", movie);

    try {

        // ADD

        if (editMovieId === null) {

            await fetch("http://localhost:5000/api/movies", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(movie)

            });

            alert("Movie Added Successfully!");

        }

        // UPDATE

        else {

            await fetch(`http://localhost:5000/api/movies/${editMovieId}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(movie)

            });

            alert("Movie Updated Successfully!");

            editMovieId = null;

            form.querySelector("button").innerText = "Add Movie";

        }

        form.reset();

        loadMovies();

    }

    catch (error) {

        console.log(error);

    }

});


// ====================================
// Edit Movie
// ====================================

async function editMovie(id) {

    try {

        const response = await fetch(`http://localhost:5000/api/movies/${id}`);

        const movie = await response.json();

        title.value = movie.title;
        description.value = movie.description;
        image.value = movie.image;
        category.value = movie.category;
        trailer.value = movie.trailer || "";
        video.value = movie.video || "";
        year.value = movie.year || "";
        duration.value = movie.duration || "";
        rating.value = movie.rating || "";
        trailer.value=movie.trailer;


quality.value=movie.quality;

age.value=movie.age;

language.value=movie.language;

genre.value=movie.genre;

        editMovieId = id;

        form.querySelector("button").innerText = "Update Movie";

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

    catch (error) {

        console.log(error);

    }

}


// ====================================
// Delete Movie
// ====================================

async function deleteMovie(id) {

    const confirmDelete = confirm("Are you sure you want to delete this movie?");

    if (!confirmDelete) {

        return;

    }

    try {

        await fetch(`http://localhost:5000/api/movies/${id}`, {

            method: "DELETE"

        });

        alert("Movie Deleted Successfully!");

        loadMovies();

    }

    catch (error) {

        console.log(error);

    }

}