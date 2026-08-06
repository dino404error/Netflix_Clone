// ===========================================
// PROFESSIONAL NETFLIX CLONE
// netflix.js
// ===========================================

// ===========================================
// Authentication
// ===========================================
const API_URL = "http://localhost:5000/api/movies";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");

    window.location.href = "login.html";

});

// ===========================================
// Header Scroll
// ===========================================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});

// ===========================================
// Hero Elements
// ===========================================

const hero = document.querySelector(".hero");
const heroTitle = document.querySelector(".hero h1");
const heroDescription = document.querySelector(".hero p");

const playBtn = document.querySelector(".play");
const infoBtn = document.querySelector(".info");

// ===========================================
// Containers
// ===========================================

const trendingContainer = document.getElementById("trendingMovies");
const popularContainer = document.getElementById("popularMovies");
const actionContainer = document.getElementById("actionMovies");

// ===========================================
// Global Variables
// ===========================================

let allMovies = [];
let heroMovie = null;

// ===========================================
// Initialize
// ===========================================

initialize();

async function initialize() {

    await loadMovies();

    await loadContinueWatching();

    console.log("Netflix Clone Loaded");

}

// ===========================================
// Load Movies
// ===========================================

async function loadMovies(){

    try{

        const res =
        await fetch(
        "http://localhost:5000/api/movies"
        );


        const movies =
        await res.json();


        console.log("Movies:", movies);


        // Clear sections

        document.getElementById("trendingMovies").innerHTML="";
        document.getElementById("popularMovies").innerHTML="";
        document.getElementById("actionMovies").innerHTML="";
        document.getElementById("newMovies").innerHTML="";
        document.getElementById("topRatedMovies").innerHTML="";


        movies.forEach(movie=>{


            const card =
            createCard(movie);


            // Trending

            document
            .getElementById("trendingMovies")
            .innerHTML += card;



            // Popular

            document
            .getElementById("popularMovies")
            .innerHTML += card;



            // Category

            if(movie.category==="Action"){

                document
                .getElementById("actionMovies")
                .innerHTML += card;

            }



            // New releases

            document
            .getElementById("newMovies")
            .innerHTML += card;



            // Top rated

            document
            .getElementById("topRatedMovies")
            .innerHTML += card;


        });


    }

    catch(error){

        console.log(error);

    }

}

// ===========================================
// Dynamic Hero
// ===========================================

function loadHero() {

    if (allMovies.length === 0) return;

    heroMovie =
        allMovies[
            Math.floor(
                Math.random() * allMovies.length
            )
        ];

    hero.style.background =
        `linear-gradient(
        to right,
        rgba(0,0,0,.88),
        rgba(0,0,0,.30)
        ),
        url(${heroMovie.image})`;

    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";

    heroTitle.innerText = heroMovie.title;

    heroDescription.innerText =
        heroMovie.description;

}

// ===========================================
// Hero Buttons
// ===========================================

playBtn.addEventListener("click", () => {

    if (!heroMovie) return;

    window.location.href =
        `movie.html?id=${heroMovie._id}`;

});

infoBtn.addEventListener("click", () => {

    if (!heroMovie) return;

    window.location.href =
        `movie.html?id=${heroMovie._id}`;

});
// ===========================================
// Create Professional Netflix Card
// ===========================================



function createCard(movie){

return `

<div class="movie-card">


<img 
src="${movie.image}"
alt="${movie.title}"
onclick="openMovie('${movie._id}')">
<video 
class="preview-video"
muted
loop>

<source src="${movie.trailer}">

</video>
<div class="movie-overlay">


<h3>
${movie.title}
</h3>
<p>
${movie.description.substring(0,80)}...
</p>

<div class="card-buttons">


<button 
onclick="openMovie('${movie._id}')">

▶ Play

</button>


<button
onclick="openMovie('${movie._id}')">

ⓘ

</button>


<button 
onclick="addToWishlist('${movie._id}')">

＋

</button>


</div>

</div>


</div>

`;



}

// ===========================================
// Load Categories
// ===========================================

function loadCategories(){

    trendingMovies.innerHTML = "";

    popularMovies.innerHTML = "";

    actionMovies.innerHTML = "";

    allMovies.forEach(movie=>{

        const card=createCard(movie);

        if(movie.category==="Trending"){

            trendingMovies.innerHTML+=card;

        }

        else if(movie.category==="Popular"){

            popularMovies.innerHTML+=card;

        }

        else if(movie.category==="Action"){

            actionMovies.innerHTML+=card;

        }

    });

}

// ===========================================
// Auto Change Hero Every 15 Seconds
// ===========================================

setInterval(() => {

    if (allMovies.length === 0) return;

    heroMovie =
        allMovies[
            Math.floor(Math.random() * allMovies.length)
        ];

    hero.style.background =
        `linear-gradient(
            to right,
            rgba(0,0,0,.88),
            rgba(0,0,0,.30)
        ),
        url(${heroMovie.image})`;

    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";

    heroTitle.innerText = heroMovie.title;
    heroDescription.innerText = heroMovie.description;

},15000);

// ===========================================
// Notifications
// ===========================================

const bell =
document.querySelector(".fa-bell");

if(bell){

    bell.addEventListener("click",()=>{

        alert("No New Notifications");

    });

}

// ===========================================
// Profile
// ===========================================

const profile =
document.querySelector(".right img");

if(profile){

    profile.addEventListener("click",()=>{

        alert("Profile Menu");

    });

}

// ===========================================
// Keyboard Shortcut
// ===========================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="h"||e.key==="H"){

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

});

// ===========================================
// Fade Animation
// ===========================================

const sections =
document.querySelectorAll(".movies");

const observer =
new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.opacity="1";
            entry.target.style.transform="translateY(0)";

        }

    });

});

sections.forEach(section=>{

    section.style.opacity="0";
    section.style.transform="translateY(50px)";
    section.style.transition=".7s";

    observer.observe(section);

});
// ===========================================
// Add Movie To My List
// ===========================================

async function addToList(movieId) {

    const userId = localStorage.getItem("userId");

    if (!userId) {

        alert("Please login first.");

        return;

    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/favorites",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    userId,
                    movieId

                })

            }
        );

        const data = await response.json();

        alert(data.message);

    }

    catch (error) {

        console.log(error);

    }

}

// ===========================================
// Refresh Categories
// ===========================================

function refreshMovies() {

    loadCategories();

}

// ===========================================
// Error Handling
// ===========================================

window.addEventListener("error", (event) => {

    console.error("JavaScript Error:", event.message);

});

// ===========================================
// Internet Status
// ===========================================

window.addEventListener("offline", () => {

    alert("Internet connection lost!");

});

window.addEventListener("online", () => {

    console.log("Internet connected.");

});

// ===========================================
// Loading Animation
// ===========================================

window.addEventListener("load", () => {

    document.body.style.opacity = "1";

});

// ===========================================
// Debug
// ===========================================

console.log("Professional Netflix Clone Loaded Successfully 🚀");
// ==========================================
// OPEN MOVIE PLAYER
// ==========================================

function playMovie(id){

    window.location.href =
    `player.html?id=${id}`;

}



// ==========================================
// OPEN MOVIE DETAILS
// ==========================================

function openMovie(id){

    window.location.href =
    `movie.html?id=${id}`;

}



// ==========================================
// ADD TO MY LIST
// ==========================================

async function addToWishlist(movieId){


    const userId =
    localStorage.getItem("userId");


    if(!userId){

        alert("Please login first");

        return;

    }


    try{


        const res =
        await fetch(
        "http://localhost:5000/api/favorites",
        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },


            body:JSON.stringify({

                userId:userId,

                movieId:movieId

            })


        });


        const data =
        await res.json();


        alert(data.message || "Added to My List");


    }

    catch(error){

        console.log(error);

    }


}