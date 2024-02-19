const Player = require("./player");
const { updatePlayerBoard, updateEnemyBoard, placeRandom } = require("./ui");

// creates players
let player = new Player();
let enemy = new Player();

// ship positioning
player.gameboard.placeRandomSetOfShips();
enemy.gameboard.placeRandomSetOfShips();

updatePlayerBoard(player.gameboard);
updateEnemyBoard(enemy.gameboard, handlePlayerAttack);

function placeRandomShips() {
  player.gameboard.placeRandomSetOfShips();
  updatePlayerBoard(player.gameboard);
}

placeRandom.addEventListener("click", () => {
  placeRandomShips();
});

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
