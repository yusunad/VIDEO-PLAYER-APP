const selectVideo = document.querySelector("#fileinput");
const videoContainer = document.querySelector(".video");
const playpauseIcon = document.querySelector(".playpause");
const volumeMute = document.querySelector(".volume");
const enlargevideo = document.querySelector(".maximize");
const progressBar = document.querySelector(".progress-bar");
// function to select video
selectVideo.addEventListener("change", function () {
  const video = selectVideo.files[0];

  if (video) {
    const videoURL = URL.createObjectURL(video);
    videoContainer.setAttribute("src", videoURL);
  }
});

// function to play or pause video
playpauseIcon.addEventListener("click", function () {
  if (videoContainer.src === "") {
    alert("Please select a video file first.");
    return;
  }

  if (videoContainer.paused) {
    videoContainer.play();
    playpauseIcon.setAttribute("src", "img/pause.png");
  } else {
    videoContainer.pause();
    playpauseIcon.setAttribute("src", "img/play.png");
  }
});

// function for Volume/Mute
volumeMute.addEventListener("click", function () {
  if (videoContainer.muted) {
    videoContainer.muted = false;
    volumeMute.setAttribute("src", "img/volume.png");
  } else {
    videoContainer.muted = true;
    volumeMute.setAttribute("src", "img/mute.png");
  }
});

// enlarge video function
enlargevideo.addEventListener("click", function () {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    // Firefox
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    // IE/Edge
    videoContainer.msRequestFullscreen();
  }
});

// function to format time

function formatTime(seconds) {
  seconds = Math.floor(seconds);
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formattedHrs = hrs > 0 ? `${hrs}:` : "";
  const formattedMins = hrs > 0 ? String(mins).padStart(2, "0") : String(mins);
  const formattedSecs = String(secs).padStart(2, "0");

  return ` ${formattedHrs}${formattedMins}:${formattedSecs}`;
}
videoContainer.addEventListener("loadedmetadata", function () {
  const duration = videoContainer.duration;
  const totalDuration = formatTime(duration);

  //const totalDurationEle = document.querySelector(".totalDuration");
  //totalDurationEle.textContent = totalDuration;
});

videoContainer.addEventListener("timeupdate", function () {
  const currentTime = formatTime(videoContainer.currentTime);
  const totalDuration = formatTime(videoContainer.duration);

  const currentTimeEle = document.querySelector(".currentDuration");
  currentTimeEle.textContent = `${currentTime} / ${totalDuration}`;

  const duration = videoContainer.duration;
  const currentProgressPercentage = Math.round(
    (videoContainer.currentTime / duration) * 100
  );

  const progressEle = document.querySelector(".progress");
  progressEle.style.width = `${currentProgressPercentage}%`;
});

// Add seeking functionality for progress bar
let isDragging = false;

// Click to seek
progressBar.addEventListener("click", function (event) {
  if (videoContainer.src === "" || !videoContainer.duration) return;

  const rect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const progressBarWidth = rect.width;
  const clickPercentage = (clickX / progressBarWidth) * 100;

  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, clickPercentage));

  // Calculate new time and seek
  const newTime = (clampedPercentage / 100) * videoContainer.duration;
  videoContainer.currentTime = newTime;
});

// Drag to seek
progressBar.addEventListener("mousedown", function (e) {
  if (videoContainer.src === "" || !videoContainer.duration) return;

  isDragging = true;
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const progressBarWidth = rect.width;
  const clickPercentage = (clickX / progressBarWidth) * 100;

  const clampedPercentage = Math.max(0, Math.min(100, clickPercentage));
  const newTime = (clampedPercentage / 100) * videoContainer.duration;
  videoContainer.currentTime = newTime;
});

// Handle mouse move during drag
document.addEventListener("mousemove", function (e) {
  if (!isDragging || videoContainer.src === "" || !videoContainer.duration)
    return;

  const rect = progressBar.getBoundingClientRect();
  const moveX = e.clientX - rect.left;
  const progressBarWidth = rect.width;
  const movePercentage = (moveX / progressBarWidth) * 100;

  const clampedPercentage = Math.max(0, Math.min(100, movePercentage));
  const newTime = (clampedPercentage / 100) * videoContainer.duration;
  videoContainer.currentTime = newTime;
});

// Stop dragging
document.addEventListener("mouseup", function () {
  isDragging = false;
});

// Handle mouse leave to stop dragging
document.addEventListener("mouseleave", function () {
  isDragging = false;
});
