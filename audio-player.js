const playPauseBtn = document.getElementById("playPauseBtn");
const playTimeLeft = document.getElementById("playtime-left");
const slider = document.getElementById('duration-slider');
const dropdownBtn = document.getElementById("dropdown-btn");
const dropdownMenu = document.getElementById("dropdown-items");
const dropdownMenuItems = document.querySelectorAll(".dropdown-items li");

let audio = new Audio("https://listen-to-article-track.s3.eu-central-1.amazonaws.com/3/kinderarzt_schlie%C3%9Ft_praxis.m4a");
let isPlaying = false;
let intervalId;

audio.addEventListener("loadedmetadata", showTimeLeft);
audio.addEventListener("timeupdate", showTimeLeft);
audio.addEventListener("ended", goToAudioStart);
playPauseBtn.addEventListener("click", playPause);
slider.addEventListener("change", changeSliderPosition);
dropdownBtn.addEventListener("click", toggleDropdown);

function showTimeLeft() {
    const duration = parseInt(audio.duration);
    const currentTime = parseInt(audio.currentTime);
    const timeLeft = duration - currentTime;
    let seconds = timeLeft % 60;
    let minutes = Math.floor(timeLeft / 60) % 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    playTimeLeft.innerHTML = `- ${minutes}:${seconds}`;
}

function playPause() {
    if(!isPlaying) {
        isPlaying = true;
        audio.play();
        intervalId = setInterval(updateDurationSliderPosition, 500);
        trackAudioDurationListened();
        playPauseBtn.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
    } else {
        isPlaying = false;
        audio.pause();
        clearInterval(intervalId);
        playPauseBtn.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    }
}

function goToAudioStart() {
    isPlaying = false;
    clearInterval(intervalId);
    playPauseBtn.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    slider.value = 0;
    slider.style.backgroundSize = "0% 100%";
}

function updateDurationSliderPosition() {
    let position = 0;

    if (!isNaN(audio.duration)) {
        position = audio.currentTime * (100 / audio.duration);
        slider.value = position;
        const bgSizePercentage = position >= 75 ? position - 0.5 : position + 0.5;
        slider.style.backgroundSize = bgSizePercentage + "% 100%";
    }
}

function trackAudioDurationListened() {
    let audio25 = true;
    let audio50 = true;
    let audio75 = true;
    let audio100 = true;

    const audioIntervalId = setInterval(() => {
        if(audio.currentTime >= audio.duration * 0.25 && audio25) {
            console.log("25% of Audio!")
            audio25 = false;
        }
        if(audio.currentTime >= audio.duration * 0.5 && audio50) {
            console.log("50% of Audio!")
            audio50 = false;
        }
        if(audio.currentTime >= audio.duration * 0.75 && audio75) {
            console.log("75% of Audio!")
            audio75 = false;
        }
        if(audio.currentTime >= audio.duration * 0.995 && audio100) {
            console.log("100% of Audio!")
            audio100 = false;
        }

        if(!audio100) {
            clearInterval(audioIntervalId);
        }
    }, 1000);

}

function changeSliderPosition() {
    const sliderPosition = audio.duration * (slider.value / 100);
    audio.currentTime = sliderPosition;
    slider.style.backgroundSize = slider.value + "% 100%";
}

function toggleDropdown(e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle("show");
    changeBtnText(e);
    audio.playbackRate = parseFloat(e.target.innerText);
}

document.documentElement.addEventListener("click", function (e) {
    if (dropdownMenu.classList.contains("show")) {
        toggleDropdown(e);
    }
});

function changeBtnText(e) {
    dropdownMenuItems.forEach(item => {
        if(item === e.target) {
            dropdownBtn.innerText = e.target.innerText;
        }
    })
}

// function addSelectedItemBackground(e) {
//     dropdownMenuItems.forEach(item => {
//         if(item.innerText === e.target.innerText) {
//             item.classList.add("selected-speed");
//         }
//     })
// }

// function removeSelectedItemBackground() {
//     dropdownMenuItems.forEach(item => {
//         if (item.classList.contains("selected-speed")) {
//             item.classList.remove("selected-speed");
//         }
//     })
// }
