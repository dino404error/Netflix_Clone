const params = new URLSearchParams(window.location.search);

const id = params.get("id");

async function loadMovie() {

    try {

        const response = await fetch(`http://localhost:5000/api/movies/${id}`);

        const movie = await response.json();

        document.getElementById("movieImage").src = movie.image;
        document.getElementById("movieTitle").innerText = movie.title;
        document.getElementById("movieCategory").innerText = movie.category;
        document.getElementById("movieDescription").innerText = movie.description;

    }

    catch (error) {

        console.log(error);

    }

}

loadMovie();