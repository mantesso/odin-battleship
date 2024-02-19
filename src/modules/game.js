const Player = require("./player");
const { updatePlayerBoard, updateEnemyBoard } = require("./ui");

// creates players
let player = new Player();
let enemy = new Player();

// ship positioning
player.gameboard.placeRandomSetOfShips();
// player.gameboard.placeShip(3, [1, 1], "h");
// player.gameboard.placeShip(4, [0, 7], "v");
// player.gameboard.placeShip(1, [5, 3], "v");
// player.gameboard.placeShip(3, [6, 7], "v");
enemy.gameboard.placeRandomSetOfShips();

updatePlayerBoard(player.gameboard);
updateEnemyBoard(enemy.gameboard, handlePlayerAttack);

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
