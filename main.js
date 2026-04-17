// VARIABLE GLOBALE
let isRecording = false;
let records = [];
let startTime = 0;
let stopTime = 0;

let keys = document.querySelectorAll(".key");

/// Appuies des touches
window.addEventListener("keydown", handleKeydownWindow);
/// Relachement des touches
window.addEventListener("keyup", handleKeyupWindow);
/// Clique sur les touches
keys.forEach((key) => {
  key.addEventListener("click", handleClickKey);
});

// FONCTION D'EVENEMENT
function handleKeydownWindow(event) {
  if (event.repeat) return;

  hub(event.keyCode);
}

function handleKeyupWindow(event) {
  // Si la touche relache est la touche R OU P, on ne continue pas
  if (event.keyCode === 82 || event.keyCode === 80) return;

  removeAnimation(event.keyCode);
}

function handleClickKey(event) {
  let key = event.target.closest("[data-key]");

  let keyCode = parseInt(key.dataset.key);

  hub(keyCode);

   // Si la touche relache est la touche R OU P, on ne continue pas
  if (keyCode === 82 || keyCode === 80) return;
  setTimeout(() => {
    removeAnimation(keyCode);
  }, 200);
  
}

// FONCTION D'ACTION
function playSound(keyCode) {
  let audio = getAudio(keyCode);
  if (!audio) return;

  let key = getDiv(keyCode);
  if (!key) return;

  audio.currentTime = 0;
  audio.play();
  key.classList.add("playing");

  if (isRecording) {
    record(keyCode);
  }

  return;
}

function startRecording(keyCode) {
  let key = getDiv(keyCode);
  key.classList.toggle("playing");

  isRecording = !isRecording;
  if (isRecording) {
    records = [];
    startTime = Date.now();
  } else {
    stopTime = Date.now() - startTime;
  }

  return;
}

function record(keyCode) {
  time = Date.now() - startTime;
  records.push({ keyCode, time });
}

function play(keyCode) {
  let key = getDiv(keyCode);
  key.classList.add("playing");

  records.forEach((note) => {
    setTimeout(() => {
      playSound(note.keyCode);
      setTimeout(() => {
        removeAnimation(note.keyCode);
      }, 100);
    }, note.time);
  });

  setTimeout(() => {
    removeAnimation(keyCode);
  }, stopTime);
}

/// FONCTION UTILITAIRE

function getDiv(keyCode) {
  //On récupère la div concerné par la touche appuyé
  return document.querySelector(`div[data-key="${keyCode}"]`);
}

function getAudio(keyCode) {
  //On récupère l'audio concerné par la touche appuyé
  return document.querySelector(`audio[data-key="${keyCode}"]`);
}

function removeAnimation(keyCode) {
  let key = getDiv(keyCode);
  if (!key) return;
  key.classList.remove("playing");
}

function hub(keyCode) {
  switch (keyCode) {
    case 82:
      startRecording(keyCode);
      break;

    case 80:
      play(keyCode);
      break;

    default:
      playSound(keyCode);
      break;
  }
}
