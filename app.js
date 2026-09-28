"use strict";

/* ========================================
   DOM ELEMENTS
======================================== */

const catImg = document.getElementById("cat-img");
const statusText = document.getElementById("status-text");
const particlesContainer = document.getElementById("particles-container");
const actionBubble = document.getElementById("action-bubble");

const hungerBar = document.getElementById("hunger-bar");
const thirstBar = document.getElementById("thirst-bar");
const happinessBar = document.getElementById("happiness-bar");
const energyBar = document.getElementById("energy-bar");

const hungerValue = document.getElementById("hunger-value");
const thirstValue = document.getElementById("thirst-value");
const happinessValue = document.getElementById("happiness-value");
const energyValue = document.getElementById("energy-value");

const resetBtn = document.getElementById("reset-btn");
const actionButtons = document.querySelectorAll(".action-btn");


/* ========================================
   DEFAULT STATE
======================================== */

const DEFAULT_STATE = {
  hunger: 80,
  thirst: 80,
  happiness: 80,
  energy: 80
};


/* ========================================
   GAME STATE
======================================== */

let state = loadState();
let resetTimeout = null;


/* ========================================
   SOUNDS
======================================== */

const sounds = {
  angry: new Audio("sounds/angry.mp3"),
  hungry: new Audio("sounds/hungry.mp3"),
  meow: new Audio("sounds/meow.mp3")
};

Object.values(sounds).forEach((sound) => {
  sound.preload = "auto";
});


function playSound(type) {
  const sound = sounds[type];

  if (!sound) {
    console.warn(`Sound "${type}" was not found.`);
    return;
  }

  sound.currentTime = 0;

  const playPromise = sound.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Browser blocked audio.
      // Audio will work after user interaction.
    });
  }
}


/* ========================================
   LOCAL STORAGE
======================================== */

function loadState() {
  try {
    const saved = localStorage.getItem("leylaGameState");

    if (!saved) {
      return { ...DEFAULT_STATE };
    }

    const parsed = JSON.parse(saved);

    return {
      ...DEFAULT_STATE,
      ...parsed
    };
  } catch (error) {
    console.warn("Could not load Leyla's state.", error);
    return { ...DEFAULT_STATE };
  }
}


function saveState() {
  try {
    localStorage.setItem(
      "leylaGameState",
      JSON.stringify(state)
    );
  } catch (error) {
    console.warn("Could not save Leyla's state.", error);
  }
}


/* ========================================
   STATS
======================================== */

function changeStat(stat, amount) {
  if (!(stat in state)) {
    return;
  }

  state[stat] = Math.max(
    0,
    Math.min(100, state[stat] + amount)
  );
}


function updateStats() {
  hungerBar.style.width = `${state.hunger}%`;
  thirstBar.style.width = `${state.thirst}%`;
  happinessBar.style.width = `${state.happiness}%`;
  energyBar.style.width = `${state.energy}%`;

  hungerValue.textContent = Math.round(state.hunger);
  thirstValue.textContent = Math.round(state.thirst);
  happinessValue.textContent = Math.round(state.happiness);
  energyValue.textContent = Math.round(state.energy);
}


/* ========================================
   CAT STATE
======================================== */

function setCatState({
  image,
  text,
  sound,
  particle,
  animation,
  bubble
}) {
  clearTimeout(resetTimeout);

  catImg.src = `images/${image}.png`;
  statusText.textContent = text;

  catImg.classList.remove(
    "jiggle",
    "bounce",
    "shake"
  );

  void catImg.offsetWidth;

  catImg.classList.add(animation);

  showBubble(bubble);

  playSound(sound);

  if (particle) {
    spawnParticles(particle);
  }

  resetTimeout = setTimeout(() => {
    catImg.src = "images/leyla_normal.png";
    statusText.textContent = "Leyla is looking at you...";
  }, 3500);
}


/* ========================================
   BUBBLE
======================================== */

function showBubble(emoji) {
  actionBubble.textContent = emoji;

  actionBubble.classList.remove("show");

  void actionBubble.offsetWidth;

  actionBubble.classList.add("show");
}


/* ========================================
   PARTICLES
======================================== */

function spawnParticles(emoji) {
  for (let i = 0; i < 5; i++) {
    const particle = document.createElement("div");

    particle.className = "floating-particle";
    particle.textContent = emoji;

    particle.style.left = `${35 + Math.random() * 30}%`;
    particle.style.top = `${45 + Math.random() * 15}%`;
    particle.style.animationDelay = `${Math.random() * 0.15}s`;

    particlesContainer.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1300);
  }
}


/* ========================================
   GAME ACTIONS
======================================== */

function performAction(action) {
  switch (action) {
    case "feed":
      changeStat("hunger", 22);
      changeStat("happiness", 5);

      setCatState({
        image: "leyla_hungry",
        text: "Yum! Leyla is enjoying her food! 🍗",
        sound: "hungry",
        particle: "🐟",
        animation: "jiggle",
        bubble: "😋"
      });
      break;

    case "water":
      changeStat("thirst", 25);
      changeStat("happiness", 3);

      setCatState({
        image: "leyla_happy",
        text: "Ahhh... refreshing! 💧",
        sound: "meow",
        particle: "💧",
        animation: "bounce",
        bubble: "💦"
      });
      break;

    case "play":
      changeStat("happiness", 18);
      changeStat("energy", -12);

      setCatState({
        image: "leyla_happy",
        text: "PLAY TIME! 🧶",
        sound: "meow",
        particle: "🧶",
        animation: "bounce",
        bubble: "🎉"
      });
      break;

    case "pet":
      changeStat("happiness", 12);
      changeStat("energy", 3);

      setCatState({
        image: "leyla_happy",
        text: "Leyla is purring... ❤️",
        sound: "meow",
        particle: "❤️",
        animation: "jiggle",
        bubble: "❤️"
      });
      break;

    case "treat":
      changeStat("hunger", 8);
      changeStat("happiness", 10);

      setCatState({
        image: "leyla_happy",
        text: "A delicious treat! ✨",
        sound: "hungry",
        particle: "✨",
        animation: "bounce",
        bubble: "😻"
      });
      break;

    case "sleep":
      changeStat("energy", 30);
      changeStat("happiness", 4);

      setCatState({
        image: "leyla_normal",
        text: "Shhh... Leyla is taking a nap... 😴",
        sound: "meow",
        particle: "💤",
        animation: "bounce",
        bubble: "💤"
      });
      break;

    case "scare":
      changeStat("happiness", -18);
      changeStat("energy", -5);

      setCatState({
        image: "leyla_shock",
        text: "OMG! WHAT WAS THAT?! 🥒",
        sound: "meow",
        particle: "❗",
        animation: "shake",
        bubble: "😱"
      });
      break;

    case "poke":
      changeStat("happiness", -12);

      setCatState({
        image: "leyla_angry",
        text: "Leave me alone! 😾",
        sound: "angry",
        particle: "💢",
        animation: "shake",
        bubble: "😾"
      });
      break;

    default:
      console.warn(`Unknown action: ${action}`);
      return;
  }

  updateStats();
  saveState();
}


/* ========================================
   BUTTON EVENTS
======================================== */

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    performAction(action);
  });
});


/* ========================================
   CLICK LEYLA = PET
======================================== */

catImg.addEventListener("click", () => {
  performAction("pet");
});


/* ========================================
   RESET
======================================== */

resetBtn.addEventListener("click", () => {
  const confirmed = window.confirm(
    "Reset Leyla's stats?"
  );

  if (!confirmed) {
    return;
  }

  state = { ...DEFAULT_STATE };

  saveState();
  updateStats();

  setCatState({
    image: "leyla_normal",
    text: "Leyla is ready for a new day! 🐾",
    sound: "meow",
    particle: "✨",
    animation: "bounce",
    bubble: "🐾"
  });
});


/* ========================================
   PASSIVE NEEDS
======================================== */

setInterval(() => {
  changeStat("hunger", -1);
  changeStat("thirst", -1);

  if (state.energy < 100) {
    changeStat("energy", -0.5);
  }

  if (
    state.hunger < 25 ||
    state.thirst < 25
  ) {
    changeStat("happiness", -1);
  }

  updateStats();
  saveState();
}, 60000);


/* ========================================
   INITIALIZE
======================================== */

updateStats();