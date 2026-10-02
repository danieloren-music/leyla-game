"use strict";

let roomInitialized = false;

let catX = 50;
let catY = 16;

let targetX = null;
let targetY = null;

let isMoving = false;

let rotation = 0;
let draggingCat = false;

let pointerStartX = 0;
let pointerStartY = 0;

let lastPointerX = 0;

let hasMovedPointer = false;


/* ========================================
   INITIALIZE ROOM
======================================== */

function initializeRoom() {

  if (roomInitialized) {
    return;
  }

  roomInitialized = true;

  const room =
    document.getElementById("room");

  const catWrapper =
    document.getElementById("cat-wrapper");

  if (!room || !catWrapper) {
    return;
  }


  /*
   * Click on room:
   * Leyla walks to that location.
   */

  room.addEventListener(
    "pointerdown",
    (event) => {

      if (
        event.target.closest(
          ".room-object"
        )
      ) {
        return;
      }

      if (
        event.target.closest(
          "#cat-wrapper"
        )
      ) {
        return;
      }

      moveLeylaToPointer(
        event,
        room
      );

    }
  );


  /*
   * Touch / drag Leyla.
   */

  catWrapper.addEventListener(
    "pointerdown",
    (event) => {

      draggingCat = true;

      hasMovedPointer = false;

      pointerStartX =
        event.clientX;

      pointerStartY =
        event.clientY;

      lastPointerX =
        event.clientX;

      catWrapper.setPointerCapture(
        event.pointerId
      );

      catWrapper.classList.add(
        "dragging"
      );

    }
  );


  catWrapper.addEventListener(
    "pointermove",
    (event) => {

      if (!draggingCat) {
        return;
      }

      const deltaX =
        event.clientX -
        lastPointerX;

      const totalX =
        event.clientX -
        pointerStartX;

      const totalY =
        event.clientY -
        pointerStartY;


      if (
        Math.abs(totalX) > 8 ||
        Math.abs(totalY) > 8
      ) {
        hasMovedPointer = true;
      }


      /*
       * Manual 3D rotation.
       */

      rotation +=
        deltaX * 0.8;

      rotation =
        Math.max(
          -42,
          Math.min(
            42,
            rotation
          )
        );


      updateCatRotation();


      /*
       * Small horizontal movement
       * while dragging.
       */

      if (hasMovedPointer) {

        const room =
          document.getElementById(
            "room"
          );

        const rect =
          room.getBoundingClientRect();

        const newX =
          (
            (event.clientX - rect.left)
            /
            rect.width
          ) * 100;

        catX =
          Math.max(
            12,
            Math.min(
              88,
              newX
            )
          );

        updateCatPosition();

      }

      lastPointerX =
        event.clientX;

    }
  );


  catWrapper.addEventListener(
    "pointerup",
    (event) => {

      draggingCat = false;

      catWrapper.classList.remove(
        "dragging"
      );


      if (!hasMovedPointer) {

        /*
         * Tap = pet.
         * NO sound.
         */

        if (
          typeof performAction ===
          "function"
        ) {
          performAction("pet");
        }

      } else {

        /*
         * Swipe interaction.
         */

        if (rotation > 15) {

          setCatDirection(
            "right"
          );

        } else if (rotation < -15) {

          setCatDirection(
            "left"
          );

        }

        setTimeout(() => {

          rotation = 0;

          updateCatRotation();

        }, 350);

      }

    }
  );


  catWrapper.addEventListener(
    "pointercancel",
    () => {

      draggingCat = false;

      catWrapper.classList.remove(
        "dragging"
      );

    }
  );


  /*
   * Room objects.
   */

  document
    .querySelectorAll(
      ".room-object"
    )
    .forEach((object) => {

      object.addEventListener(
        "click",
        () => {

          handleRoomObject(
            object.dataset.object
          );

        }
      );

    });


  updateCatPosition();

}


/* ========================================
   MOVE LEYLA
======================================== */

function moveLeylaToPointer(
  event,
  room
) {

  const rect =
    room.getBoundingClientRect();


  targetX =
    (
      (event.clientX - rect.left)
      /
      rect.width
    ) * 100;


  targetY =
    (
      (event.clientY - rect.top)
      /
      rect.height
    ) * 100;


  targetX =
    Math.max(
      12,
      Math.min(
        88,
        targetX
      )
    );


  targetY =
    Math.max(
      35,
      Math.min(
        82,
        targetY
      )
    );


  const direction =
    targetX > catX
      ? "right"
      : "left";


  setCatDirection(
    direction
  );


  isMoving = true;

  catX = targetX;

  catY =
    100 - targetY;


  updateCatPosition();


  setTimeout(() => {

    isMoving = false;

    rotation = 0;

    updateCatRotation();

  }, 800);

}


/* ========================================
   UPDATE POSITION
======================================== */

function updateCatPosition() {

  const catWrapper =
    document.getElementById(
      "cat-wrapper"
    );

  if (!catWrapper) {
    return;
  }

  catWrapper.style.left =
    `${catX}%`;

  catWrapper.style.bottom =
    `${catY}%`;

}


/* ========================================
   ROTATION
======================================== */

function updateCatRotation() {

  const cat3d =
    document.querySelector(
      ".cat-3d"
    );

  if (!cat3d) {
    return;
  }


  const normalized =
    rotation / 42;


  const scale =
    1 +
    Math.abs(normalized) * 0.035;


  const zRotation =
    normalized * 2;


  cat3d.style.transform =
    `
      rotateY(${rotation}deg)
      rotateZ(${zRotation}deg)
      scale(${scale})
    `;

}


/* ========================================
   DIRECTION
======================================== */

function setCatDirection(
  direction
) {

  const wrapper =
    document.getElementById(
      "cat-wrapper"
    );

  if (!wrapper) {
    return;
  }


  wrapper.classList.remove(
    "rotate-left",
    "rotate-right",
    "rotate-center"
  );


  if (direction === "left") {

    wrapper.classList.add(
      "rotate-left"
    );

  } else if (
    direction === "right"
  ) {

    wrapper.classList.add(
      "rotate-right"
    );

  } else {

    wrapper.classList.add(
      "rotate-center"
    );

  }

}


/* ========================================
   WALK TO OBJECT
======================================== */

function walkToObject(
  object
) {

  const room =
    document.getElementById(
      "room"
    );

  const rect =
    room.getBoundingClientRect();

  const objectRect =
    object.getBoundingClientRect();


  const objectCenter =
    objectRect.left +
    objectRect.width / 2;


  const target =
    (
      (objectCenter - rect.left)
      /
      rect.width
    ) * 100;


  const direction =
    target > catX
      ? "right"
      : "left";


  setCatDirection(
    direction
  );


  catX =
    Math.max(
      12,
      Math.min(
        88,
        target
      )
    );


  isMoving = true;

  updateCatPosition();


  setTimeout(() => {

    isMoving = false;

  }, 800);

}


/* ========================================
   OBJECT INTERACTIONS
======================================== */

function handleRoomObject(
  objectName
) {

  const object =
    document.querySelector(
      `[data-object="${objectName}"]`
    );


  if (object) {
    walkToObject(object);
  }


  setTimeout(() => {

    switch (objectName) {

      case "food":

        if (
          typeof performAction ===
          "function"
        ) {
          performAction("feed");
        }

        break;


      case "water":

        if (
          typeof performAction ===
          "function"
        ) {
          performAction("water");
        }

        break;


      case "toy":

        if (
          typeof performAction ===
          "function"
        ) {
          performAction("play");
        }

        break;


      case "bed":

        if (
          typeof performAction ===
          "function"
        ) {
          performAction("sleep");
        }

        break;


      case "tower":

        if (
          typeof performAction ===
          "function"
        ) {

          if (
            typeof changeStat ===
            "function"
          ) {
            changeStat(
              "happiness",
              8
            );

            changeStat(
              "energy",
              5
            );

            if (
              typeof updateStats ===
              "function"
            ) {
              updateStats();
            }

            if (
              typeof saveState ===
              "function"
            ) {
              saveState();
            }
          }


          if (
            typeof setCatState ===
            "function"
          ) {

            setCatState({
              image: "leyla_happy",
              text:
                "Leyla climbed up! 🐱",
              sound: "meow",
              particle: "⭐",
              animation: "bounce",
              bubble: "😻"
            });

          }

        }

        break;

    }

  }, 850);

}


/* ========================================
   EXTERNAL HELPER
======================================== */

function moveLeylaToObject(
  objectName
) {

  const object =
    document.querySelector(
      `[data-object="${objectName}"]`
    );

  if (object) {
    walkToObject(object);
  }

}