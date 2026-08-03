// =====================================
// Authentication
// =====================================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// =====================================
// Logout
// =====================================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");

    alert("Logged Out Successfully!");

    window.location.href = "login.html";
});

// =====================================
// Header Scroll Effect
// =====================================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// =====================================
// Hero Buttons
// =====================================

const playBtn = document.querySelector(".play");
const infoBtn = document.querySelector(".info");

playBtn.addEventListener("click", () => {
    alert("▶ Playing Movie...");
});

infoBtn.addEventListener("click", () => {
    alert("🎬 Movie Information");
});

// =====================================
// Keyboard Shortcut
// Press H to Scroll Top
// =====================================

document.addEventListener("keydown", (e) => {
    if (e.key === "h" || e.key === "H") {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
});

// =====================================
// Fade In Sections
// =====================================

const sections = document.querySelectorAll(".movies");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
});

sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(50px)";
    section.style.transition = ".7s";

    observer.observe(section);
});

// =====================================
// Notification
// =====================================

const bell = document.querySelector(".fa-bell");

bell.addEventListener("click", () => {
    alert("No New Notifications");
});

// =====================================
// Profile
// =====================================

const profile = document.querySelector(".right img");

profile.addEventListener("click", () => {
    alert("Profile Menu");
});

// =====================================
// Load Movies
// =====================================

let allMovies = [];

async function loadMovies() {

    try {

        const response = await fetch("http://localhost:5000/api/movies");

        const movies = await response.json();

        allMovies = movies;

        const trending = document.getElementById("trendingMovies");
        const popular = document.getElementById("popularMovies");
        const action = document.getElementById("actionMovies");

        trending.innerHTML = "";
        popular.innerHTML = "";
        action.innerHTML = "";

        movies.forEach((movie) => {

       const card = `
<div class="movie-card">

    <a href="movie.html?id=${movie._id}">

        <img
            src="${movie.image}"
            alt="${movie.title}"
            title="${movie.title}"
        >

    </a>

    <div class="category">

        ${movie.category}

    </div>

    <div class="movie-overlay">

        <h3>${movie.title}</h3>

        <p>${movie.description.substring(0,70)}...</p>

        <div class="card-buttons">

            <button class="watch-btn"
                onclick="window.location.href='movie.html?id=${movie._id}'">

                ▶ Play

            </button>

            <button class="list-btn"
                onclick="addToList('${movie._id}')">

                ❤️ My List

            </button>

        </div>

    </div>

</div>
`;


            if (movie.category === "Trending") {
                trending.innerHTML += card;
            }

            else if (movie.category === "Popular") {
                popular.innerHTML += card;
            }

            else if (movie.category === "Action") {
                action.innerHTML += card;
            }

        });

        // =====================================
        // Hover & Double Click
        // =====================================

        document.querySelectorAll(".row img").forEach((movie) => {

            movie.addEventListener("mouseenter", () => {
                movie.style.transform = "scale(1.15)";
            });

            movie.addEventListener("mouseleave", () => {
                movie.style.transform = "scale(1)";
            });

            movie.addEventListener("dblclick", () => {
                movie.style.border = "4px solid red";
            });

        });

    }

    catch (error) {

        console.log(error);

    }

}

loadMovies();

// =====================================
// Search Movies
// =====================================

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase();

    const images = document.querySelectorAll(".row img");

    images.forEach((img) => {

        const title = img.title.toLowerCase();

        if (title.includes(value)) {

            img.parentElement.style.display = "inline-block";

        }

        else {

            img.parentElement.style.display = "none";

        }

    });

});
// =====================================
// Add To My List
// =====================================

async function addToList(movieId) {

    const userId = localStorage.getItem("userId");

    if (!userId) {

        alert("Please login first.");

        return;

    }

    try {

        const response = await fetch("http://localhost:5000/api/favorites", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                userId,
                movieId

            })

        });

        const data = await response.json();

        if (response.ok) {

            alert("❤️ Movie Added To My List!");

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Server Error");

    }

}
// =====================================
// Add To My List
// =====================================

async function addToList(movieId) {

    const userId = localStorage.getItem("userId");

    if (!userId) {

        alert("Please login first.");

        return;

    }

    try {

        const response = await fetch("http://localhost:5000/api/favorites", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                userId,
                movieId

            })

        });

        const data = await response.json();

        if (response.ok) {

            alert("❤️ Movie Added To My List!");

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Server Error");

    }

}