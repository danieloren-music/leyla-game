"use strict";

let fishGameCleanup = null;
let fishGameTimer = null;


function startFishGame({
  area,
  scoreElement,
  onComplete
}) {

  if (fishGameCleanup) {
    fishGameCleanup();
  }

  area.innerHTML = "";

  let score = 0;
  let caught = 0;
  let missed = 0;

  let running = true;

  const totalFish = 15;


  function updateScore() {

    scoreElement.textContent =
      score;
  }


  function createFish() {

    if (!running) {
      return;
    }

    if (
      caught + missed >= totalFish
    ) {

      finish();

      return;
    }


    const fish =
      document.createElement("div");

    fish.className =
      "fish";

    const fishTypes = [
      "🐟",
      "🐠",
      "🐡"
    ];

    fish.textContent =
      fishTypes[
        Math.floor(
          Math.random() *
          fishTypes.length
        )
      ];


    const maxX =
      Math.max(
        0,
        area.clientWidth - 60
      );

    const maxY =
      Math.max(
        0,
        area.clientHeight - 130
      );


    fish.style.left =
      `${Math.random() * maxX}px`;

    fish.style.top =
      `${Math.random() * maxY}px`;


    area.appendChild(fish);


    let removed = false;


    const timeout =
      setTimeout(() => {

        if (removed) {
          return;
        }

        removed = true;

        missed++;

        fish.remove();

        createFish();

      }, 1300);


    fish.addEventListener(
      "click",
      () => {

        if (removed || !running) {
          return;
        }

        removed = true;

        clearTimeout(timeout);

        caught++;

        score += 5;

        updateScore();

        fish.remove();

        createFish();

      }
    );
  }


  function finish() {

    if (!running) {
      return;
    }

    running = false;

    clearTimeout(fishGameTimer);

    setTimeout(() => {

      if (onComplete) {

        onComplete({
          score
        });

      }

    }, 400);
  }


  fishGameCleanup = () => {

    running = false;

    clearTimeout(fishGameTimer);

    area.innerHTML = "";

    fishGameCleanup = null;
  };


  updateScore();

  createFish();
}