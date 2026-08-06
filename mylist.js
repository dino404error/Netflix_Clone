const movieList = document.getElementById("movieList");

let myList = JSON.parse(localStorage.getItem("myList")) || [];

async function loadMyList() {

    movieList.innerHTML = "";

    if (myList.length === 0) {

        movieList.innerHTML = "<h2>No Movies Added ❤️</h2>";

        return;

    }

    try {

        const response = await fetch("http://localhost:5000/api/movies");

        const movies = await response.json();

        const favouriteMovies = movies.filter(movie =>
            myList.includes(movie._id)
        );

        favouriteMovies.forEach(movie => {

            movieList.innerHTML += `

            <div class="movie-card">

                <a href="movie.html?id=${movie._id}">

                    <img src="${movie.image}">

                </a>

                <h3>${movie.title}</h3>

                <p>${movie.category}</p>

                <button onclick="removeMovie('${movie._id}')">

                    Remove

                </button>

            </div>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

loadMyList();

function removeMovie(id) {

    myList = myList.filter(movieId => movieId !== id);

    localStorage.setItem("myList", JSON.stringify(myList));

    loadMyList();

}