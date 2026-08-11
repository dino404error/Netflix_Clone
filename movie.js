// ==========================================
// NETFLIX CLONE
// MOVIE DETAILS / PLAYER PAGE
// movie.js
// ==========================================


// ==========================================
// GET MOVIE ID
// ==========================================

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");


// ==========================================
// ELEMENTS
// ==========================================

const heroBackdrop = document.getElementById("heroBackdrop");
const heroTrailer = document.getElementById("heroTrailer");
const trailerSource = document.getElementById("trailerSource");

const movieTitle = document.getElementById("movieTitle");
const movieDescription = document.getElementById("movieDescription");

const movieYear = document.getElementById("movieYear");
const movieDuration = document.getElementById("movieDuration");
const movieCategory = document.getElementById("movieCategory");

const overview = document.getElementById("overview");

const genre = document.getElementById("genre");
const release = document.getElementById("release");
const duration = document.getElementById("duration");
const language = document.getElementById("language");

const recommendedMovies =
    document.getElementById("recommendedMovies");

const playBtn =
    document.getElementById("playMovie");

const myListBtn =
    document.getElementById("myList");

const likeBtn =
    document.getElementById("likeMovie");

const soundBtn =
    document.getElementById("soundBtn");


// ==========================================
// GLOBAL
// ==========================================

let movie = null;
let muted = true;


// ==========================================
// CONVERT VIDEO URL
// ==========================================

function getVideoUrl(url) {

    if (!url) return "";

    url = url.trim();

    try {

        // ------------------------------
        // YouTube watch URL
        // ------------------------------

        if (url.includes("youtube.com/watch")) {

            const videoId =
                new URL(url).searchParams.get("v");

            if (videoId) {

                return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

            }

        }


        // ------------------------------
        // YouTube short URL
        // ------------------------------

        if (url.includes("youtu.be/")) {

            const videoId =
                url.split("youtu.be/")[1]
                    .split("?")[0];

            return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

        }


        // ------------------------------
        // Already embed URL
        // ------------------------------

        if (url.includes("youtube.com/embed/")) {

            return url;

        }


        // ------------------------------
        // Normal MP4
        // ------------------------------

        return url;

    }

    catch (error) {

        console.log("Video URL error:", error);

        return url;

    }

}


// ==========================================
// LOAD MOVIE
// ==========================================

async function loadMovie() {

    if (!movieId) {

        console.log("Movie ID missing");

        return;

    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/movies/${movieId}`
            );


        if (!response.ok) {

            throw new Error("Movie not found");

        }


        movie = await response.json();


        console.log("MOVIE:", movie);


        // ==================================
        // BACKDROP
        // ==================================

        if (heroBackdrop && movie.image) {

            heroBackdrop.src = movie.image;

            heroBackdrop.onerror = function () {

                console.log("Poster image failed:", movie.image);

                this.style.display = "none";

            };

        }


        // ==================================
        // TRAILER
        // ==================================

        if (movie.trailer && heroTrailer) {

            const videoUrl =
                getVideoUrl(movie.trailer);

            console.log("Trailer URL:", videoUrl);


            // YouTube cannot be played inside
            // a normal HTML <video> element.

            if (videoUrl.includes("youtube.com/embed/")) {

                console.log(
                    "YouTube trailer detected."
                );

                // Hide HTML video player

                heroTrailer.style.display = "none";


                // Create YouTube iframe

                const iframe =
                    document.createElement("iframe");

                iframe.id = "youtubeTrailer";

                iframe.src =
                    videoUrl;

                iframe.allow =
                    "autoplay; encrypted-media; picture-in-picture";

                iframe.allowFullscreen = true;

                iframe.frameBorder = "0";


                iframe.style.position = "absolute";
                iframe.style.inset = "0";
                iframe.style.width = "100%";
                iframe.style.height = "100%";
                iframe.style.border = "0";
                iframe.style.opacity = "0";
                iframe.style.transition = "opacity .6s ease";


                heroTrailer.parentElement.appendChild(
                    iframe
                );


                // Show trailer after 5 seconds

                setTimeout(() => {

                    iframe.style.opacity = "1";

                    if (heroBackdrop) {

                        heroBackdrop.classList.add("hide");

                    }

                }, 5000);

            }

            else {

                // ==================================
                // NORMAL MP4 VIDEO
                // ==================================

                heroTrailer.style.display = "block";

                trailerSource.src =
                    videoUrl;

                heroTrailer.load();


                setTimeout(() => {

                    heroTrailer.classList.add("show");

                    if (heroBackdrop) {

                        heroBackdrop.classList.add("hide");

                    }

                    heroTrailer.muted = true;

                    heroTrailer.play()
                        .catch(error => {

                            console.log(
                                "Autoplay blocked:",
                                error
                            );

                        });

                }, 5000);

            }

        }


        // ==================================
        // TEXT
        // ==================================

        if (movieTitle) {

            movieTitle.innerText =
                movie.title || "Untitled";

        }


        if (movieDescription) {

            movieDescription.innerText =
                movie.description || "";

        }


        if (overview) {

            overview.innerText =
                movie.description || "";

        }


        if (movieYear) {

            movieYear.innerText =
                movie.year || "2025";

        }


        if (movieDuration) {

            movieDuration.innerText =
                movie.duration || "2h";

        }


        if (movieCategory) {

            movieCategory.innerText =
                movie.category || "Movie";

        }


        if (genre) {

            genre.innerText =
                movie.genre ||
                movie.category ||
                "Movie";

        }


        if (release) {

            release.innerText =
                movie.year || "2025";

        }


        if (duration) {

            duration.innerText =
                movie.duration || "2h";

        }


        if (language) {

            language.innerText =
                movie.language || "English";

        }


        // ==================================
        // RECOMMENDATIONS
        // ==================================

        loadRecommendations(
            movie.category
        );


    }

    catch (error) {

        console.error(
            "LOAD MOVIE ERROR:",
            error
        );

    }

}


// ==========================================
// PLAY BUTTON
// ==========================================

if (playBtn) {

    playBtn.addEventListener(
        "click",
        () => {

            if (!movie) return;

            if (!movie.trailer) {

                alert(
                    "No trailer available for this movie."
                );

                return;

            }


            const videoUrl =
                getVideoUrl(movie.trailer);


            // ==================================
            // YOUTUBE
            // ==================================

            if (
                videoUrl.includes(
                    "youtube.com/embed/"
                )
            ) {

                const iframe =
                    document.getElementById(
                        "youtubeTrailer"
                    );


                if (iframe) {

                    iframe.style.opacity = "1";

                }


                if (heroBackdrop) {

                    heroBackdrop.classList.add(
                        "hide"
                    );

                }


                return;

            }


            // ==================================
            // MP4
            // ==================================

            if (heroTrailer) {

                heroTrailer.currentTime = 0;

                heroTrailer.classList.add(
                    "show"
                );

                if (heroBackdrop) {

                    heroBackdrop.classList.add(
                        "hide"
                    );

                }

                heroTrailer.muted = false;

                muted = false;


                if (soundBtn) {

                    soundBtn.innerHTML =
                        `<i class="fa-solid fa-volume-high"></i>`;

                }


                heroTrailer.play()
                    .catch(error => {

                        console.log(
                            "Play error:",
                            error
                        );

                    });

            }

        }
    );

}


// ==========================================
// SOUND BUTTON
// ==========================================

if (soundBtn) {

    soundBtn.addEventListener(
        "click",
        () => {

            if (!heroTrailer) return;


            muted = !muted;

            heroTrailer.muted =
                muted;


            if (muted) {

                soundBtn.innerHTML =
                    `<i class="fa-solid fa-volume-xmark"></i>`;

            }

            else {

                soundBtn.innerHTML =
                    `<i class="fa-solid fa-volume-high"></i>`;

            }

        }
    );

}


// ==========================================
// TRAILER ENDED
// ==========================================

if (heroTrailer) {

    heroTrailer.addEventListener(
        "ended",
        () => {

            heroTrailer.style.opacity =
                "0";


            setTimeout(() => {

                heroTrailer.classList.remove(
                    "show"
                );


                if (heroBackdrop) {

                    heroBackdrop.classList.remove(
                        "hide"
                    );

                }

            }, 700);

        }
    );

}


// ==========================================
// MORE LIKE THIS
// ==========================================

async function loadRecommendations(category) {

    if (!recommendedMovies) return;


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/movies"
            );


        const movies =
            await response.json();


        recommendedMovies.innerHTML = "";


        const filteredMovies =
            movies.filter(item => {

                return (
                    item._id !== movieId &&
                    (
                        !category ||
                        item.category === category
                    )
                );

            });


        // If same category has no movies,
        // show other movies

        const finalMovies =
            filteredMovies.length > 0
                ? filteredMovies
                : movies.filter(
                    item => item._id !== movieId
                );


        finalMovies
            .slice(0, 10)
            .forEach(item => {

                recommendedMovies.innerHTML += `

                    <div class="movie-card">

                        <img
                            src="${item.image || ""}"
                            alt="${item.title || "Movie"}"
                            loading="lazy"
                        >

                        <div class="movie-overlay">

                            <h3>
                                ${item.title || "Untitled"}
                            </h3>

                            <div class="card-buttons">

                                <button
                                    onclick="
                                        location.href='movie.html?id=${item._id}'
                                    "
                                >
                                    <i class="fa-solid fa-play"></i>
                                    Play
                                </button>

                                <button
                                    onclick="
                                        location.href='movie.html?id=${item._id}'
                                    "
                                >
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>

                            </div>

                        </div>

                    </div>

                `;

            });

    }

    catch (error) {

        console.error(
            "RECOMMENDATIONS ERROR:",
            error
        );

    }

}


// ==========================================
// MY LIST
// ==========================================

if (myListBtn) {

    myListBtn.addEventListener(
        "click",
        async () => {

            const userId =
                localStorage.getItem(
                    "userId"
                );


            if (!userId) {

                alert(
                    "Please login first."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/favorites",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    userId,
                                    movieId

                                })

                        }
                    );


                const data =
                    await response.json();


                alert(
                    data.message ||
                    "Added to My List"
                );

            }

            catch (error) {

                console.error(
                    "MY LIST ERROR:",
                    error
                );

            }

        }
    );

}


// ==========================================
// LIKE BUTTON
// ==========================================

let liked = false;


if (likeBtn) {

    likeBtn.addEventListener(
        "click",
        () => {

            liked = !liked;


            if (liked) {

                likeBtn.classList.add(
                    "liked"
                );

            }

            else {

                likeBtn.classList.remove(
                    "liked"
                );

            }

        }
    );

}


// ==========================================
// TAB CHANGE
// ==========================================

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            if (heroTrailer) {

                heroTrailer.pause();

            }

        }

        else {

            if (
                heroTrailer &&
                heroTrailer.classList.contains(
                    "show"
                )
            ) {

                heroTrailer.play()
                    .catch(() => {});

            }

        }

    }
);


// ==========================================
// SCROLL
// ==========================================

window.addEventListener(
    "scroll",
    () => {

        if (!heroTrailer) return;


        if (
            window.scrollY > 700
        ) {

            heroTrailer.pause();

        }

        else {

            if (
                heroTrailer.classList.contains(
                    "show"
                )
            ) {

                heroTrailer.play()
                    .catch(() => {});

            }

        }

    }
);


// ==========================================
// PAGE LOAD
// ==========================================

window.addEventListener(
    "load",
    () => {

        document.body.style.opacity =
            "1";

        window.scrollTo(
            0,
            0
        );

    }
);


// ==========================================
// START
// ==========================================

loadMovie();


console.log(
    "Netflix Movie Page Loaded Successfully 🚀"
);