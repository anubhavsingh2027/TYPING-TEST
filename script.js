// Core State
let currentMode = "classic";
let duration = 60;
let timeLeft = 60;
let isTyping = false;
let startTime = null;
let timerInterval = null;
let currentText = "";
let currentIndex = 0;
let errors = 0;
let correctChars = 0;
let totalChars = 0;
let streak = 0;
let maxStreak = 0;
let wpmHistory = [];
let graphUpdateInterval = null;

// Text Content
const textContent = {
  classic: [
    "the quick brown fox jumps over the lazy dog pack my box with five dozen liquor jugs how vexingly quick daft zebras jump",
    "programming is the art of telling another human what one wants the computer to do artificial intelligence will not replace programmers but programmers who use AI will replace those who do not",
    "practice makes perfect but deliberate practice makes mastery focus on accuracy first then gradually build speed typing is a fundamental skill in the digital age",
    "innovation drives progress but success demands persistence determination and unwavering focus on achieving your goals through consistent effort and dedication",
    "efficiency in typing comes from muscle memory developed through consistent practice and mindful attention to proper finger placement and technique",
    "master the keyboard and unlock new possibilities in your digital journey where speed and accuracy combine to enhance productivity",
  ],
  paragraph: [
    "The art of typing transcends mere mechanical skill; it represents a harmonious dance between mind and muscle memory. Each keystroke is a note in a symphony of productivity, where rhythm and precision combine to create effortless communication. As your fingers glide across the keyboard, you're not just pressing keys—you're translating thoughts into tangible form at the speed of cognition.",
    "In the digital age, typing has become as fundamental as reading and writing. It's the primary interface through which we interact with technology, express our ideas, and connect with others across the globe. The ability to type quickly and accurately can dramatically improve productivity, reduce frustration, and open doors to opportunities that require digital literacy.",
    "Mastering the keyboard is like learning to play a musical instrument. Every finger has its role, every key its purpose. The rhythm of typing becomes second nature, a dance of digits across the keys that transforms thoughts into text with effortless grace. This skill, once acquired, becomes an invaluable asset in our increasingly digital world.",
    "Technology continues to evolve, but the fundamental skill of typing remains constant. Whether you're coding the next breakthrough application, crafting compelling content, or simply communicating with colleagues, your typing proficiency directly impacts your efficiency and effectiveness in the digital workspace.",
    "The journey to typing mastery is unique for each individual. Some may naturally gravitate towards speed, while others prioritize accuracy. The key is finding the right balance, understanding that true proficiency comes from the harmonious blend of both qualities, refined through dedicated practice.",
  ],
  code: [
    "function calculateWPM(chars, time) {\n  const words = chars / 5;\n  const minutes = time / 60;\n  return Math.round(words / minutes);\n}",

    "class TypingTest {\n  constructor() {\n    this.wpm = 0;\n    this.accuracy = 100;\n    this.startTime = null;\n    this.errors = 0;\n  }\n\n  start() {\n    this.startTime = Date.now();\n    this.errors = 0;\n    return this;\n  }\n\n  calculateScore() {\n    const timeElapsed = (Date.now() - this.startTime) / 1000;\n    const accuracy = ((this.total - this.errors) / this.total) * 100;\n    return { wpm: this.wpm, accuracy, timeElapsed };\n  }\n}",

    "async function fetchTypingStats(userId) {\n  try {\n    const response = await fetch(`/api/users/${userId}/stats`);\n    const data = await response.json();\n    return data.map(entry => ({\n      wpm: entry.wpm,\n      accuracy: entry.accuracy,\n      date: new Date(entry.timestamp),\n      duration: entry.testDuration\n    }));\n  } catch (error) {\n    console.error('Error fetching stats:', error);\n    return [];\n  }\n}",

    "function analyzeTypingPerformance(history) {\n  const recentTests = history.slice(-10);\n  const avgWPM = recentTests.reduce((sum, test) => sum + test.wpm, 0) / recentTests.length;\n  const avgAccuracy = recentTests.reduce((sum, test) => sum + test.accuracy, 0) / recentTests.length;\n  \n  return {\n    averageWPM: Math.round(avgWPM),\n    averageAccuracy: Math.round(avgAccuracy),\n    improvement: avgWPM - history[0].wpm,\n    totalTests: history.length\n  };\n}",

    "class AdvancedTypingTest extends TypingTest {\n  constructor(options = {}) {\n    super();\n    this.language = options.language || 'english';\n    this.difficulty = options.difficulty || 'medium';\n    this.timeLimit = options.timeLimit || 60;\n    this.wordList = [];\n  }\n\n  async initialize() {\n    try {\n      this.wordList = await this.loadWordList(this.language);\n      this.generateText();\n      return true;\n    } catch (error) {\n      console.error('Initialization failed:', error);\n      return false;\n    }\n  }\n\n  generateText() {\n    const wordCount = this.difficulty === 'easy' ? 25 : this.difficulty === 'medium' ? 50 : 75;\n    const selectedWords = this.wordList\n      .sort(() => Math.random() - 0.5)\n      .slice(0, wordCount);\n    return selectedWords.join(' ');\n  }\n}",
  ],
  zen: [
    "breathe type flow breathe type flow breathe type flow breathe type flow breathe type flow breathe type flow",
  ],
  practice: [],
};

// Achievements System
const achievements = [
  {
    id: "first_test",
    name: "First Steps",
    description: "Complete your first test",
    icon: "🎯",
    unlocked: false,
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Reach 60 WPM",
    icon: "⚡",
    unlocked: false,
  },
  {
    id: "lightning_fast",
    name: "Lightning Fast",
    description: "Reach 80 WPM",
    icon: "⚡⚡",
    unlocked: false,
  },
  {
    id: "sonic_speed",
    name: "Sonic Speed",
    description: "Reach 100 WPM",
    icon: "🚀",
    unlocked: false,
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "100% accuracy",
    icon: "💯",
    unlocked: false,
  },
  {
    id: "consistent",
    name: "Consistent",
    description: "Complete 10 tests",
    icon: "🎖️",
    unlocked: false,
  },
  {
    id: "dedicated",
    name: "Dedicated",
    description: "Complete 50 tests",
    icon: "🏅",
    unlocked: false,
  },
  {
    id: "marathon",
    name: "Marathon Runner",
    description: "Complete 100 tests",
    icon: "🏆",
    unlocked: false,
  },
  {
    id: "streak_10",
    name: "Hot Streak",
    description: "10 correct characters in a row",
    icon: "🔥",
    unlocked: false,
  },
  {
    id: "streak_50",
    name: "On Fire!",
    description: "50 correct characters in a row",
    icon: "🔥🔥",
    unlocked: false,
  },
];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Show loader for 2 seconds then fade out
  const loader = document.getElementById("loaderScreen");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hidden");
      // Remove from DOM after animation completes
      setTimeout(() => loader.remove(), 500);
    }, 2000);
  }

  loadSettings();
  loadAchievements();
  generateText();
  setupAutoStart();
  // initialize navbar behaviors (mobile menu, profile, dark mode)
  setupNavbar();
});

// Navbar: setup and handlers
function setupNavbar() {
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const profileBtn = document.getElementById("profileBtn");
  const darkToggle = document.getElementById("darkModeToggle");
  const navSearch = document.getElementById("navSearch");

  if (mobileBtn) mobileBtn.addEventListener("click", toggleMobileMenu);
  if (profileBtn) profileBtn.addEventListener("click", toggleProfileMenu);
  if (darkToggle) darkToggle.addEventListener("click", toggleDarkMode);
  if (navSearch) navSearch.addEventListener("input", handleSearchInput);

  // Close menus with Escape and when clicking outside
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileMenu();
      closeProfileMenu();
    }
  });

  document.addEventListener("click", (e) => {
    const profileMenu = document.getElementById("profileMenu");
    const profileBtnEl = document.getElementById("profileBtn");
    if (
      profileMenu &&
      profileBtnEl &&
      !profileMenu.contains(e.target) &&
      !profileBtnEl.contains(e.target)
    ) {
      closeProfileMenu();
    }
  });

  // initialize dark icon state from localStorage
  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) {
    document.body.classList.add("dark");
    const icon = document.getElementById("darkIcon");
    if (icon) icon.textContent = "☀️";
    if (darkToggle) darkToggle.setAttribute("aria-pressed", "true");
  }
  // update profile button UI from stored profile
  updateProfileUI();
}

function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  const btn = document.getElementById("mobileMenuBtn");
  if (!mobileMenu || !btn) return;
  const isHidden = mobileMenu.classList.contains("hidden");
  if (isHidden) {
    mobileMenu.classList.remove("hidden");
    mobileMenu.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
  } else {
    closeMobileMenu();
  }
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  const btn = document.getElementById("mobileMenuBtn");
  if (!mobileMenu || !btn) return;
  mobileMenu.classList.add("hidden");
  mobileMenu.setAttribute("aria-hidden", "true");
  btn.setAttribute("aria-expanded", "false");
}

function toggleProfileMenu() {
  const menu = document.getElementById("profileMenu");
  const btn = document.getElementById("profileBtn");
  if (!menu || !btn) return;
  const isHidden = menu.classList.contains("hidden");
  if (isHidden) {
    menu.classList.remove("hidden");
    btn.setAttribute("aria-expanded", "true");
  } else {
    closeProfileMenu();
  }
}

function closeProfileMenu() {
  const menu = document.getElementById("profileMenu");
  const btn = document.getElementById("profileBtn");
  if (!menu || !btn) return;
  menu.classList.add("hidden");
  btn.setAttribute("aria-expanded", "false");
}

function toggleDarkMode() {
  const darkToggle = document.getElementById("darkModeToggle");
  const icon = document.getElementById("darkIcon");
  const isDark = document.body.classList.toggle("dark");
  if (icon) icon.textContent = isDark ? "☀️" : "🌙";
  if (darkToggle)
    darkToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
  try {
    localStorage.setItem("darkMode", isDark ? "true" : "false");
  } catch (e) {}
}

function handleSearchInput(e) {
  const q = (e.target.value || "").trim().toLowerCase();
  // Simple UX: when user types 3+ characters, show matching tests from textContent keys in console
  if (q.length >= 3) {
    const matches = Object.keys(textContent).filter(
      (k) =>
        k.includes(q) ||
        JSON.stringify(textContent[k]).toLowerCase().includes(q)
    );
    // For now, log suggestions and show a subtle highlight on the search box
    console.log("Search suggestions:", matches);
  }
}

// Profile modal and persistence (name + phone only)
function updateProfileUI() {
  try {
    const profileBtn = document.getElementById("profileBtn");
    const profile = JSON.parse(localStorage.getItem("profile") || "null");
    let initials = "U";
    if (profile && profile.name) {
      const parts = profile.name.trim().split(/\s+/).filter(Boolean);
      initials =
        parts.length === 1
          ? parts[0][0]
          : (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
      initials = initials.toUpperCase();
    }
    if (profileBtn) {
      const span = profileBtn.querySelector("span");
      if (span) span.textContent = initials;
    }
  } catch (e) {
    console.error("Failed to update profile UI:", e);
  }
}

function showProfileModal() {
  const modal = document.getElementById("profileModal");
  if (!modal) return;
  const profile = JSON.parse(localStorage.getItem("profile") || "null");
  const nameInp = document.getElementById("profileName");
  const phoneInp = document.getElementById("profilePhone");
  const err = document.getElementById("profileError");
  if (err) {
    err.style.display = "none";
    err.textContent = "";
  }
  if (nameInp) nameInp.value = profile && profile.name ? profile.name : "";
  if (phoneInp) phoneInp.value = profile && profile.phone ? profile.phone : "";
  modal.style.display = "flex";
  closeProfileMenu();
  // focus the name input so the user can start typing without the auto-start
  // (we also block auto-start when focus is in inputs in setupAutoStart)
  if (nameInp) {
    setTimeout(() => {
      try {
        nameInp.focus();
        nameInp.select();
      } catch (e) {}
    }, 50);
  }
}

function closeProfileModal() {
  const modal = document.getElementById("profileModal");
  if (!modal) return;
  modal.style.display = "none";
}

function saveProfile() {
  const nameInp = document.getElementById("profileName");
  const phoneInp = document.getElementById("profilePhone");
  const err = document.getElementById("profileError");
  const name = nameInp ? nameInp.value.trim() : "";
  const phone = phoneInp ? phoneInp.value.trim() : "";

  if (!name || name.length < 2) {
    if (err) {
      err.style.display = "block";
      err.textContent = "Please enter your full name.";
    }
    return;
  }

  // basic phone validation: digits, spaces, +, -, parentheses allowed, length 7-20
  const phoneClean = phone.replace(/[\s\-()]/g, "");
  if (!/^\+?[0-9]{7,20}$/.test(phoneClean)) {
    if (err) {
      err.style.display = "block";
      err.textContent =
        "Please enter a valid phone number (digits, optional +).";
    }
    return;
  }

  const profile = { name, phone };
  try {
    localStorage.setItem("profile", JSON.stringify(profile));
    updateProfileUI();
    closeProfileModal();
  } catch (e) {
    if (err) {
      err.style.display = "block";
      err.textContent = "Failed to save profile.";
    }
    console.error("Failed to save profile:", e);
  }
}

function signOut() {
  try {
    localStorage.removeItem("profile");
    updateProfileUI();
    closeProfileMenu();
    // optional: show a small confirmation
    alert("Signed out Successfully.");
  } catch (e) {
    console.error("Failed to sign out:", e);
  }
}

// Auto-start functionality
function setupAutoStart() {
  document.addEventListener("keypress", (e) => {
    // Don't auto-start the test when the user is typing into form fields
    // or when focus is inside a modal. This prevents the profile modal
    // inputs from triggering a test when the user fills their name/phone.
    const target = e.target || document.activeElement;
    const tag = target && target.tagName ? target.tagName.toLowerCase() : "";
    const insideModal = !!(
      target &&
      target.closest &&
      (target.closest(".modal-content") || target.closest(".modal-overlay"))
    );
    const isFormField = !!(
      target &&
      (target.isContentEditable ||
        tag === "input" ||
        tag === "textarea" ||
        tag === "select")
    );
    if (isFormField || insideModal) return;

    if (
      !isTyping &&
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.metaKey
    ) {
      startTest();
      handleKeyPress(e);
    }
  });
}

// Mode Selection
function selectMode(mode, dur = 60) {
  currentMode = mode;
  duration = dur;
  timeLeft = dur;

  document
    .querySelectorAll(".mode-btn")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.closest(".mode-btn").classList.add("active");

  document.getElementById("durationSelection").style.display =
    mode === "classic" ? "flex" : "none";
  document.getElementById("timer").textContent = mode === "zen" ? "∞" : dur;

  generateText();
  resetTest();
}

function setDuration(dur) {
  duration = dur;
  timeLeft = dur;
  document.getElementById("timer").textContent = dur;

  document.querySelectorAll("#durationSelection button").forEach((btn) => {
    btn.classList.remove("border-blue-400");
    btn.classList.add("border-slate-200");
  });
  event.target.classList.add("border-blue-400");
  event.target.classList.remove("border-slate-200");
}

// Text Generation
function generateText() {
  const texts = textContent[currentMode];
  if (texts && texts.length > 0) {
    let newText;
    do {
      newText = texts[Math.floor(Math.random() * texts.length)];
    } while (newText === currentText && texts.length > 1);
    currentText = newText;
  } else {
    currentText = textContent.classic[0];
  }

  const display = document.getElementById("textDisplay");
  display.innerHTML = currentText
    .split("")
    .map(
      (char, i) =>
        `<span class="char" data-index="${i}">${
          char === "\n" ? "<br>" : char
        }</span>`
    )
    .join("");
}

// Test Control
function startTest() {
  if (isTyping) return;

  isTyping = true;
  startTime = performance.now();
  currentIndex = 0;
  errors = 0;
  correctChars = 0;
  totalChars = 0;
  streak = 0;
  maxStreak = 0;
  wpmHistory = [];

  document.getElementById("startBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "inline-block";

  if (currentMode !== "zen") {
    timerInterval = setInterval(updateTimer, 100);
  }

  const showGraph = document.getElementById("liveGraphSetting").checked;
  if (showGraph) {
    document.getElementById("liveGraphContainer").style.display = "block";
    graphUpdateInterval = setInterval(updateGraph, 500);
  }

  document.addEventListener("keydown", handleKeyPress);
  updateCurrentChar();
}

function restartTest() {
  resetTest();
  generateText();
  closeResults();
  document.getElementById("startBtn").style.display = "inline-block";
  document.getElementById("restartBtn").style.display = "none";
}

function resetTest() {
  isTyping = false;
  clearInterval(timerInterval);
  clearInterval(graphUpdateInterval);
  document.removeEventListener("keydown", handleKeyPress);

  currentIndex = 0;
  errors = 0;
  correctChars = 0;
  totalChars = 0;
  streak = 0;
  timeLeft = duration;
  wpmHistory = [];

  updateStats();
  document.getElementById("liveGraphContainer").style.display = "none";
}

function updateTimer() {
  timeLeft -= 0.1;
  if (timeLeft <= 0) {
    timeLeft = 0;
    endTest();
  }
  document.getElementById("timer").textContent = Math.ceil(timeLeft);
}

function endTest() {
  isTyping = false;
  clearInterval(timerInterval);
  clearInterval(graphUpdateInterval);
  document.removeEventListener("keydown", handleKeyPress);

  const endTime = performance.now();
  const timeElapsed = (endTime - startTime) / 1000 / 60; // minutes

  const grossWPM = totalChars / 5 / timeElapsed;
  const netWPM = Math.max(0, grossWPM - errors / timeElapsed);
  const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;

  const result = {
    wpm: Math.round(netWPM),
    accuracy: Math.round(accuracy * 10) / 10,
    errors: errors,
    correct: correctChars,
    total: totalChars,
    mode: currentMode,
    duration: duration,
    date: new Date().toISOString(),
    timestamp: Date.now(),
  };

  saveResult(result);
  checkAchievements(result);
  showResults(result);
}

// Typing Logic
function handleKeyPress(e) {
  if (!isTyping) return;

  // Prevent default for most keys
  if (e.key.length === 1 || e.key === "Backspace") {
    e.preventDefault();
  }

  if (e.key === "Backspace") {
    if (currentIndex > 0) {
      currentIndex--;
      const char = document.querySelector(`[data-index="${currentIndex}"]`);
      char.classList.remove("correct", "incorrect");
      updateCurrentChar();
      updateStats();
    }
    return;
  }

  if (e.key.length !== 1) return;
  if (currentIndex >= currentText.length) {
    if (currentMode === "zen") {
      generateText();
      currentIndex = 0;
      updateCurrentChar();
    } else {
      endTest();
    }
    return;
  }

  const expectedChar = currentText[currentIndex];
  const char = document.querySelector(`[data-index="${currentIndex}"]`);

  totalChars++;

  if (e.key === expectedChar) {
    char.classList.add("correct");
    correctChars++;
    streak++;
    maxStreak = Math.max(maxStreak, streak);
  } else {
    char.classList.add("incorrect");
    errors++;
    streak = 0;
  }

  currentIndex++;
  updateCurrentChar();
  updateStats();

  if (currentIndex >= currentText.length && currentMode !== "zen") {
    endTest();
  }
}

function updateCurrentChar() {
  document
    .querySelectorAll(".char")
    .forEach((char) => char.classList.remove("current"));
  if (currentIndex < currentText.length) {
    const char = document.querySelector(`[data-index="${currentIndex}"]`);
    if (char) char.classList.add("current");
  }
}

// Stats Update
function updateStats() {
  if (!isTyping || !startTime) {
    document.getElementById("wpmDisplay").textContent = "0";
    document.getElementById("accuracyDisplay").textContent = "100%";
    document.getElementById("errorsDisplay").textContent = "0";
    document.getElementById("streakDisplay").textContent = "0";
    return;
  }

  const now = performance.now();
  const timeElapsed = (now - startTime) / 1000 / 60; // minutes

  if (timeElapsed > 0) {
    const grossWPM = totalChars / 5 / timeElapsed;
    const netWPM = Math.max(0, grossWPM - errors / timeElapsed);
    document.getElementById("wpmDisplay").textContent = Math.round(netWPM);
  }

  const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 100;
  document.getElementById("accuracyDisplay").textContent =
    Math.round(accuracy) + "%";
  document.getElementById("errorsDisplay").textContent = errors;
  document.getElementById("streakDisplay").textContent = streak;
}

// Live Graph
function updateGraph() {
  if (!isTyping || !startTime) return;

  const now = performance.now();
  const timeElapsed = (now - startTime) / 1000 / 60;

  if (timeElapsed > 0) {
    const grossWPM = totalChars / 5 / timeElapsed;
    const netWPM = Math.max(0, grossWPM - errors / timeElapsed);
    wpmHistory.push(Math.round(netWPM));

    if (wpmHistory.length > 50) wpmHistory.shift();

    drawGraph();
  }
}

function drawGraph() {
  const graphLine = document.getElementById("graphLine");
  const graphArea = document.getElementById("graphArea");

  if (wpmHistory.length < 2) return;

  const width = 800;
  const height = 200;
  const max = Math.max(...wpmHistory, 10);
  const step = width / (wpmHistory.length - 1);

  let linePath = "M ";
  let areaPath = "M ";

  wpmHistory.forEach((wpm, i) => {
    const x = i * step;
    const y = height - (wpm / max) * height;
    linePath += `${x} ${y} `;
    areaPath += `${x} ${y} `;
  });

  areaPath += `${width} ${height} L 0 ${height} Z`;

  graphLine.setAttribute("d", linePath);
  graphArea.setAttribute("d", areaPath);
}

// Results
function showResults(result) {
  document.getElementById("resultWPM").textContent = result.wpm;
  document.getElementById("resultAccuracy").textContent = result.accuracy + "%";
  document.getElementById("resultErrors").textContent = result.errors;
  document.getElementById("resultCorrect").textContent = result.correct;
  document.getElementById("resultChars").textContent = result.total;

  const history = getHistory();
  const bestWPM = Math.max(...history.map((r) => r.wpm), 0);

  if (result.wpm >= bestWPM && history.length > 1) {
    document.getElementById("newRecord").style.display = "inline-block";
  } else {
    document.getElementById("newRecord").style.display = "none";
  }

  const newAchievements = getNewlyUnlockedAchievements();
  if (newAchievements.length > 0) {
    document.getElementById("achievementsUnlocked").style.display = "block";
    const list = document.getElementById("achievementsList");
    list.innerHTML = newAchievements
      .map(
        (a) =>
          `<div class="achievement-badge px-3 py-2 bg-amber-100 text-amber-800 rounded-lg font-semibold">
                        ${a.icon} ${a.name}
                    </div>`
      )
      .join("");
  } else {
    document.getElementById("achievementsUnlocked").style.display = "none";
  }

  document.getElementById("resultsModal").style.display = "flex";
}

function closeResults() {
  document.getElementById("resultsModal").style.display = "none";
}

function shareResults() {
  const wpm = document.getElementById("resultWPM").textContent;
  const accuracy = document.getElementById("resultAccuracy").textContent;
  const text = `I just typed ${wpm} WPM with ${accuracy} accuracy on TypeMaster ! 🚀`;

  if (navigator.share) {
    navigator.share({ text });
  } else {
    navigator.clipboard.writeText(text);
    alert("Results copied to clipboard!");
  }
}

// Storage
function saveResult(result) {
  try {
    const history = getHistory();
    history.push(result);
    localStorage.setItem("typingHistory", JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save result:", e);
  }
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem("typingHistory") || "[]");
  } catch {
    return [];
  }
}

function clearHistory() {
  if (confirm("Are you sure you want to clear all history?")) {
    localStorage.removeItem("typingHistory");
    closeHistory();
  }
}

// History Modal
function showHistory() {
  const history = getHistory();

  document.getElementById("totalTests").textContent = history.length;

  const wpmValues = history.map((r) => r.wpm);
  document.getElementById("bestWPM").textContent = Math.max(...wpmValues, 0);
  document.getElementById("avgWPM").textContent =
    wpmValues.length > 0
      ? Math.round(wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length)
      : 0;

  const accValues = history.map((r) => r.accuracy);
  document.getElementById("avgAccuracy").textContent =
    accValues.length > 0
      ? Math.round(accValues.reduce((a, b) => a + b, 0) / accValues.length) +
        "%"
      : "0%";

  const tbody = document.getElementById("historyTableBody");
  tbody.innerHTML = history
    .slice(-20)
    .reverse()
    .map(
      (r) => `
                <tr class="border-b border-slate-100 hover:bg-slate-50">
                    <td class="py-3 px-4">${new Date(
                      r.date
                    ).toLocaleDateString()}</td>
                    <td class="py-3 px-4 capitalize">${r.mode}</td>
                    <td class="py-3 px-4 font-semibold">${r.wpm}</td>
                    <td class="py-3 px-4">${r.accuracy}%</td>
                    <td class="py-3 px-4">${r.duration}s</td>
                </tr>
            `
    )
    .join("");

  drawProgressChart(history);

  document.getElementById("historyModal").style.display = "flex";
}

function closeHistory() {
  document.getElementById("historyModal").style.display = "none";
}

function drawProgressChart(history) {
  const canvas = document.getElementById("progressChart");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (history.length < 2) return;

  const data = history.slice(-20).map((r) => r.wpm);
  const max = Math.max(...data, 10);
  const width = canvas.width;
  const height = canvas.height;
  const padding = 20;
  const step = (width - padding * 2) / (data.length - 1);

  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 3;
  ctx.beginPath();

  data.forEach((wpm, i) => {
    const x = padding + i * step;
    const y = height - padding - (wpm / max) * (height - padding * 2);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();

  // Draw points
  ctx.fillStyle = "#3b82f6";
  data.forEach((wpm, i) => {
    const x = padding + i * step;
    const y = height - padding - (wpm / max) * (height - padding * 2);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Achievements
function loadAchievements() {
  try {
    const saved = JSON.parse(localStorage.getItem("achievements") || "[]");
    achievements.forEach((a) => {
      const savedAch = saved.find((s) => s.id === a.id);
      if (savedAch) a.unlocked = savedAch.unlocked;
    });
  } catch (e) {
    console.error("Failed to load achievements:", e);
  }
}

function saveAchievements() {
  try {
    localStorage.setItem("achievements", JSON.stringify(achievements));
  } catch (e) {
    console.error("Failed to save achievements:", e);
  }
}

function checkAchievements(result) {
  const history = getHistory();
  const newlyUnlocked = [];

  // First test
  if (!achievements[0].unlocked && history.length >= 1) {
    achievements[0].unlocked = true;
    newlyUnlocked.push(achievements[0]);
  }

  // Speed achievements
  if (!achievements[1].unlocked && result.wpm >= 60) {
    achievements[1].unlocked = true;
    newlyUnlocked.push(achievements[1]);
  }
  if (!achievements[2].unlocked && result.wpm >= 80) {
    achievements[2].unlocked = true;
    newlyUnlocked.push(achievements[2]);
  }
  if (!achievements[3].unlocked && result.wpm >= 100) {
    achievements[3].unlocked = true;
    newlyUnlocked.push(achievements[3]);
  }

  // Perfectionist
  if (!achievements[4].unlocked && result.accuracy === 100) {
    achievements[4].unlocked = true;
    newlyUnlocked.push(achievements[4]);
  }

  // Consistency achievements
  if (!achievements[5].unlocked && history.length >= 10) {
    achievements[5].unlocked = true;
    newlyUnlocked.push(achievements[5]);
  }
  if (!achievements[6].unlocked && history.length >= 50) {
    achievements[6].unlocked = true;
    newlyUnlocked.push(achievements[6]);
  }
  if (!achievements[7].unlocked && history.length >= 100) {
    achievements[7].unlocked = true;
    newlyUnlocked.push(achievements[7]);
  }

  // Streak achievements
  if (!achievements[8].unlocked && maxStreak >= 10) {
    achievements[8].unlocked = true;
    newlyUnlocked.push(achievements[8]);
  }
  if (!achievements[9].unlocked && maxStreak >= 50) {
    achievements[9].unlocked = true;
    newlyUnlocked.push(achievements[9]);
  }

  saveAchievements();
  return newlyUnlocked;
}

function getNewlyUnlockedAchievements() {
  const saved = JSON.parse(
    localStorage.getItem("lastShownAchievements") || "[]"
  );
  const current = achievements.filter((a) => a.unlocked).map((a) => a.id);
  const newOnes = current.filter((id) => !saved.includes(id));

  localStorage.setItem("lastShownAchievements", JSON.stringify(current));

  return achievements.filter((a) => newOnes.includes(a.id));
}

function showAchievements() {
  const grid = document.getElementById("achievementsGrid");
  grid.innerHTML = achievements
    .map(
      (a) => `
                <div class="p-4 rounded-xl border-2 ${
                  a.unlocked
                    ? "bg-amber-50 border-amber-200"
                    : "bg-slate-50 border-slate-200 opacity-50"
                }">
                    <div class="text-4xl mb-2">${a.icon}</div>
                    <h3 class="font-semibold mb-1">${a.name}</h3>
                    <p class="text-sm text-slate-600">${a.description}</p>
                    ${
                      a.unlocked
                        ? '<div class="mt-2 text-xs text-amber-600 font-semibold">✓ Unlocked</div>'
                        : ""
                    }
                </div>
            `
    )
    .join("");

  document.getElementById("achievementsModal").style.display = "flex";
}

function closeAchievements() {
  document.getElementById("achievementsModal").style.display = "none";
}

// Leaderboard
function showLeaderboard() {
  const history = getHistory();
  const leaderboard = history.sort((a, b) => b.wpm - a.wpm).slice(0, 10);

  const list = document.getElementById("leaderboardList");
  list.innerHTML = leaderboard
    .map(
      (r, i) => `
                <div class="leaderboard-entry flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white">
                    <div class="text-2xl font-bold ${
                      i < 3 ? "text-amber-500" : "text-slate-400"
                    }" style="min-width: 40px;">
                        ${
                          i === 0
                            ? "🥇"
                            : i === 1
                            ? "🥈"
                            : i === 2
                            ? "🥉"
                            : "#" + (i + 1)
                        }
                    </div>
                    <div class="flex-1">
                        <div class="font-semibold">${r.wpm} WPM</div>
                        <div class="text-sm text-slate-500">${
                          r.accuracy
                        }% accuracy • ${new Date(
        r.date
      ).toLocaleDateString()}</div>
                    </div>
                    <div class="px-3 py-1 bg-slate-100 rounded-full text-sm font-semibold capitalize">
                        ${r.mode}
                    </div>
                </div>
            `
    )
    .join("");

  document.getElementById("leaderboardModal").style.display = "flex";
}

function closeLeaderboard() {
  document.getElementById("leaderboardModal").style.display = "none";
}

// Settings
function showSettings() {
  document.getElementById("settingsModal").style.display = "flex";
}

function closeSettings() {
  document.getElementById("settingsModal").style.display = "none";
}

function loadSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem("settings") || "{}");

    if (settings.fontSize) {
      document.getElementById("fontSizeSetting").value = settings.fontSize;
      document.querySelector(".typing-text").style.fontSize =
        settings.fontSize + "px";
    }

    if (settings.soundEnabled !== undefined) {
      document.getElementById("soundSetting").checked = settings.soundEnabled;
    }

    if (settings.liveGraph !== undefined) {
      document.getElementById("liveGraphSetting").checked = settings.liveGraph;
    }

    if (settings.caretStyle) {
      document.getElementById("caretStyle").value = settings.caretStyle;
    }
  } catch (e) {
    console.error("Failed to load settings:", e);
  }
}

function updateSettings() {
  try {
    const settings = {
      fontSize: document.getElementById("fontSizeSetting").value,
      soundEnabled: document.getElementById("soundSetting").checked,
      liveGraph: document.getElementById("liveGraphSetting").checked,
      caretStyle: document.getElementById("caretStyle").value,
    };

    localStorage.setItem("settings", JSON.stringify(settings));

    document.querySelector(".typing-text").style.fontSize =
      settings.fontSize + "px";
  } catch (e) {
    console.error("Failed to save settings:", e);
  }
}
