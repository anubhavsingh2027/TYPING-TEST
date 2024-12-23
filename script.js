let startTime;
let timerInterval;
let countdownInterval;
let hasStarted = false;

const textToTypeElement = document.getElementById("text-to-type");
const userInput = document.getElementById("user-input");
const startButton = document.getElementById("start-button");
const timeDisplay = document.getElementById("time").querySelector("span");
const accuracyDisplay = document.getElementById("accuracy").querySelector("span");
const wpmDisplay = document.getElementById("wpm").querySelector("span");

const overlay = document.getElementById("overlay");
const finalAccuracy = document.getElementById("final-accuracy");
const finalWpm = document.getElementById("final-wpm");
const restartButton = document.getElementById("restart-button");

function calculateResults() {
  const typedText = userInput.value.trim();
  const targetText = textToTypeElement.innerText.trim();

  const typedWords = typedText.split(/\s+/);
  const targetWords = targetText.split(/\s+/);

  let correctWords = 0;

  for (let i = 0; i < typedWords.length; i++) {
    const typedWord = typedWords[i];
    const targetWord = targetWords[i];

    if (targetWord) {
      if (typedWord === targetWord) {
        correctWords++;
      } else if (targetWord.startsWith(typedWord)) {
        correctWords += typedWord.length / targetWord.length;
      }
    }
  }

  const accuracy = typedWords.length > 0 
    ? Math.round((correctWords / typedWords.length) * 100) 
    : 0;

  const timeTaken = (Date.now() - startTime) / 1000;
  const wpm = Math.round((typedWords.length / timeTaken) * 60);

  accuracyDisplay.textContent = accuracy;
  wpmDisplay.textContent = wpm;

  if (typedWords.join(" ") === targetWords.join(" ")) {
    clearInterval(timerInterval);
    clearInterval(countdownInterval);
    showOverlay();
  }
}

function endTypingTest() {
  clearInterval(countdownInterval);
  clearInterval(timerInterval);
  userInput.disabled = true;

  finalAccuracy.textContent = accuracyDisplay.textContent;
  finalWpm.textContent = wpmDisplay.textContent;

  showOverlay();
}

function showOverlay() {
  overlay.classList.remove("hidden");
}

function startTypingTest() {
  const selectedTime = parseInt(document.querySelector(".time-selection").value, 10);

  if (!selectedTime) {
    alert("Please select a time duration for the test!");
    return;
  }

  hasStarted = true;

  userInput.value = "";
  userInput.disabled = false;
  userInput.focus();
  startTime = Date.now();
  timeDisplay.textContent = selectedTime.toString();
  accuracyDisplay.textContent = "0";
  wpmDisplay.textContent = "0";

  overlay.classList.add("hidden");

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(calculateResults, 100);

  let remainingTime = selectedTime;
  countdownInterval = setInterval(() => {
    if (hasStarted) {
      remainingTime--;
      timeDisplay.textContent = remainingTime;

      if (remainingTime <= 0) {
        endTypingTest();
      }
    }
  }, 1000);
}

startButton.addEventListener("click", startTypingTest);

restartButton.addEventListener("click", () => {
  overlay.classList.add("hidden");
  userInput.disabled = false;
  userInput.value = "";
  accuracyDisplay.textContent = "0";
  wpmDisplay.textContent = "0";
  timeDisplay.textContent = "0";
  document.querySelector(".time-selection").value = "15";
  hasStarted = false;
});

userInput.addEventListener("input", () => {
  userInput.style.height = "auto";
  userInput.style.height = `${userInput.scrollHeight}px`;
});

document.addEventListener("DOMContentLoaded", () => {
  userInput.style.height = "auto";
  userInput.style.height = `${userInput.scrollHeight}px`;
});
