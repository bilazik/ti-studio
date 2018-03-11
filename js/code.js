"use strict";

var track = window.document.getElementById("track-to-play");
var timePassed = document.getElementById("time-passed");
var timeLeft = document.getElementById("time-left");
var timeLine = document.getElementById("control-timeline");
var volumeDown = document.getElementById("control-volume-down");
var volumeUp = document.getElementById("control-volume-up");
var toTop = document.getElementById("to-top");

toTop.addEventListener("click", function() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
});

window.onscroll = function() {
  if (window.pageYOffset > 385) {
    toTop.style.display = "block";
  } else {
    toTop.style.display = "none";
  }
};

window.onload = function() {
  var currentTime = new Date();
  var currentYear = currentTime.getFullYear();
  var years = document.getElementById("years");

  if (currentYear == "2018") {
    years.innerHTML = "2018";
  } else {
    years.innerHTML = "2018&mdash;" + currentYear;
  }
}

function playSong() {
  var playButton = document.getElementById("control-button");
  if (track.paused) {
    track.play();
    playButton.classList.remove("player__button--play");
    playButton.classList.add("player__button--pause");
  } else {
    track.pause();
    playButton.classList.remove("player__button--pause");
    playButton.classList.add("player__button--play");
  }
};

function formatTime(total) {
  var minutes = Math.floor(total / 60);
  var seconds = Math.floor(total - (minutes * 60));

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return minutes + ":" + seconds;
};

track.onloadedmetadata = function() {
  var trackDuration = Math.floor(track.duration);
  var playHead = document.getElementById("control-playhead");
  var timeLineWidth = timeLine.offsetWidth - playHead.offsetWidth;
  timeLeft.innerHTML = "&minus;" + formatTime(trackDuration);
  track.volume = 0.5;

  if (isNaN(track.duration)) {
    timeLeft.innerHTML = "00:00";
  }

  track.ontimeupdate = function() {
    var timeLeftInSeconds = Math.floor(trackDuration) - Math.floor(track.currentTime);
    timePassed.innerHTML = formatTime(track.currentTime);
    timeLeft.innerHTML = "&minus;" + formatTime(timeLeftInSeconds);
    var percentPassed = 91 * (track.currentTime / trackDuration);
    playHead.style.marginLeft = percentPassed + "%";
  };

  timeLine.addEventListener("click", function(event) {
    movePlayHead(event);
    track.currentTime = track.duration * clickPercent(event);
  }, false);

  function clickPercent(event) {
    return (event.clientX - getPosition(timeLine)) / timeLineWidth;
  };

  function movePlayHead(event) {
    var newMarginLeft = event.clientX - getPosition(timeLine);

    if (newMarginLeft >= 0 && newMarginLeft <= timeLineWidth) {
      playHead.style.marginLeft = newMarginLeft + "px";
    }
    if (newMarginLeft < 0) {
      playHead.style.marginLeft = "0";
    }
    if (newMarginLeft > timeLineWidth) {
      playHead.style.marginLeft = timeLineWidth + "px";
    }
  };

  function getPosition(element) {
    return element.getBoundingClientRect().left;
  };
};

volumeDown.addEventListener("click", function() {
  if (track.volume >= 0.1) {
    track.volume -= 0.1;
  } else {
    track.volume = 0;
  }
});

volumeUp.addEventListener("click", function() {
  if (track.volume <= 0.9) {
    track.volume += 0.1;
  } else {
    track.volume = 1;
  }
});
