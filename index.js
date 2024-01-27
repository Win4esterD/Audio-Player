//Play button and its ancestors:
const playButton = document.querySelector(".player__play-button");
const playTriagle = playButton.firstElementChild;
const pauseBars = playButton.firstElementChild.nextElementSibling;

const progressBar = document.querySelector(".player__progress-bar");
const prevTrack = document.querySelector(".player__prev-song");
const nextTrack = document.querySelector(".player__next-song");
const volume = document.querySelector(".player__volume");
const currTime = document.querySelector(".player__current-time");
const endTime = document.querySelector(".player__end-time");
const songsList = document.querySelector(".player__songs-wrapper");

const audio = new Audio(songs[0].link);

audio.addEventListener("loadedmetadata", function () {
  getAudioTime(this.duration, endTime);
  progressBar.setAttribute("max", audio.duration);
});

function getAudioTime(currentTime, tagToPush) {
  const minutes = Math.floor(currentTime / 60);
  const seconds = Math.floor(currentTime % 60);
  tagToPush.innerHTML = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function switchToNextTrack() {
  for (let track of songsList.children) {
    if (track.hasAttribute("id") && track.nextElementSibling) {
      track.nextElementSibling.click();
      break;
    } else if (track.hasAttribute("id") && !track.nextElementSibling) {
      songsList.children[0].click();
      break;
    }
  }
}

nextTrack.addEventListener("click", switchToNextTrack);

function switchToPreviousTrack() {
  if (songsList.firstElementChild.hasAttribute("id")) {
    songsList.lastElementChild.click();
  } else {
    for (let track of songsList.children) {
      if (track.hasAttribute("id")) {
        track.previousElementSibling.click();
        break;
      }
    }
  }
}

prevTrack.addEventListener("click", switchToPreviousTrack);

function fillPlayerSongsList(songs) {
  const main = document.body.firstElementChild.firstElementChild;
  songs.forEach((song, index) => {
    const songElement = document.createElement("p");
    songElement.className = "player__song";
    songElement.innerHTML = `${song.author} - ${song.name}`;
    songElement.index = index;
    if (songElement.index === 0) {
      songElement.setAttribute("id", "song-playing");
      main.style.backgroundImage = `url(${song.background})`;
    }
    songsList.appendChild(songElement);
    songElement.onclick = function (event) {
      main.style.backgroundImage = `url(${songs[this.index].background})`;
      audio.setAttribute("src", songs[this.index].link);
      audio.play();
      for (let el of event.target.parentElement.children) {
        if (el !== event.target) {
          el.removeAttribute("id");
        } else {
          el.setAttribute("id", "song-playing");
        }
      }
    };
  });
}

fillPlayerSongsList(songs);

playButton.addEventListener("click", function () {
  if (this.firstElementChild.hasAttribute("id")) {
    audio.play();
    playTriagle.removeAttribute("id");
    pauseBars.setAttribute("id", "active-play-state");
  } else {
    audio.pause();
    pauseBars.removeAttribute("id");
    playTriagle.setAttribute("id", "active-play-state");
  }
});

audio.addEventListener("play", function () {
  playTriagle.removeAttribute("id");
  pauseBars.setAttribute("id", "active-play-state");
});

audio.addEventListener("timeupdate", function () {
  const currentTime = Math.floor(audio.currentTime);
  getAudioTime(currentTime, currTime);
  progressBar.value = audio.currentTime;
});

audio.onended = function () {
  nextTrack.click();
};

progressBar.addEventListener("input", function () {
  audio.currentTime = this.value;
});

volume.addEventListener("input", function () {
  audio.volume = this.value / 100;
});

console.log("60 points");
