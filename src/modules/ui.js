const playerBoard = document.getElementById("playerBoard");
const enemyBoard = document.getElementById("enemyBoard");
const Gameboard = require("./gameboard");
const Ship = require("./ship");

// empty board
// initializeBoard = () => {
//   for (let y = 0; y < 10; y++) {
//     for (let x = 0; x < 10; x++) {
//       let grid = document.createElement("div");
//       grid.classList.add(
//         "w-[32px]",
//         "h-[32px]",
//         "bg-white",
//         "outline",
//         "outline-1",
//         "outline-purple-900"
//       );
//       grid.setAttribute("data-y", y);
//       grid.setAttribute("data-x", x);
//       playerBoard.appendChild(grid);
//     }
//   }
// };

// initializeBoard();

let gameboard = new Gameboard();
gameboard.placeShip(3, [1, 1], "h");
gameboard.placeShip(4, [3, 3], "v");
gameboard.receiveAttack([0, 0]);
gameboard.receiveAttack([6, 6]);
gameboard.receiveAttack([1, 1]);

let enemy = new Gameboard();
enemy.placeShip(2, [4, 1], "h");
enemy.placeShip(1, [0, 0], "v");

initializePlayerBoard = (gameboard) => {
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
        "outline-purple-900",
        "relative"
      );

      if (shipBlock instanceof Ship) {
        grid.classList.remove("bg-white");
        grid.classList.add("bg-indigo-400");
        grid.classList.add("cursor-move");
      }

      let missedDot = document.createElement("div");
      missedDot.innerText = "•";
      missedDot.classList.add(
        "text-2xl",
        "absolute",
        "-translate-y-1/2",
        "-translate-x-1/2",
        "top-[14px]",
        "right-[6px]",
        "cursor-default"
      );
      if (gameboard.missedShots.some(([dx, dy]) => dx === x && dy === y)) {
        grid.classList.remove("bg-white");
        grid.classList.add("bg-gray-100");
        grid.appendChild(missedDot);
      }

      let successX = document.createElement("div");
      successX.innerText = "X";
      successX.classList.add(
        "text-2xl",
        "absolute",
        "-translate-y-1/2",
        "-translate-x-1/2",
        "top-[14px]",
        "right-[6px]",
        "cursor-default"
      );
      if (gameboard.successShots.some(([dx, dy]) => dx === x && dy === y)) {
        grid.classList.remove("bg-white");
        grid.classList.add("bg-red-100");
        grid.appendChild(successX);
      }

      grid.setAttribute("data-y", y);
      grid.setAttribute("data-x", x);
      playerBoard.appendChild(grid);
    }
  }
};

updateEnemyBoard = (gameboard) => {
  console.log("updateEnemyBoard Function");
  console.log(gameboard.missedShots);

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
        "outline-purple-900",
        "relative"
      );

      let missedDot = document.createElement("div");
      missedDot.innerText = "•";
      missedDot.classList.add(
        "text-2xl",
        "absolute",
        "-translate-y-1/2",
        "-translate-x-1/2",
        "top-[14px]",
        "right-[6px]",
        "cursor-default"
      );
      if (gameboard.missedShots.some(([dx, dy]) => dx === x && dy === y)) {
        grid.classList.remove("bg-white");
        grid.classList.add("bg-gray-100");
        grid.appendChild(missedDot);
      }

      let successX = document.createElement("div");
      successX.innerText = "X";
      successX.classList.add(
        "text-2xl",
        "absolute",
        "-translate-y-1/2",
        "-translate-x-1/2",
        "top-[14px]",
        "right-[6px]",
        "cursor-default"
      );
      if (gameboard.successShots.some(([dx, dy]) => dx === x && dy === y)) {
        grid.classList.remove("bg-white");
        grid.classList.add("bg-red-100");
        grid.appendChild(successX);
      }

      grid.setAttribute("data-y", y);
      grid.setAttribute("data-x", x);
      grid.addEventListener("click", (e) => {
        let coord = [Number(e.target.dataset.x), Number(e.target.dataset.y)];
        attackEnemy(coord, gameboard);
      });
      enemyBoard.appendChild(grid);
    }
  }
};

const attackEnemy = (coord, enemyBoard) => {
  enemyBoard.receiveAttack(coord);
  updateEnemyBoard(enemyBoard);
};

initializePlayerBoard(gameboard);
updateEnemyBoard(enemy);
