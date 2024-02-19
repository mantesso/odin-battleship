const Ship = require("./ship");
const playerBoard = document.getElementById("playerBoard");
const enemyBoard = document.getElementById("enemyBoard");
const placeRandom = document.getElementById("placeRandom");
const enemyContainer = document.getElementById("enemyContainer");
const startGameButton = document.getElementById("startGameButton");

const updatePlayerBoard = (gameboard) => {
  playerBoard.innerHTML = "";

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      let shipBlock = gameboard.shipsArray[y][x];

      let grid = document.createElement("div");
      grid.classList.add(
        "w-[32px]",
        "h-[32px]",
        "bg-white",
        "outline",
        "outline-1",
        "outline-slate-600",
        "relative",
        "flex",
        "items-center",
        "justify-center"
      );

      if (shipBlock instanceof Ship) {
        grid.classList.remove("bg-white");
        grid.classList.add("bg-sky-500");
        grid.classList.add("cursor-move");
      }

      let missedDot = document.createElement("div");
      missedDot.innerText = "•";
      missedDot.classList.add("text-2xl", "cursor-default");
      if (gameboard.missedShots.some(([dy, dx]) => dy === y && dx === x)) {
        grid.classList.remove("bg-white");
        grid.classList.add("bg-gray-100");
        grid.appendChild(missedDot);
      }

      let successX = document.createElement("div");
      successX.classList.add(
        "flex",
        "items-center",
        "justify-center",
        "w-full",
        "h-full",
        "text-red-500"
      );
      successX.innerHTML = `
      <!-- https://feathericons.dev/?search=x&iconset=feather -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="5">
        <line x1="18" x2="6" y1="6" y2="18" />
        <line x1="6" x2="18" y1="6" y2="18" />
      </svg>`;

      if (gameboard.successShots.some(([dy, dx]) => dy === y && dx === x)) {
        grid.classList.remove("bg-sky-500");
        grid.classList.add("bg-sky-700");
        grid.appendChild(successX);
      }

      grid.setAttribute("data-y", y);
      grid.setAttribute("data-x", x);
      playerBoard.appendChild(grid);
    }
  }
};

const updateEnemyBoard = (gameboard, onAttack) => {
  console.log("updateEnemyBoard Function");
  console.log(`missed shots on enemy board: ${gameboard.missedShots}`);

  enemyBoard.innerHTML = "";
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      let grid = document.createElement("div");
      grid.classList.add(
        "w-[32px]",
        "h-[32px]",
        "bg-white",
        "outline",
        "outline-1",
        "outline-slate-600",
        "relative",
        "flex",
        "items-center",
        "justify-center"
      );

      let missedDot = document.createElement("div");
      missedDot.innerText = "•";
      missedDot.classList.add("text-2xl", "cursor-default");
      if (gameboard.missedShots.some(([dy, dx]) => dy === y && dx === x)) {
        grid.classList.remove("bg-white");
        grid.classList.add("bg-gray-100");
        grid.appendChild(missedDot);
      }

      let successX = document.createElement("div");
      successX.classList.add(
        "flex",
        "items-center",
        "justify-center",
        "w-full",
        "h-full",
        "text-red-500"
      );
      successX.innerHTML = `
      <!-- https://feathericons.dev/?search=x&iconset=feather -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="5">
        <line x1="18" x2="6" y1="6" y2="18" />
        <line x1="6" x2="18" y1="6" y2="18" />
      </svg>`;

      if (gameboard.successShots.some(([dy, dx]) => dy === y && dx === x)) {
        grid.classList.remove("bg-white");
        grid.classList.add("bg-red-100");
        grid.appendChild(successX);
      }

      grid.setAttribute("data-y", y);
      grid.setAttribute("data-x", x);
      // this if blocks clicking missed or success shots
      if (
        !gameboard.missedShots.some(([dy, dx]) => dy === y && dx === x) &&
        !gameboard.successShots.some(([dy, dx]) => dy === y && dx === x)
      ) {
        grid.addEventListener("click", (e) => {
          let coord = [Number(e.target.dataset.y), Number(e.target.dataset.x)];
          onAttack(coord);
        });
      }
      enemyBoard.appendChild(grid);
    }
  }
};

const unFadeEnemyContainer = () => {
  enemyBoard.classList.remove("opacity-40");
};

const hideStartGame = () => {
  startGameButton.classList.add("hidden");
};

module.exports = {
  updatePlayerBoard,
  updateEnemyBoard,
  unFadeEnemyContainer,
  hideStartGame,
  placeRandom,
  startGameButton,
};
