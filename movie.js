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

        console.log(
            "Video URL error:",
            error
        );

        return url;

    }

}


// ==========================================
// LOAD MOVIE
// ==========================================

async function loadMovie() {

    if (!movieId) {

        console.log(
            "Movie ID missing"
        );

        return;

    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/movies/${movieId}`
            );


        if (!response.ok) {

            throw new Error(
                "Movie not found"
            );

        }


        movie =
            await response.json();


        console.log(
            "MOVIE:",
            movie
        );


        // ==================================
        // BACKDROP
        // ==================================

        if (
            heroBackdrop &&
            movie.image
        ) {

            heroBackdrop.src =
                movie.image;


            heroBackdrop.onerror =
                function () {

                    console.log(
                        "Poster image failed:",
                        movie.image
                    );

                    this.style.display =
                        "none";

                };

        }


        // ==================================
        // TRAILER
        // ==================================

        if (
            movie.trailer &&
            heroTrailer
        ) {

            const videoUrl =
                getVideoUrl(
                    movie.trailer
                );


            console.log(
                "Trailer URL:",
                videoUrl
            );


            // ==================================
            // YOUTUBE TRAILER
            // ==================================

            if (
                videoUrl.includes(
                    "youtube.com/embed/"
                )
            ) {

                console.log(
                    "YouTube trailer detected."
                );


                // Hide normal HTML video

                heroTrailer.style.display =
                    "none";


                // Create YouTube iframe

                let iframe =
                    document.getElementById(
                        "youtubeTrailer"
                    );


                if (!iframe) {

                    iframe =
                        document.createElement(
                            "iframe"
                        );


                    iframe.id =
                        "youtubeTrailer";


                    iframe.allow =
                        "autoplay; encrypted-media; picture-in-picture; fullscreen";


                    iframe.allowFullscreen =
                        true;


                    iframe.setAttribute(
                        "allowfullscreen",
                        ""
                    );


                    iframe.frameBorder =
                        "0";


                    iframe.style.position =
                        "absolute";


                    iframe.style.inset =
                        "0";


                    iframe.style.width =
                        "100%";


                    iframe.style.height =
                        "100%";


                    iframe.style.border =
                        "0";


                    iframe.style.opacity =
                        "0";


                    iframe.style.transition =
                        "opacity .6s ease";


                    iframe.style.zIndex =
                        "10";


                    heroTrailer.parentElement.appendChild(
                        iframe
                    );

                }


                // Extract YouTube ID

                let youtubeId =
                    "";


                try {

                    const youtubeUrl =
                        new URL(
                            videoUrl
                        );


                    youtubeId =
                        youtubeUrl.pathname
                            .split("/")
                            .filter(Boolean)
                            .pop();

                }

                catch (error) {

                    console.error(
                        "YouTube ID error:",
                        error
                    );

                }


                // Load video but do NOT
                // automatically force browser fullscreen

                if (youtubeId) {

                    iframe.src =
                        `https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&controls=1&fs=1&playsinline=0`;

                }


                // Show trailer after 5 seconds

                setTimeout(() => {

                    iframe.style.opacity =
                        "1";


                    if (heroBackdrop) {

                        heroBackdrop.classList.add(
                            "hide"
                        );

                    }

                }, 5000);

            }


            else {

                // ==================================
                // NORMAL MP4 VIDEO
                // ==================================

                heroTrailer.style.display =
                    "block";


                trailerSource.src =
                    videoUrl;


                heroTrailer.load();


                setTimeout(() => {

                    heroTrailer.classList.add(
                        "show"
                    );


                    if (heroBackdrop) {

                        heroBackdrop.classList.add(
                            "hide"
                        );

                    }


                    heroTrailer.muted =
                        true;


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
                movie.title ||
                "Untitled";

        }


        if (movieDescription) {

            movieDescription.innerText =
                movie.description ||
                "";

        }


        if (overview) {

            overview.innerText =
                movie.description ||
                "";

        }


        if (movieYear) {

            movieYear.innerText =
                movie.year ||
                "2025";

        }


        if (movieDuration) {

            movieDuration.innerText =
                movie.duration ||
                "2h";

        }


        if (movieCategory) {

            movieCategory.innerText =
                movie.category ||
                "Movie";

        }


        if (genre) {

            genre.innerText =
                movie.genre ||
                movie.category ||
                "Movie";

        }


        if (release) {

            release.innerText =
                movie.year ||
                "2025";

        }


        if (duration) {

            duration.innerText =
                movie.duration ||
                "2h";

        }


        if (language) {

            language.innerText =
                movie.language ||
                "English";

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
                getVideoUrl(
                    movie.trailer
                );


            // ==================================
            // YOUTUBE
            // ==================================

            if (
                videoUrl.includes(
                    "youtube.com/embed/"
                )
            ) {

                let iframe =
                    document.getElementById(
                        "youtubeTrailer"
                    );


                // ----------------------------------
                // Create iframe if missing
                // ----------------------------------

                if (!iframe) {

                    iframe =
                        document.createElement(
                            "iframe"
                        );


                    iframe.id =
                        "youtubeTrailer";


                    iframe.allow =
                        "autoplay; encrypted-media; picture-in-picture; fullscreen";


                    iframe.allowFullscreen =
                        true;


                    iframe.setAttribute(
                        "allowfullscreen",
                        ""
                    );


                    iframe.frameBorder =
                        "0";


                    iframe.style.position =
                        "absolute";


                    iframe.style.inset =
                        "0";


                    iframe.style.width =
                        "100%";


                    iframe.style.height =
                        "100%";


                    iframe.style.border =
                        "0";


                    iframe.style.opacity =
                        "1";


                    iframe.style.zIndex =
                        "10";


                    heroTrailer.parentElement.appendChild(
                        iframe
                    );

                }


                // ----------------------------------
                // Get YouTube ID
                // ----------------------------------

                let youtubeId =
                    "";


                try {

                    const youtubeUrl =
                        new URL(
                            videoUrl
                        );


                    youtubeId =
                        youtubeUrl.pathname
                            .split("/")
                            .filter(Boolean)
                            .pop();

                }

                catch (error) {

                    console.error(
                        "YouTube ID error:",
                        error
                    );

                    return;

                }


                // ----------------------------------
                // Start YouTube video
                // ----------------------------------

                iframe.src =
                    `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&controls=1&fs=1&playsinline=0`;


                iframe.style.opacity =
                    "1";


                iframe.classList.add(
                    "youtube-active"
                );


                if (heroBackdrop) {

                    heroBackdrop.classList.add(
                        "hide"
                    );

                }


                console.log(
                    "YouTube Play clicked:",
                    youtubeId
                );


                /*
                 * IMPORTANT:
                 *
                 * We do NOT call requestFullscreen()
                 * here.
                 *
                 * The YouTube player itself gets its
                 * fullscreen button through fs=1.
                 *
                 * This gives a much more Netflix-like
                 * experience instead of immediately
                 * forcing browser fullscreen.
                 */


                return;

            }


            // ==================================
            // MP4
            // ==================================

            if (heroTrailer) {

                heroTrailer.currentTime =
                    0;


                heroTrailer.classList.add(
                    "show"
                );


                if (heroBackdrop) {

                    heroBackdrop.classList.add(
                        "hide"
                    );

                }


                heroTrailer.muted =
                    false;


                muted =
                    false;


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


            muted =
                !muted;


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

async function loadRecommendations(
    category
) {

    if (!recommendedMovies) return;


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/movies"
            );


        const movies =
            await response.json();


        recommendedMovies.innerHTML =
            "";


        const filteredMovies =
            movies.filter(
                item => {

                    return (
                        item._id !== movieId &&
                        (
                            !category ||
                            item.category === category
                        )
                    );

                }
            );


        // If same category has no movies,
        // show other movies

        const finalMovies =
            filteredMovies.length > 0
                ? filteredMovies
                : movies.filter(
                    item =>
                        item._id !== movieId
                );


        finalMovies
            .slice(0, 10)
            .forEach(
                item => {

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

                }
            );

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

                            method:
                                "POST",


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

let liked =
    false;


if (likeBtn) {

    likeBtn.addEventListener(
        "click",
        () => {

            liked =
                !liked;


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

        if (document.hidden) {

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
                    .catch(
                        () => {}
                    );

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
                    .catch(
                        () => {}
                    );

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
// SMART WATCH HISTORY
// ==========================================

function saveMovieHistory() {

    if (
        !movie ||
        !movieId
    ) return;


    let history =
        [];


    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    "movieHistory"
                )
            ) || [];

    }

    catch (error) {

        history =
            [];

    }


    // Remove existing copy

    history =
        history.filter(
            item =>
                item.movieId !== movieId
        );


    // Add latest movie

    history.unshift({

        movieId:
            movieId,


        title:
            movie.title ||
            "Untitled",


        image:
            movie.image ||
            "",


        category:
            movie.category ||
            "Movie",


        watchedAt:
            Date.now()

    });


    // Keep only last 10

    history =
        history.slice(
            0,
            10
        );


    localStorage.setItem(
        "movieHistory",
        JSON.stringify(
            history
        )
    );


    console.log(
        "Smart history saved:",
        history
    );

}


// ==========================================
// SMART WATCH PROGRESS
// ==========================================

let watchProgressTimer =
    null;


function saveWatchProgress() {

    if (
        !movie ||
        !movieId ||
        !heroTrailer
    ) return;


    // Only save progress for real video files

    if (!movie.trailer) return;


    if (
        !heroTrailer.duration ||
        isNaN(
            heroTrailer.duration
        )
    ) {

        return;

    }


    const progress = {

        movieId:
            movieId,


        title:
            movie.title ||
            "Untitled",


        image:
            movie.image ||
            "",


        currentTime:
            heroTrailer.currentTime,


        duration:
            heroTrailer.duration,


        updatedAt:
            Date.now()

    };


    localStorage.setItem(

        `watchProgress_${movieId}`,

        JSON.stringify(
            progress
        )

    );


    console.log(
        "Watch progress saved:",
        progress
    );

}


// ==========================================
// START WATCH PROGRESS
// ==========================================

function startWatchProgress() {

    if (watchProgressTimer) {

        clearInterval(
            watchProgressTimer
        );

    }


    watchProgressTimer =
        setInterval(
            () => {

                if (
                    heroTrailer &&
                    !heroTrailer.paused &&
                    heroTrailer.currentTime > 0
                ) {

                    saveWatchProgress();

                }

            },
            5000
        );

}


// ==========================================
// RESTORE WATCH PROGRESS
// ==========================================

function restoreWatchProgress() {

    if (
        !heroTrailer ||
        !movieId
    ) return;


    const saved =
        localStorage.getItem(
            `watchProgress_${movieId}`
        );


    if (!saved) return;


    try {

        const progress =
            JSON.parse(
                saved
            );


        if (
            progress.currentTime > 5 &&
            progress.currentTime <
                progress.duration - 10
        ) {

            heroTrailer.currentTime =
                progress.currentTime;


            console.log(
                "Restored watch progress:",
                progress.currentTime
            );

        }

    }

    catch (error) {

        console.error(
            "Progress restore error:",
            error
        );

    }

}


// ==========================================
// VIDEO PROGRESS EVENTS
// ==========================================

if (heroTrailer) {

    heroTrailer.addEventListener(
        "play",
        () => {

            startWatchProgress();

        }
    );


    heroTrailer.addEventListener(
        "pause",
        () => {

            saveWatchProgress();

        }
    );


    heroTrailer.addEventListener(
        "timeupdate",
        () => {

            if (
                Math.floor(
                    heroTrailer.currentTime
                ) % 10 === 0
            ) {

                saveWatchProgress();

            }

        }
    );


    heroTrailer.addEventListener(
        "loadedmetadata",
        () => {

            restoreWatchProgress();

        }
    );


    heroTrailer.addEventListener(
        "ended",
        () => {

            localStorage.removeItem(
                `watchProgress_${movieId}`
            );


            console.log(
                "Movie completed — progress cleared."
            );

        }
    );

}


// ==========================================
// AI MOVIE ASSISTANT
// ==========================================

const aiMovieBtn =
    document.getElementById(
        "aiMovieBtn"
    );


const aiMovieSection =
    document.getElementById(
        "aiMovieSection"
    );


const closeAiMovie =
    document.getElementById(
        "closeAiMovie"
    );


const aiMovieInput =
    document.getElementById(
        "aiMovieInput"
    );


const aiMovieSend =
    document.getElementById(
        "aiMovieSend"
    );


const aiChat =
    document.getElementById(
        "aiChat"
    );


// ==========================================
// OPEN AI
// ==========================================

if (aiMovieBtn) {

    aiMovieBtn.addEventListener(
        "click",
        () => {

            if (!aiMovieSection) return;


            aiMovieSection.style.display =
                "block";


            aiMovieSection.scrollIntoView({
                behavior:
                    "smooth",
                block:
                    "start"
            });


            setTimeout(
                () => {

                    if (aiMovieInput) {

                        aiMovieInput.focus();

                    }

                },
                500
            );

        }
    );

}


// ==========================================
// CLOSE AI
// ==========================================

if (closeAiMovie) {

    closeAiMovie.addEventListener(
        "click",
        () => {

            if (aiMovieSection) {

                aiMovieSection.style.display =
                    "none";

            }

        }
    );

}


// ==========================================
// ADD AI MESSAGE
// ==========================================

function addAIMessage(
    message,
    user = false
) {

    if (!aiChat) return;


    const div =
        document.createElement(
            "div"
        );


    div.className =
        user
            ? "ai-message ai-user"
            : "ai-message ai-bot";


    if (user) {

        div.innerHTML = `

            <div class="ai-avatar user-avatar">

                <i class="fa-solid fa-user"></i>

            </div>

            <div>

                ${message}

            </div>

        `;

    }

    else {

        div.innerHTML = `

            <div class="ai-avatar">

                <i class="fa-solid fa-wand-magic-sparkles"></i>

            </div>

            <div>

                ${message}

            </div>

        `;

    }


    aiChat.appendChild(
        div
    );


    aiChat.scrollTop =
        aiChat.scrollHeight;

}


// ==========================================
// ASK MOVIE AI
// ==========================================

async function askMovieAI(
    question
) {

    if (!movie) {

        addAIMessage(
            "Movie information is still loading..."
        );

        return;

    }


    addAIMessage(
        question,
        true
    );


    addAIMessage(
        "Thinking...",
        false
    );


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/ai/movie",
                {

                    method:
                        "POST",


                    headers: {

                        "Content-Type":
                            "application/json"

                    },


                    body:
                        JSON.stringify({

                            movieId:
                                movieId,


                            question:
                                question,


                            movie: {

                                title:
                                    movie.title,


                                description:
                                    movie.description,


                                genre:
                                    movie.genre ||
                                    movie.category,


                                year:
                                    movie.year

                            }

                        })

                }
            );


        if (!response.ok) {

            throw new Error(
                "AI endpoint unavailable"
            );

        }


        const data =
            await response.json();


        const thinkingMessages =
            aiChat.querySelectorAll(
                ".ai-bot"
            );


        const lastMessage =
            thinkingMessages[
                thinkingMessages.length - 1
            ];


        if (lastMessage) {

            lastMessage.remove();

        }


        addAIMessage(

            data.answer ||
            data.message ||
            "I couldn't generate an answer right now."

        );

    }

    catch (error) {

        console.error(
            "AI ERROR:",
            error
        );


        const thinkingMessages =
            aiChat.querySelectorAll(
                ".ai-bot"
            );


        const lastMessage =
            thinkingMessages[
                thinkingMessages.length - 1
            ];


        if (lastMessage) {

            lastMessage.remove();

        }


        addAIMessage(

            "AI is not connected yet. Connect your /api/ai/movie backend endpoint to enable the Netflix AI assistant."

        );

    }

}


// ==========================================
// AI SEND BUTTON
// ==========================================

if (aiMovieSend) {

    aiMovieSend.addEventListener(
        "click",
        () => {

            const question =
                aiMovieInput
                    ?.value
                    .trim();


            if (!question) return;


            aiMovieInput.value =
                "";


            askMovieAI(
                question
            );

        }
    );

}


// ==========================================
// AI ENTER KEY
// ==========================================

if (aiMovieInput) {

    aiMovieInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();


                if (aiMovieSend) {

                    aiMovieSend.click();

                }

            }

        }
    );

}


// ==========================================
// AI SUGGESTIONS
// ==========================================

document
    .querySelectorAll(
        ".ai-suggestion"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const question =
                        button.dataset.question;


                    if (question) {

                        askMovieAI(
                            question
                        );

                    }

                }
            );

        }
    );


// ==========================================
// AI DISCOVERY
// ==========================================

const aiSimilarBtn =
    document.getElementById(
        "aiSimilarBtn"
    );


if (aiSimilarBtn) {

    aiSimilarBtn.addEventListener(
        "click",
        () => {

            if (!aiMovieSection) return;


            aiMovieSection.style.display =
                "block";


            aiMovieSection.scrollIntoView({
                behavior:
                    "smooth"
            });


            setTimeout(
                () => {

                    askMovieAI(
                        "Based on this movie, recommend my next 5 movies and explain why each one matches."
                    );

                },
                400
            );

        }
    );

}


const aiMoodBtn =
    document.getElementById(
        "aiMoodBtn"
    );


if (aiMoodBtn) {

    aiMoodBtn.addEventListener(
        "click",
        () => {

            if (!aiMovieSection) return;


            aiMovieSection.style.display =
                "block";


            aiMovieSection.scrollIntoView({
                behavior:
                    "smooth"
            });


            setTimeout(
                () => {

                    askMovieAI(
                        "Based on this movie, what mood is it best for and what other movies should I watch for the same mood?"
                    );

                },
                400
            );

        }
    );

}


// ==========================================
// SHARE MOVIE
// ==========================================

const shareMovie =
    document.getElementById(
        "shareMovie"
    );


if (shareMovie) {

    shareMovie.addEventListener(
        "click",
        async () => {

            const titleElement =
                document.getElementById(
                    "movieTitle"
                );


            const title =
                titleElement
                    ? titleElement.innerText
                    : "this movie";


            const shareData = {

                title:
                    document.title,


                text:
                    `Check out ${title} on my Netflix Clone.`,


                url:
                    window.location.href

            };


            try {

                if (
                    navigator.share
                ) {

                    await navigator.share(
                        shareData
                    );

                }

                else if (
                    navigator.clipboard
                ) {

                    await navigator.clipboard.writeText(
                        window.location.href
                    );


                    alert(
                        "Movie link copied!"
                    );

                }

                else {

                    alert(
                        window.location.href
                    );

                }

            }

            catch (error) {

                console.log(
                    "Share cancelled:",
                    error
                );

            }

        }
    );

}


// ==========================================
// START
// ==========================================

loadMovie();


console.log(
    "Netflix Movie Page Loaded Successfully 🚀"
);