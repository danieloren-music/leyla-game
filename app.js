"use strict";


/* ========================================
   DEFAULT STATE
======================================== */

const DEFAULT_STATE = {
  hunger: 80,
  thirst: 80,
  happiness: 80,
  energy: 80,
  coins: 100
};

let state = loadState();

let resetTimeout = null;


/* ========================================
   DOM
======================================== */

const catImg =
  document.getElementById("cat-img");

const catWrapper =
  document.getElementById("cat-wrapper");

const statusText =
  document.getElementById("status-text");

const moodIcon =
  document.getElementById("mood-icon");

const moodText =
  document.getElementById("mood-text");

const actionBubble =
  document.getElementById("action-bubble");

const particlesContainer =
  document.getElementById(
    "particles-container"
  );


const coinsValue =
  document.getElementById(
    "coins-value"
  );


const hungerBar =
  document.getElementById(
    "hunger-bar"
  );

const thirstBar =
  document.getElementById(
    "thirst-bar"
  );

const happinessBar =
  document.getElementById(
    "happiness-bar"
  );

const energyBar =
  document.getElementById(
    "energy-bar"
  );


const hungerValue =
  document.getElementById(
    "hunger-value"
  );

const thirstValue =
  document.getElementById(
    "thirst-value"
  );

const happinessValue =
  document.getElementById(
    "happiness-value"
  );

const energyValue =
  document.getElementById(
    "energy-value"
  );


const screens =
  document.querySelectorAll(
    ".screen"
  );

const navButtons =
  document.querySelectorAll(
    ".nav-btn"
  );

const actionButtons =
  document.querySelectorAll(
    ".action-btn"
  );


const gameButtons =
  document.querySelectorAll(
    ".game-card"
  );


const gameArea =
  document.getElementById(
    "game-area"
  );

const gameTitle =
  document.getElementById(
    "game-title"
  );

const gameScore =
  document.getElementById(
    "game-score"
  );

const backGameButton =
  document.getElementById(
    "back-game-btn"
  );


/* ========================================
   SOUNDS
======================================== */

const sounds = {

  angry:
    new Audio(
      "sounds/angry.mp3"
    ),

  hungry:
    new Audio(
      "sounds/hungry.mp3"
    ),

  meow:
    new Audio(
      "sounds/meow.mp3"
    )

};


Object.values(
  sounds
).forEach(
  (sound) => {

    sound.preload = "auto";

  }
);


function playSound(
  type
) {

  /*
   * Important:
   * pet does NOT call this function.
   */

  const sound =
    sounds[type];

  if (!sound) {
    return;
  }

  sound.currentTime = 0;

  const promise =
    sound.play();

  if (promise) {

    promise.catch(
      () => {}
    );

  }

}


/* ========================================
   STORAGE
======================================== */

function loadState() {

  try {

    const saved =
      localStorage.getItem(
        "leylaGameState"
      );

    if (!saved) {

      return {
        ...DEFAULT_STATE
      };

    }

    return {
      ...DEFAULT_STATE,
      ...JSON.parse(saved)
    };

  } catch {

    return {
      ...DEFAULT_STATE
    };

  }

}


function saveState() {

  try {

    localStorage.setItem(
      "leylaGameState",
      JSON.stringify(state)
    );

  } catch {

    // Storage unavailable.

  }

}


/* ========================================
   STATS
======================================== */

function changeStat(
  stat,
  amount
) {

  if (
    !(stat in state)
  ) {
    return;
  }

  state[stat] =
    Math.max(
      0,
      Math.min(
        100,
        state[stat] + amount
      )
    );

}


function addCoins(
  amount
) {

  state.coins =
    Math.max(
      0,
      state.coins + amount
    );

  updateStats();

  saveState();

}


/* ========================================
   MOOD
======================================== */

function getMood() {

  const average =
    (
      state.hunger +
      state.thirst +
      state.happiness +
      state.energy
    ) / 4;


  if (
    state.happiness <= 20
  ) {

    return {
      icon: "😿",
      text: "Sad",
      image: "leyla_sad"
    };

  }


  if (
    state.hunger <= 20
  ) {

    return {
      icon: "😾",
      text: "Hungry",
      image: "leyla_hungry"
    };

  }


  if (
    average >= 75
  ) {

    return {
      icon: "😻",
      text: "Very Happy",
      image: "leyla_happy"
    };

  }


  if (
    average >= 50
  ) {

    return {
      icon: "😺",
      text: "Happy",
      image: "leyla_normal"
    };

  }


  return {
    icon: "😐",
    text: "Okay",
    image: "leyla_normal"
  };

}


/* ========================================
   UI UPDATE
======================================== */

function updateStats() {

  hungerBar.style.width =
    `${state.hunger}%`;

  thirstBar.style.width =
    `${state.thirst}%`;

  happinessBar.style.width =
    `${state.happiness}%`;

  energyBar.style.width =
    `${state.energy}%`;


  hungerValue.textContent =
    Math.round(
      state.hunger
    );

  thirstValue.textContent =
    Math.round(
      state.thirst
    );

  happinessValue.textContent =
    Math.round(
      state.happiness
    );

  energyValue.textContent =
    Math.round(
      state.energy
    );


  coinsValue.textContent =
    Math.floor(
      state.coins
    );


  const mood =
    getMood();

  moodIcon.textContent =
    mood.icon;

  moodText.textContent =
    mood.text;

}


/* ========================================
   CAT STATE
======================================== */

function setCatState(
  options
) {

  clearTimeout(
    resetTimeout
  );


  catImg.src =
    `images/${options.image}.png`;


  statusText.textContent =
    options.text;


  catWrapper.classList.remove(
    "bounce",
    "shake",
    "eat",
    "sleep"
  );


  void catWrapper.offsetWidth;


  if (
    options.animation
  ) {

    catWrapper.classList.add(
      options.animation
    );

  }


  /*
   * Sound only when an action
   * specifically requests it.
   */

  if (
    options.sound
  ) {

    playSound(
      options.sound
    );

  }


  if (
    options.particle
  ) {

    spawnParticles(
      options.particle
    );

  }


  showBubble(
    options.bubble || "🐾"
  );


  resetTimeout =
    setTimeout(
      () => {

        const mood =
          getMood();


        catImg.src =
          `images/${mood.image}.png`;


        statusText.textContent =
          "Leyla is looking at you...";


        catWrapper.classList.remove(
          "bounce",
          "shake",
          "eat",
          "sleep"
        );

      },
      3500
    );

}


/* ========================================
   BUBBLE
======================================== */

function showBubble(
  emoji
) {

  actionBubble.textContent =
    emoji;

  actionBubble.classList.remove(
    "show"
  );

  void actionBubble.offsetWidth;

  actionBubble.classList.add(
    "show"
  );

}


/* ========================================
   PARTICLES
======================================== */

function spawnParticles(
  emoji
) {

  for (
    let i = 0;
    i < 5;
    i++
  ) {

    const particle =
      document.createElement(
        "div"
      );


    particle.className =
      "floating-particle";


    particle.textContent =
      emoji;


    particle.style.left =
      `${35 + Math.random() * 30}%`;


    particle.style.top =
      `${35 + Math.random() * 25}%`;


    particlesContainer.appendChild(
      particle
    );


    setTimeout(
      () => {
        particle.remove();
      },
      1000
    );

  }

}


/* ========================================
   ACTIONS
======================================== */

function performAction(
  action
) {

  switch (action) {

    case "feed":

      changeStat(
        "hunger",
        22
      );

      changeStat(
        "happiness",
        5
      );


      setCatState({

        image:
          "leyla_hungry",

        text:
          "Yum! Leyla is eating! 🍗",

        sound:
          "hungry",

        particle:
          "🐟",

        animation:
          "eat",

        bubble:
          "😋"

      });

      break;


    case "water":

      changeStat(
        "thirst",
        25
      );

      changeStat(
        "happiness",
        3
      );


      setCatState({

        image:
          "leyla_happy",

        text:
          "Ahhh... refreshing! 💧",

        sound:
          "meow",

        particle:
          "💧",

        animation:
          "bounce",

        bubble:
          "💦"

      });

      break;


    case "pet":

      /*
       * NO SOUND.
       */

      changeStat(
        "happiness",
        12
      );


      setCatState({

        image:
          "leyla_happy",

        text:
          "Prrrr... Leyla loves that! ❤️",

        sound:
          null,

        particle:
          "❤️",

        animation:
          "bounce",

        bubble:
          "❤️"

      });

      break;


    case "treat":

      changeStat(
        "hunger",
        8
      );

      changeStat(
        "happiness",
        10
      );


      setCatState({

        image:
          "leyla_happy",

        text:
          "Treat?! For me?! 😻",

        sound:
          "hungry",

        particle:
          "✨",

        animation:
          "bounce",

        bubble:
          "😻"

      });

      break;


    case "play":

      changeStat(
        "happiness",
        18
      );

      changeStat(
        "energy",
        -12
      );


      setCatState({

        image:
          "leyla_happy",

        text:
          "PLAY TIME! 🧶",

        sound:
          "meow",

        particle:
          "🧶",

        animation:
          "bounce",

        bubble:
          "🎉"

      });

      break;


    case "sleep":

      changeStat(
        "energy",
        30
      );


      setCatState({

        image:
          "leyla_normal",

        text:
          "Shhh... Leyla is sleeping... 😴",

        sound:
          null,

        particle:
          "💤",

        animation:
          "sleep",

        bubble:
          "💤"

      });

      break;


    case "scare":

      changeStat(
        "happiness",
        -18
      );


      setCatState({

        image:
          "leyla_shock",

        text:
          "WHAT WAS THAT?! 😱",

        sound:
          "angry",

        particle:
          "❗",

        animation:
          "shake",

        bubble:
          "😱"

      });

      break;


    case "poke":

      changeStat(
        "happiness",
        -12
      );


      setCatState({

        image:
          "leyla_angry",

        text:
          "HEY! STOP POKING ME! 😾",

        sound:
          "angry",

        particle:
          "💢",

        animation:
          "shake",

        bubble:
          "😾"

      });

      break;

  }


  updateStats();

  saveState();

}


/* ========================================
   ACTION BUTTONS
======================================== */

actionButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        performAction(
          button.dataset.action
        );

      }
    );

  }
);


/* ========================================
   NAVIGATION
======================================== */

function showScreen(
  screenId
) {

  screens.forEach(
    (screen) => {

      screen.classList.remove(
        "active"
      );

    }
  );


  const target =
    document.getElementById(
      screenId
    );


  if (target) {

    target.classList.add(
      "active"
    );

  }


  navButtons.forEach(
    (button) => {

      button.classList.toggle(
        "active",
        button.dataset.screen ===
          screenId
      );

    }
  );

}


navButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        showScreen(
          button.dataset.screen
        );

      }
    );

  }
);


/* ========================================
   GAMES
======================================== */

gameButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        openGame(
          button.dataset.game
        );

      }
    );

  }
);


function openGame(
  game
) {

  showScreen(
    "game-screen"
  );


  gameArea.innerHTML = "";


  if (
    game === "yarn"
  ) {

    gameTitle.textContent =
      "🧶 Catch the Yarn";

    gameScore.textContent =
      "0";


    if (
      typeof startYarnGame ===
      "function"
    ) {

      startYarnGame({

        area:
          gameArea,

        scoreElement:
          gameScore,

        onComplete:
          finishMiniGame

      });

    }

  }


  if (
    game === "fish"
  ) {

    gameTitle.textContent =
      "🐟 Catch the Fish";

    gameScore.textContent =
      "0";


    if (
      typeof startFishGame ===
      "function"
    ) {

      startFishGame({

        area:
          gameArea,

        scoreElement:
          gameScore,

        onComplete:
          finishMiniGame

      });

    }

  }

}


/* ========================================
   EXIT GAME
======================================== */

backGameButton.addEventListener(
  "click",
  () => {

    if (
      typeof stopCurrentMiniGame ===
      "function"
    ) {

      stopCurrentMiniGame();

    }


    gameArea.innerHTML = "";

    showScreen(
      "games-screen"
    );

  }
);


/* ========================================
   GAME REWARD
======================================== */

function finishMiniGame(
  result
) {

  const score =
    Number(
      result.score
    ) || 0;


  const reward =
    Math.max(
      5,
      Math.min(
        50,
        score
      )
    );


  state.coins +=
    reward;


  changeStat(
    "happiness",
    5
  );


  changeStat(
    "energy",
    -5
  );


  updateStats();

  saveState();


  gameArea.innerHTML = `

    <div class="game-message">

      <h3>🎉 Great job!</h3>

      <p>
        Leyla earned ${reward} coins!
      </p>

      <button
        id="continue-game-btn"
      >
        Continue
      </button>

    </div>

  `;


  const continueButton =
    document.getElementById(
      "continue-game-btn"
    );


  continueButton.addEventListener(
    "click",
    () => {

      gameArea.innerHTML = "";

      showScreen(
        "games-screen"
      );

    }
  );

}


/* ========================================
   PASSIVE NEEDS
======================================== */

setInterval(
  () => {

    changeStat(
      "hunger",
      -1
    );

    changeStat(
      "thirst",
      -1
    );


    if (
      state.energy < 100
    ) {

      changeStat(
        "energy",
        -0.5
      );

    }


    if (
      state.hunger < 25 ||
      state.thirst < 25
    ) {

      changeStat(
        "happiness",
        -1
      );

    }


    updateStats();

    saveState();

  },
  60000
);


/* ========================================
   START
======================================== */

updateStats();


/*
 * Initialize the room
 * after DOM is ready.
 */

if (
  typeof initializeRoom ===
  "function"
) {

  initializeRoom();

}