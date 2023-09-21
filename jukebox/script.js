const audioFiles = [
    {
        title: "Curse These Metal Hands",
        url: "songs/CurseTheseMetalHands.mp3",
    },
    {
        title: "DieCryHate",
        url: "songs/DieCryHate.mp3",
    },
    {
        title: "Don't Let The Bastards Grind You Down",
        url: "songs/Don_t_Let_The_Bastards_Grind_You_Down.mp3",
    },
    {
        title: "Fist-Related Teeth Disorder",
        url: "songs/FistRelatedTeethDisorder.mp3",
    },
    {
        title: "Maggots (Did Someone Say Maggots?)",
        url: "songs/Maggots_(Did_Someone_Say_Maggots).mp3",
    },
    {
        title: "Panic",
        url: "songs/Panic.mp3",
    },
    {
        title: "Shatner's Bassoon",
        url: "songs/Shatner_s_Bassoon.mp3",
    },
    {
        title: "Thud",
        url: "songs/ThudV2.mp3",
    },
    {
        title: "Trickle Down",
        url: "songs/Trickle_Down_(or_How_I_Learned_to_Stop_Worrying_and_Love_the_Market).mp3",
    },
    {
        title: "We Were Promised Robots",
        url: "songs/We_Were_Promised_Robots.mp3",
    },
    {
        title: "Why Aren't You Angrier?",
        url: "songs/WhyArentYouAngrierV2.mp3",
    },
];

const audio = document.getElementById("audio");
const playlistContainer = document.getElementById("playlist");
const autoplayCheckbox = document.getElementById("autoplay-checkbox");
let currentSongIndex = 0;

function play(index) {
    currentSongIndex = index;
    audio.src = audioFiles[index].url;
    audio.load();
    audio.play();
    updateCurrentlyPlaying();
}

function pause() {
    audio.pause();
}

function stop() {
    audio.pause();
    audio.currentTime = 0;
}

function playNext() {
    currentSongIndex = (currentSongIndex + 1) % audioFiles.length;
    play(currentSongIndex);
}

function createPlaylist() {
    shuffleArray(audioFiles);
    audioFiles.forEach((song, index) => {
        const songElement = document.createElement("div");
        songElement.classList.add("song");
        songElement.innerHTML = `
        <span class="song-title" onclick="play(${index})">${song.title}</span>
      `;
        playlistContainer.appendChild(songElement);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateCurrentlyPlaying() {
    const songElements = document.querySelectorAll(".song");
    songElements.forEach((songElement, index) => {
      if (index === currentSongIndex) {
        songElement.classList.add("playing");
        document.title = `${audioFiles[currentSongIndex].title} - VF Jukebox`;
      } else {
        songElement.classList.remove("playing");
      }
    });
  }

createPlaylist(); // Create the playlist when the page loads

audio.addEventListener("ended", () => {
    if (autoplayCheckbox.checked) {
      playNext();
    }
  });