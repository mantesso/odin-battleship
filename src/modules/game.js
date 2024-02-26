const Player = require("./player");
const {
  updatePlayerBoard,
  updateEnemyBoard,
  uiGameStarted,
  startGameButton,
  playAgainButton,
  gameOverInfo,
  replayGame,
} = require("./ui");

// create players
let player = new Player();
let enemy = new Player();

let gameStarted = false;

// initial ship positioning
player.gameboard.placeRandomSetOfShips();
enemy.gameboard.placeRandomSetOfShips();

updatePlayerBoard(player.gameboard, gameStarted);
updateEnemyBoard(enemy.gameboard, handlePlayerAttack, gameStarted);

placeRandom.addEventListener("click", () => {
  if (!gameStarted) {
    player.gameboard.placeRandomSetOfShips();
    updatePlayerBoard(player.gameboard, gameStarted);
  }
});

startGameButton.addEventListener("click", () => {
  startGame();
});

playAgainButton.addEventListener("click", () => {
  gameStarted = false;
  player = new Player();
  enemy = new Player();

  player.gameboard.placeRandomSetOfShips();
  enemy.gameboard.placeRandomSetOfShips();
  updatePlayerBoard(player.gameboard, gameStarted);
  updateEnemyBoard(enemy.gameboard, handlePlayerAttack, gameStarted);
  replayGame();
});

const startGame = () => {
  console.log("Game started");
  gameStarted = true;
  updatePlayerBoard(player.gameboard, gameStarted);
  updateEnemyBoard(enemy.gameboard, handlePlayerAttack, gameStarted);
  uiGameStarted();
};

const gameOver = (winner) => {
  gameStarted = false;
  updateEnemyBoard(enemy.gameboard, handlePlayerAttack, gameStarted); // will block user from hitting enemy board after game is over
  gameOverInfo(winner);
};

function handlePlayerAttack(coord) {
  console.log("Player attacks enemy");
  enemy.gameboard.receiveAttack(coord);
  updateEnemyBoard(enemy.gameboard, handlePlayerAttack, gameStarted); // Refresh enemy board display

  // Check if game has ended
  if (enemy.gameboard.allSunk()) {
    gameOver("Player");
  } else {
    setTimeout(() => {
      computerAttacks();
    }, 250); // adds delay to simulate a person playing
  }
}

const computerAttacks = () => {
  console.log("computer attacks");
  let attackCoords = enemy.randomAttack();
  player.gameboard.receiveAttack(attackCoords);
  updatePlayerBoard(player.gameboard, gameStarted);

  // Check if game has ended
  if (player.gameboard.allSunk()) {
    updatePlayerBoard(player.gameboard, gameStarted);
    gameOver("Computer");
  }
};
