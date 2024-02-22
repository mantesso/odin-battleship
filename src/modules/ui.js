const Ship = require("./ship");
const playerBoard = document.getElementById("playerBoard");
const enemyBoard = document.getElementById("enemyBoard");
const placeRandom = document.getElementById("placeRandom");
const startGameButton = document.getElementById("startGameButton");
const backdropBlur = document.getElementById("backdropBlur");

const updatePlayerBoard = (gameboard) => {
  playerBoard.innerHTML = "";

  const renderedShips = new Set();

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      let shipBlock = gameboard.shipsArray[y][x];

      let grid = document.createElement("div");
      grid.classList.add(
        "w-[31px]",
        "h-[31px]",
        "bg-white",
        "outline",
        "outline-1",
        "outline-slate-600",
        "relative",
        "flex",
        "items-center",
        "justify-center",
        "overflow-visible"
      );

      if (shipBlock instanceof Ship && !renderedShips.has(shipBlock.id)) {
        console.log(shipBlock);
        renderedShips.add(shipBlock.id);

        let ship = document.createElement("div");
        if (shipBlock.orientation == "h") {
          ship.style.width = `${shipBlock.length * 32 - 1}px`;
          ship.style.height = `31px`;
        } else {
          ship.style.height = `${shipBlock.length * 32 - 1}px`;
          ship.style.width = `31px`;
        }

        ship.classList.add("bg-sky-500", "absolute", "z-20", "top-0", "left-0");

        ship.setAttribute("draggable", true);
        ship.setAttribute("data-length", shipBlock.length);
        ship.setAttribute("data-orientation", shipBlock.orientation);
        ship.setAttribute("ship-id", shipBlock.id);

        ship.addEventListener("dragstart", (e) => {
          console.log("dragstart event");
          e.dataTransfer.setData("text/plain", shipBlock.id.toString());
          e.dataTransfer.setData("shipId", shipBlock.id.toString());
          e.dataTransfer.setData("shipLength", shipBlock.length.toString());
          e.dataTransfer.setData("shipOrientation", shipBlock.orientation);
          e.dataTransfer.setData("origCoord", [y, x]);
        });

        grid.appendChild(ship);
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
        "text-red-500",
        "bg-sky-600",
        "z-30"
      );
      successX.innerHTML = `
      <!-- https://feathericons.dev/?search=x&iconset=feather -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="5">
        <line x1="18" x2="6" y1="6" y2="18" />
        <line x1="6" x2="18" y1="6" y2="18" />
      </svg>`;

      if (gameboard.successShots.some(([dy, dx]) => dy === y && dx === x)) {
        grid.classList.add("bg-sky-800");
        grid.appendChild(successX);
      }

      grid.setAttribute("data-y", y);
      grid.setAttribute("data-x", x);

      grid.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
      grid.addEventListener("drop", handleDrop);

      playerBoard.appendChild(grid);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const shipId = Number(e.dataTransfer.getData("shipId"));
    const shipLength = Number(e.dataTransfer.getData("shipLength"));
    const shipOrientation = e.dataTransfer.getData("shipOrientation");
    const origCoord = e.dataTransfer
      .getData("origCoord")
      .split(",")
      .map((x) => Number(x));
    const targetCoord = [
      Number(e.target.dataset.y),
      Number(e.target.dataset.x),
    ];

    if (isNaN(targetCoord[0]) || isNaN(targetCoord[1])) {
      return;
    }

    console.log(`target coord: ${targetCoord}`);

    if (
      gameboard.isValidPosition(
        shipLength,
        targetCoord,
        shipOrientation,
        shipId
      )
    ) {
      console.log("valid position");
      gameboard.removeShip(shipLength, origCoord, shipOrientation, shipId);
      gameboard.placeShip(shipLength, targetCoord, shipOrientation);
      updatePlayerBoard(gameboard);
      console.table(gameboard.shipsArray);
    } else {
      console.log("invalid position");
      console.table(gameboard.shipsArray);
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
        "w-[31px]",
        "h-[31px]",
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

const uiGameStarted = () => {
  // unfade enemy container
  backdropBlur.classList.add("hidden");
  enemyBoard.classList.remove("opacity-40");

  // hide place random button
  placeRandom.classList.add("hidden");
};

module.exports = {
  updatePlayerBoard,
  updateEnemyBoard,
  uiGameStarted,
  startGameButton,
};
