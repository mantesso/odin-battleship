const Player = require("./player");
const {
  updatePlayerBoard,
  updateEnemyBoard,
  placeRandom,
  unFadeEnemyContainer,
  hideStartGame,
  startGameButton,
} = require("./ui");

// creates players
let player = new Player();
let enemy = new Player();

let gameStarted = false;

// ship positioning
player.gameboard.placeRandomSetOfShips();
enemy.gameboard.placeRandomSetOfShips();

updatePlayerBoard(player.gameboard);
updateEnemyBoard(enemy.gameboard, handlePlayerAttack);

placeRandom.addEventListener("click", () => {
  if (!gameStarted) {
    player.gameboard.placeRandomSetOfShips();
    updatePlayerBoard(player.gameboard);
  }
});

startGameButton.addEventListener("click", () => {
  startGame();
});

function startGame() {
  console.log("Game started");
  gameStarted = true;
  unFadeEnemyContainer();
  hideStartGame();
  placeRandom.classList.add("hidden");
}

function handlePlayerAttack(coord) {
  console.log("Player attacks enemy");
  enemy.gameboard.receiveAttack(coord);
  updateEnemyBoard(enemy.gameboard, handlePlayerAttack); // Refresh enemy board display

  // Check if game has ended
  if (enemy.gameboard.allSunk()) {
    alert("Player wins!");
    // Handle end game
  } else {
    setTimeout(() => {
      computerAttacks();
    }, 250);
  }
}

function computerAttacks() {
  console.log("computer attacks");
  let attackCoords = enemy.randomAttack();
  player.gameboard.receiveAttack(attackCoords);
  updatePlayerBoard(player.gameboard);

  // Check if game has ended
  if (player.gameboard.allSunk()) {
    updatePlayerBoard(player.gameboard);
    alert("Computer wins!");
    // Handle end game
  }
}
