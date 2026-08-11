// ==========================================
// NETFLIX PLAYER
// player.js
// ==========================================

// Movie ID

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

// Elements

const video = document.getElementById("videoPlayer");
const source = document.getElementById("videoSource");

const title = document.getElementById("movieTitle");

const backBtn = document.getElementById("backBtn");
const skipBtn = document.getElementById("skipIntro");

const topBar = document.querySelector(".top-bar");

// ==========================================
// Load Movie
// ==========================================

async function loadMovie(){

    try{

        const res =
        await fetch(
        `http://localhost:5000/api/movies/${movieId}`
        );

        const movie =
        await res.json();

        title.innerText =
        movie.title;

        document.title =
        movie.title + " | Netflix";

        source.src =
        movie.trailer;

        video.load();

        video.play();

    }

    catch(error){

        console.log(error);

    }

}

loadMovie();

// ==========================================
// Back Button
// ==========================================

backBtn.onclick = ()=>{

    window.location.href =
    `movie.html?id=${movieId}`;

};

// ==========================================
// Skip Intro
// ==========================================

skipBtn.onclick = ()=>{

    video.currentTime = 60;

    skipBtn.style.display = "none";

};

// ==========================================
// Auto Hide Skip Button
// ==========================================

video.addEventListener("timeupdate",()=>{

    if(video.currentTime>60){

        skipBtn.style.display="none";

    }

});

// ==========================================
// Auto Hide Controls
// ==========================================

let hideTimer;

function hideUI(){

    clearTimeout(hideTimer);

    topBar.style.opacity="1";
    skipBtn.style.opacity="1";

    hideTimer=setTimeout(()=>{

        topBar.style.opacity="0";
        skipBtn.style.opacity="0";

    },3000);

}

document.addEventListener("mousemove",hideUI);

hideUI();

// ==========================================
// Space = Play/Pause
// ==========================================

document.addEventListener("keydown",(e)=>{

    if(e.code==="Space"){

        e.preventDefault();

        if(video.paused){

            video.play();

        }

        else{

            video.pause();

        }

    }

});

// ==========================================
// Arrow Keys
// ==========================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowRight"){

        video.currentTime +=10;

    }

    if(e.key==="ArrowLeft"){

        video.currentTime -=10;

    }

});

// ==========================================
// Resume Watching
// ==========================================

const progressKey =
"progress_"+movieId;

const saved =
localStorage.getItem(progressKey);

video.addEventListener("loadedmetadata",()=>{

    if(saved){

        video.currentTime=
        Number(saved);

    }

});

setInterval(()=>{

    localStorage.setItem(

        progressKey,

        video.currentTime

    );

},5000);

// ==========================================
// Ended
// ==========================================

video.addEventListener("ended",()=>{

    localStorage.removeItem(progressKey);

});

// ==========================================

console.log("Netflix Player Loaded");
// ==========================================
// CUSTOM PLAYER CONTROLS
// ==========================================

const playPause = document.getElementById("playPause");
const rewind = document.getElementById("rewind");
const forward = document.getElementById("forward");
const muteBtn = document.getElementById("muteBtn");
const progressBar = document.getElementById("progressBar");
const fullscreenBtn = document.getElementById("fullscreen");
const speed = document.getElementById("speed");
const time = document.getElementById("time");
const controls = document.getElementById("controls");

// ==========================================
// PLAY / PAUSE
// ==========================================

playPause.onclick = () => {

    if(video.paused){

        video.play();

        playPause.innerHTML =
        '<i class="fa-solid fa-pause"></i>';

    }

    else{

        video.pause();

        playPause.innerHTML =
        '<i class="fa-solid fa-play"></i>';

    }

};

video.onplay=()=>{

playPause.innerHTML=
'<i class="fa-solid fa-pause"></i>';

}

video.onpause=()=>{

playPause.innerHTML=
'<i class="fa-solid fa-play"></i>';

}

// ==========================================
// REWIND / FORWARD
// ==========================================

rewind.onclick=()=>{

video.currentTime-=10;

}

forward.onclick=()=>{

video.currentTime+=10;

}

// ==========================================
// MUTE
// ==========================================

muteBtn.onclick=()=>{

video.muted=!video.muted;

if(video.muted){

muteBtn.innerHTML=
'<i class="fa-solid fa-volume-xmark"></i>';

}

else{

muteBtn.innerHTML=
'<i class="fa-solid fa-volume-high"></i>';

}

}

// ==========================================
// PROGRESS BAR
// ==========================================

video.addEventListener("timeupdate",()=>{

const percent=
(video.currentTime/video.duration)*100;

progressBar.value=percent;

const current=formatTime(video.currentTime);

const total=formatTime(video.duration);

time.innerText=
`${current} / ${total}`;

});

progressBar.oninput=()=>{

video.currentTime=
(progressBar.value/100)*video.duration;

}

// ==========================================
// PLAYBACK SPEED
// ==========================================

speed.onchange=()=>{

video.playbackRate=
Number(speed.value);

}

// ==========================================
// FULLSCREEN
// ==========================================

fullscreenBtn.onclick=()=>{

if(document.fullscreenElement){

document.exitFullscreen();

}

else{

document.documentElement.requestFullscreen();

}

}

// ==========================================
// TIME FORMAT
// ==========================================

function formatTime(seconds){

if(isNaN(seconds)) return "00:00";

let mins=Math.floor(seconds/60);

let secs=Math.floor(seconds%60);

if(mins<10) mins="0"+mins;

if(secs<10) secs="0"+secs;

return `${mins}:${secs}`;

}

// ==========================================
// AUTO HIDE CONTROLS
// ==========================================

let controlTimer;

function showControls(){

controls.style.opacity="1";
topBar.style.opacity="1";

clearTimeout(controlTimer);

controlTimer=setTimeout(()=>{

if(!video.paused){

controls.style.opacity="0";
topBar.style.opacity="0";

}

},3000);

}

document.addEventListener("mousemove",showControls);

video.addEventListener("pause",showControls);

video.addEventListener("play",showControls);

showControls();