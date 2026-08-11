// =========================================================
// NETFLIX CLONE
// ADMIN DASHBOARD
// FINAL VERSION
// =========================================================


const API_URL = "http://localhost:5000/api/movies";


// =========================================================
// ELEMENTS
// =========================================================

const movieForm = document.getElementById("movieForm");

const movieIdInput = document.getElementById("movieId");

const titleInput = document.getElementById("title");

const descriptionInput =
    document.getElementById("description");

const imageInput =
    document.getElementById("image");

const categoryInput =
    document.getElementById("category");

const trailerInput =
    document.getElementById("trailer");

const videoInput =
    document.getElementById("video");

const yearInput =
    document.getElementById("year");

const durationInput =
    document.getElementById("duration");

const ratingInput =
    document.getElementById("rating");

const qualityInput =
    document.getElementById("quality");

const movieList =
    document.getElementById("movieList");

const movieCount =
    document.getElementById("movieCount");

const formTitle =
    document.getElementById("formTitle");

const submitMovieBtn =
    document.getElementById("submitMovieBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const refreshMoviesBtn =
    document.getElementById("refreshMoviesBtn");

const adminSearch =
    document.getElementById("adminSearch");

const adminLogout =
    document.getElementById("adminLogout");

const adminToast =
    document.getElementById("adminToast");


// =========================================================
// GLOBAL DATA
// =========================================================

let allMovies = [];


// =========================================================
// INITIALIZE
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    loadMovies();

});


// =========================================================
// LOAD MOVIES
// =========================================================

async function loadMovies() {

    try {

        movieList.innerHTML = `
            <div class="admin-loading">

                <i class="fa-solid fa-spinner fa-spin"></i>

                <p>Loading movies...</p>

            </div>
        `;


        const response = await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Unable to load movies."
            );

        }


        const data = await response.json();


        allMovies = Array.isArray(data)
            ? data
            : [];


        renderMovies(allMovies);

        updateMovieCount();


        console.log(
            "Movies loaded:",
            allMovies
        );

    }

    catch (error) {

        console.error(
            "LOAD MOVIES ERROR:",
            error
        );


        movieList.innerHTML = `
            <div class="admin-error">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>
                    Could not load movies
                </h3>

                <p>
                    Make sure your backend is running on port 5000.
                </p>

                <button onclick="loadMovies()">
                    Try Again
                </button>

            </div>
        `;

    }

}


// =========================================================
// RENDER MOVIES
// =========================================================

function renderMovies(movies) {

    movieList.innerHTML = "";


    if (!movies || movies.length === 0) {

        movieList.innerHTML = `
            <div class="no-movies">

                <i class="fa-solid fa-film"></i>

                <h3>
                    No Movies Found
                </h3>

                <p>
                    Add your first movie using the form above.
                </p>

            </div>
        `;

        return;

    }


    movies.forEach(movie => {

        movieList.innerHTML +=
            createMovieCard(movie);

    });

}


// =========================================================
// CREATE MOVIE CARD
// =========================================================

function createMovieCard(movie) {

    return `

        <article
            class="admin-movie-card"
            data-id="${movie._id}"
        >

            <div class="admin-poster">

                <img
                    src="${escapeHtml(movie.image || "")}"
                    alt="${escapeHtml(movie.title || "Movie")}"
                    onerror="this.src='https://via.placeholder.com/300x450/222/fff?text=No+Image'"
                >

            </div>


            <div class="admin-movie-info">


                <div class="admin-movie-top">

                    <h3>
                        ${escapeHtml(
                            movie.title || "Untitled"
                        )}
                    </h3>

                    <span class="admin-category">
                        ${escapeHtml(
                            movie.category || "Other"
                        )}
                    </span>

                </div>


                <div class="admin-meta">

                    <span>
                        <i class="fa-regular fa-calendar"></i>

                        ${movie.year || "N/A"}
                    </span>


                    <span>
                        <i class="fa-solid fa-star"></i>

                        ${escapeHtml(
                            movie.rating || "N/A"
                        )}
                    </span>


                    <span>
                        <i class="fa-regular fa-clock"></i>

                        ${escapeHtml(
                            movie.duration || "N/A"
                        )}
                    </span>


                    <span>
                        <i class="fa-solid fa-display"></i>

                        ${escapeHtml(
                            movie.quality || "HD"
                        )}
                    </span>

                </div>


                <p class="admin-description">

                    ${escapeHtml(
                        movie.description ||
                        "No description available."
                    )}

                </p>


                <div class="admin-movie-actions">

                    <a
                        href="movie.html?id=${movie._id}"
                        class="view-btn"
                    >
                        <i class="fa-solid fa-eye"></i>
                        View
                    </a>


                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editMovie('${movie._id}')"
                    >
                        <i class="fa-solid fa-pen"></i>
                        Edit
                    </button>


                    <button
                        type="button"
                        class="delete-btn"
                        onclick="deleteMovie('${movie._id}')"
                    >
                        <i class="fa-solid fa-trash"></i>
                        Delete
                    </button>

                </div>

            </div>

        </article>

    `;

}


// =========================================================
// ADD / UPDATE MOVIE
// =========================================================

movieForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const movieId =
            movieIdInput.value.trim();


        const movieData = {

            title:
                titleInput.value.trim(),

            description:
                descriptionInput.value.trim(),

            image:
                imageInput.value.trim(),

            category:
                categoryInput.value.trim(),

            trailer:
                trailerInput.value.trim(),

            video:
                videoInput.value.trim(),

            year:
                yearInput.value
                    ? Number(yearInput.value)
                    : null,

            duration:
                durationInput.value.trim(),

            rating:
                ratingInput.value.trim(),

            quality:
                qualityInput.value.trim() || "HD"

        };


        // -------------------------
        // VALIDATION
        // -------------------------

        if (!movieData.title) {

            showToast(
                "Movie title is required.",
                "error"
            );

            return;

        }


        if (!movieData.description) {

            showToast(
                "Movie description is required.",
                "error"
            );

            return;

        }


        if (!movieData.image) {

            showToast(
                "Poster image URL is required.",
                "error"
            );

            return;

        }


        if (!movieData.category) {

            showToast(
                "Please select a category.",
                "error"
            );

            return;

        }


        try {

            submitMovieBtn.disabled = true;


            submitMovieBtn.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                ${movieId ? "Updating..." : "Adding..."}
            `;


            let response;


            // -------------------------
            // UPDATE
            // -------------------------

            if (movieId) {

                response = await fetch(
                    `${API_URL}/${movieId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(movieData)
                    }
                );

            }


            // -------------------------
            // ADD
            // -------------------------

            else {

                response = await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(movieData)
                    }
                );

            }


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to save movie."
                );

            }


            // -------------------------
            // SUCCESS
            // -------------------------

            showToast(
                movieId
                    ? "Movie updated successfully!"
                    : "Movie added successfully!",
                "success"
            );


            resetForm();


            await loadMovies();

        }

        catch (error) {

            console.error(
                "SAVE MOVIE ERROR:",
                error
            );


            showToast(
                error.message ||
                "Failed to save movie.",
                "error"
            );

        }

        finally {

            submitMovieBtn.disabled = false;

        }

    }
);


// =========================================================
// EDIT MOVIE
// =========================================================

function editMovie(id) {

    const movie =
        allMovies.find(
            item => item._id === id
        );


    if (!movie) {

        showToast(
            "Movie not found.",
            "error"
        );

        return;

    }


    // -------------------------
    // FILL FORM
    // -------------------------

    movieIdInput.value =
        movie._id || "";

    titleInput.value =
        movie.title || "";

    descriptionInput.value =
        movie.description || "";

    imageInput.value =
        movie.image || "";

    categoryInput.value =
        movie.category || "";

    trailerInput.value =
        movie.trailer || "";

    videoInput.value =
        movie.video || "";

    yearInput.value =
        movie.year || "";

    durationInput.value =
        movie.duration || "";

    ratingInput.value =
        movie.rating || "";

    qualityInput.value =
        movie.quality || "HD";


    // -------------------------
    // CHANGE FORM
    // -------------------------

    formTitle.innerHTML = `
        <i class="fa-solid fa-pen"></i>
        Edit Movie
    `;


    submitMovieBtn.innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Update Movie
    `;


    cancelEditBtn.style.display =
        "block";


    // -------------------------
    // SCROLL
    // -------------------------

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// =========================================================
// DELETE MOVIE
// =========================================================

async function deleteMovie(id) {

    const movie =
        allMovies.find(
            item => item._id === id
        );


    if (!movie) {

        showToast(
            "Movie not found.",
            "error"
        );

        return;

    }


    const confirmed =
        confirm(
            `Delete "${movie.title}"?\n\nThis action cannot be undone.`
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete movie."
            );

        }


        showToast(
            "Movie deleted successfully!",
            "success"
        );


        await loadMovies();

    }

    catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        showToast(
            error.message ||
            "Failed to delete movie.",
            "error"
        );

    }

}


// =========================================================
// CANCEL EDIT
// =========================================================

cancelEditBtn.addEventListener(
    "click",
    () => {

        resetForm();

    }
);


// =========================================================
// RESET FORM
// =========================================================

function resetForm() {

    movieForm.reset();


    movieIdInput.value = "";


    ratingInput.value = "";

    qualityInput.value = "HD";


    formTitle.innerHTML = `
        <i class="fa-solid fa-plus"></i>
        Add New Movie
    `;


    submitMovieBtn.innerHTML = `
        <i class="fa-solid fa-plus"></i>
        Add Movie
    `;


    cancelEditBtn.style.display =
        "none";

}


// =========================================================
// REFRESH
// =========================================================

refreshMoviesBtn.addEventListener(
    "click",
    async () => {

        refreshMoviesBtn.disabled = true;


        refreshMoviesBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Loading
        `;


        await loadMovies();


        refreshMoviesBtn.disabled = false;


        refreshMoviesBtn.innerHTML = `
            <i class="fa-solid fa-rotate"></i>
            Refresh
        `;

    }
);


// =========================================================
// SEARCH
// =========================================================

adminSearch.addEventListener(
    "input",
    () => {

        const value =
            adminSearch.value
                .trim()
                .toLowerCase();


        if (!value) {

            renderMovies(allMovies);

            return;

        }


        const filtered =
            allMovies.filter(movie => {

                const title =
                    String(
                        movie.title || ""
                    ).toLowerCase();


                const category =
                    String(
                        movie.category || ""
                    ).toLowerCase();


                return (
                    title.includes(value) ||
                    category.includes(value)
                );

            });


        renderMovies(filtered);

    }
);


// =========================================================
// MOVIE COUNT
// =========================================================

function updateMovieCount() {

    movieCount.textContent =
        allMovies.length;

}


// =========================================================
// LOGOUT
// =========================================================

adminLogout.addEventListener(
    "click",
    () => {

        localStorage.removeItem("token");

        localStorage.removeItem("email");

        localStorage.removeItem("userId");

        window.location.href =
            "login.html";

    }
);


// =========================================================
// TOAST
// =========================================================

function showToast(
    message,
    type = "success"
) {

    adminToast.textContent =
        message;


    adminToast.className =
        `admin-toast ${type} show`;


    setTimeout(() => {

        adminToast.classList.remove(
            "show"
        );

    }, 3000);

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================================================
// DEBUG
// =========================================================

console.log(
    "Netflix Admin Dashboard Loaded Successfully 🚀"
);