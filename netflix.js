const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if(window.scrollY > 80){

        header.classList.add("scrolled");

    }
    else{

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
// Movie Hover Effect
// =====================================

const movies = document.querySelectorAll(".row img");

movies.forEach((movie) => {

    movie.addEventListener("mouseenter", () => {

        movie.style.transform = "scale(1.15)";

    });

    movie.addEventListener("mouseleave", () => {

        movie.style.transform = "scale(1)";

    });

});

// =====================================
// Double Click Favorite
// =====================================

movies.forEach((movie)=>{

    movie.addEventListener("dblclick",()=>{

        movie.style.border="4px solid red";

    });

});

// =====================================
// Keyboard Shortcut
// Press "H" to Scroll Top
// =====================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="h" || e.key==="H"){

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

});

// =====================================
// Fade In Sections
// =====================================

const sections=document.querySelectorAll(".movies");

const observer=new IntersectionObserver((entries)=>{

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

// =====================================
// Search Icon
// =====================================

const search=document.querySelector(".fa-magnifying-glass");

search.addEventListener("click",()=>{

let movie=prompt("Search Movie");

if(movie){

alert(movie+" not found.");

}

});

// =====================================
// Notification
// =====================================

const bell=document.querySelector(".fa-bell");

bell.addEventListener("click",()=>{

alert("No New Notifications");

});

// =====================================
// Profile Click
// =====================================

const profile=document.querySelector(".right img");

profile.addEventListener("click",()=>{

alert("Profile Menu");

});

// =====================================
// End
// =====================================