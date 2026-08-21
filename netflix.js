

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



    console.log("Netflix Clone Loaded");

}
// ===========================================
// LOAD MOVIES FROM BACKEND
// ===========================================

async function loadMovies() {

    try {

        console.log("Loading movies from API...");

        const response = await fetch(
            "http://localhost:5000/api/movies"
        );

        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status}`
            );
        }

        allMovies = await response.json();

        console.log("Movies loaded:", allMovies);

        // Load hero
        loadHero();

        // Load all movie sections
        loadCategories();

    }

    catch (error) {

        console.error(
            "Failed to load movies:",
            error
        );

    }

}


// ===========================================
// LOAD ALL MOVIE CATEGORIES
// ===========================================

function loadCategories() {

    console.log("Loading movie categories...");

    const top10Container =
        document.getElementById("top10Movies");

    const trendingContainer =
        document.getElementById("trendingMovies");

    const popularContainer =
        document.getElementById("popularMovies");

    const actionContainer =
        document.getElementById("actionMovies");


    // Clear containers

    if (top10Container) {
        top10Container.innerHTML = "";
    }

    if (trendingContainer) {
        trendingContainer.innerHTML = "";
    }

    if (popularContainer) {
        popularContainer.innerHTML = "";
    }

    if (actionContainer) {
        actionContainer.innerHTML = "";
    }


    // ===================================
    // TOP 10
    // ===================================

    if (top10Container) {

        allMovies
            .slice(0, 10)
            .forEach((movie, index) => {

                top10Container.innerHTML += `

                    <div class="top10-card">

                        <span class="rank">
                            ${index + 1}
                        </span>

                        ${createCard(movie)}

                    </div>

                `;

            });

    }


    // ===================================
    // OTHER CATEGORIES
    // ===================================

    allMovies.forEach(movie => {

        const card = createCard(movie);

        if (
            movie.category === "Trending" &&
            trendingContainer
        ) {

            trendingContainer.innerHTML += card;

        }

        if (
            movie.category === "Popular" &&
            popularContainer
        ) {

            popularContainer.innerHTML += card;

        }

        if (
            movie.category === "Action" &&
            actionContainer
        ) {

            actionContainer.innerHTML += card;

        }

    });


    console.log("Movie categories loaded successfully.");

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
  onerror="this.src='images/default-movie.jpg'"
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
document.querySelector(".right-nav img");

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

async function addToWishList(movieId) {

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

function openAIMovie(movieId) {

    console.log("🎬 AI Watch Now clicked:", movieId);

    if (!movieId) {
        console.error("❌ Movie ID missing");
        return;
    }

    // Open the movie details page
    window.location.href = `movie.html?id=${movieId}`;
}



// ==========================================
// ADD TO MY LIST
// ==========================================

async function addToWishlist(movieId) {

    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("Please login first.");
        return;
    }

    if (!movieId) {
        alert("Movie ID missing.");
        return;
    }

    console.log("❤️ Adding movie:", movieId);
    console.log("👤 User:", userId);

    try {

        const response = await fetch(
            "http://localhost:5000/api/favorites",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    userId: userId,
                    movieId: movieId
                })
            }
        );

        console.log("❤️ Favorite API status:", response.status);

        const data = await response.json();

        console.log("❤️ Favorite API response:", data);

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to add movie"
            );
        }

        alert(data.message || "Movie added to My List ❤️");

    } catch (error) {

        console.error(
            "❌ ADD TO MY LIST ERROR:",
            error
        );

        alert(
            "Could not add movie to My List:\n" +
            error.message
        );
    }
}
/// ======================================
// NETFLIX AI
// ======================================

console.log("Netflix AI script loaded");

const aiButton = document.getElementById("aiButton");
const aiInput = document.getElementById("aiInput");
const aiLoading = document.getElementById("aiLoading");
const aiResult = document.getElementById("aiResult");
const aiMovies = document.getElementById("aiMovies");

console.log("AI Button:", aiButton);
console.log("AI Input:", aiInput);
console.log("AI Loading:", aiLoading);
console.log("AI Result:", aiResult);
console.log("AI Movies:", aiMovies);

if (aiButton) {

    aiButton.addEventListener("click", async function () {

        console.log("AI BUTTON CLICKED");

        const message = aiInput.value.trim();

        if (!message) {
            alert("Tell me what you want to watch.");
            return;
        }

        aiButton.disabled = true;

        if (aiLoading) {
            aiLoading.classList.remove("hidden");
        }

        try {

            console.log("Sending request to Netflix AI...");

            const response = await fetch(
                "http://localhost:5000/api/ai/recommend",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                   body: JSON.stringify({
    message: message,
    userId: localStorage.getItem("userId"),
    conversation: window.aiConversation || []
})
                }
            );

            console.log("AI server status:", response.status);

            const data = await response.json();

            console.log("AI RESPONSE:", data);
            console.log("AI ANSWER:", data.answer);

            if (!data.success) {
                throw new Error(
                    data.message || "AI request failed"
                );
            }

            // ======================================
            // SHOW RESULT CONTAINER
            // ======================================

            if (aiResult) {
               aiResult.classList.remove("hidden");

const recommendedMovies = data.movies || [];

aiMovies.innerHTML = `
    <div class="ai-response-box">

        <div class="ai-response-header">
            <div>
                <h3>✨ Netflix AI</h3>
                <p>${data.answer}</p>
            </div>
        </div>

        ${
            recommendedMovies.length > 0
                ? `
                <h3 class="ai-recommend-title">
                    🎬 Movies from your Netflix catalog
                </h3>

                <div class="ai-movie-grid">

                    ${recommendedMovies.map(movie => `

                        <div class="ai-movie-card">

                            <div class="ai-movie-image">
                                <img
                                    src="${movie.image}"
                                    alt="${movie.title}"
                                    onerror="this.src='images/default-movie.jpg'"
                                >
                            </div>

                            <div class="ai-movie-info">

                                <h3>${movie.title}</h3>

                                <div class="ai-movie-meta">
                                    ${movie.year || ""}
                                    ${movie.rating ? ` • ⭐ ${movie.rating}` : ""}
                                </div>

                                <p>
                                    ${movie.description || "A great movie to watch."}
                                </p>

                                <button
    class="ai-watch-btn"
    onclick="alert('Movie: ${movie.title}')"
>
    ▶ Watch Now
</button>

                            </div>

                        </div>

                    `).join("")}

                </div>
                `
                : ""
        }

    </div>
`;
                // Force visibility
                aiMovies.style.display = "block";
                aiMovies.style.visibility = "visible";
                aiMovies.style.opacity = "1";

            } else {

                console.error(
                    "Netflix AI ERROR: #aiMovies was not found."
                );

            }

        } catch (error) {

            console.error(
                "NETFLIX AI ERROR:",
                error
            );

            alert(
                "Netflix AI connection failed:\n\n" +
                error.message
            );

        } finally {

            aiButton.disabled = false;

            if (aiLoading) {
                aiLoading.classList.add("hidden");
            }

        }

    });

} else {

    console.error(
        "Netflix AI ERROR: #aiButton was not found."
    );

}



// ======================================
// NETFLIX AI CHAT
// ======================================

console.log("🤖 Netflix AI Chat loading...");

const aiChatInput = document.getElementById("aiChatInput");
const aiSendButton = document.getElementById("aiSendButton");
const aiMessages = document.getElementById("aiMessages");

// Conversation memory
window.aiConversation = [];

if (aiSendButton && aiChatInput && aiMessages) {

    async function sendAIMessage() {

        const message = aiChatInput.value.trim();

        if (!message) {
            return;
        }

        console.log("🎬 User:", message);

        // Show user message
        const userMessage = document.createElement("div");

        userMessage.className = "ai-message ai-user";
        userMessage.textContent = message;

        aiMessages.appendChild(userMessage);

        // Clear input
        aiChatInput.value = "";

        // Save conversation
       window.aiConversation.push({
    role: "user",
    content: message
});

        // Loading message
        const loadingMessage = document.createElement("div");

        loadingMessage.className = "ai-message ai-bot";
        loadingMessage.textContent = "🤖 Netflix AI is thinking...";

        aiMessages.appendChild(loadingMessage);

        aiMessages.scrollTop = aiMessages.scrollHeight;

        try {

            console.log("🤖 Sending AI request...");

            const response = await fetch(
                "http://localhost:5000/api/ai/recommend",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                   body: JSON.stringify({
    message: message,
    userId: localStorage.getItem("userId"),
    conversation: window.aiConversation || []
})
                }
            );

            console.log(
                "🤖 AI status:",
                response.status
            );

            const data = await response.json();

            console.log(
                "🤖 AI response:",
                data
            );

            loadingMessage.remove();

            if (!data.success) {
                throw new Error(
                    data.message || "AI request failed"
                );
            }

            // Save AI response
         window.aiConversation.push({
                role: "assistant",
                content: data.answer
            });

            // Show AI response
            const botMessage = document.createElement("div");

            botMessage.className = "ai-message ai-bot";

            botMessage.textContent =
                "🤖 " + data.answer;

            aiMessages.appendChild(botMessage);

            aiMessages.scrollTop =
                aiMessages.scrollHeight;

        } catch (error) {

            console.error(
                "❌ AI CHAT ERROR:",
                error
            );

            loadingMessage.textContent =
                "❌ Netflix AI is currently unavailable.";

        }
    }


    // Send button
    aiSendButton.addEventListener(
        "click",
        sendAIMessage
    );


    // Enter key
    aiChatInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                sendAIMessage();

            }

        }
    );

    console.log(
        "✅ Netflix AI Chat initialized"
    );

} else {

    console.error(
        "❌ Netflix AI Chat elements not found"
    );

    console.log("Input:", aiChatInput);
    console.log("Button:", aiSendButton);
    console.log("Messages:", aiMessages);
}