"use strict";

let yarnGameCleanup = null;
let currentYarnGame = null;


function startYarnGame({
  area,
  scoreElement,
  onComplete
}) {

  if (yarnGameCleanup) {
    yarnGameCleanup();
  }

  area.innerHTML = "";

  let score = 0;
  let running = true;

  currentYarnGame = {
    stop() {
      running = false;
    }
  };


  /* Cat */

  const cat =
    document.createElement("img");

  cat.src =
    "images/leyla_happy.png";

  cat.className =
    "game-cat";

  area.appendChild(cat);


  /* Yarn */

  const yarn =
    document.createElement("div");

  yarn.className =
    "yarn-ball";

  yarn.textContent =
    "🧶";

  area.appendChild(yarn);


  /* Initial position */

  let x = area.clientWidth / 2 - 29;
  let y = 70;

  yarn.style.left =
    `${x}px`;

  yarn.style.top =
    `${y}px`;


  let dragging = false;

  let offsetX = 0;
  let offsetY = 0;


  function updateScore() {

    scoreElement.textContent =
      score;
  }


  function moveYarn(clientX, clientY) {

    const rect =
      area.getBoundingClientRect();

    x =
      clientX -
      rect.left -
      offsetX;

    y =
      clientY -
      rect.top -
      offsetY;


    x =
      Math.max(
        0,
        Math.min(
          area.clientWidth - 58,
          x
        )
      );


    y =
      Math.max(
        0,
        Math.min(
          area.clientHeight - 58,
          y
        )
      );


    yarn.style.left =
      `${x}px`;

    yarn.style.top =
      `${y}px`;
  }


  function pointerDown(event) {

    dragging = true;

    const rect =
      yarn.getBoundingClientRect();

    offsetX =
      event.clientX -
      rect.left;

    offsetY =
      event.clientY -
      rect.top;

    yarn.setPointerCapture(
      event.pointerId
    );
  }


  function pointerMove(event) {

    if (!dragging || !running) {
      return;
    }

    moveYarn(
      event.clientX,
      event.clientY
    );
  }


  function pointerUp() {

    if (!dragging) {
      return;
    }

    dragging = false;

    score += 5;

    updateScore();

    cat.classList.remove("bounce");

    void cat.offsetWidth;

    cat.classList.add("bounce");


    if (score >= 50) {

      running = false;

      setTimeout(() => {

        if (onComplete) {
          onComplete({
            score
          });
        }

      }, 500);

    } else {

      randomizeYarn();
    }
  }


  function randomizeYarn() {

    x =
      Math.random() *
      (area.clientWidth - 58);

    y =
      30 +
      Math.random() *
      Math.max(
        50,
        area.clientHeight - 120
      );

    yarn.style.left =
      `${x}px`;

    yarn.style.top =
      `${y}px`;
  }


  function touchCat() {

    if (!running) {
      return;
    }

    score += 2;

    updateScore();

    randomizeYarn();

  }


  yarn.addEventListener(
    "pointerdown",
    pointerDown
  );

  yarn.addEventListener(
    "pointermove",
    pointerMove
  );

  yarn.addEventListener(
    "pointerup",
    pointerUp
  );

  yarn.addEventListener(
    "pointercancel",
    pointerUp
  );

  cat.addEventListener(
    "click",
    touchCat
  );


  yarnGameCleanup = () => {

    running = false;

    yarn.removeEventListener(
      "pointerdown",
      pointerDown
    );

    yarn.removeEventListener(
      "pointermove",
      pointerMove
    );

    yarn.removeEventListener(
      "pointerup",
      pointerUp
    );

    yarn.removeEventListener(
      "pointercancel",
      pointerUp
    );

    gameAreaCleanup();
  };


  function gameAreaCleanup() {
    yarnGameCleanup = null;
    currentYarnGame = null;
  }


  updateScore();
}