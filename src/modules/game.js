const Player = require("./player");
const { updatePlayerBoard, updateEnemyBoard } = require("./ui");

let player = new Player();
player.gameboard.placeShip(3, [1, 1], "h");
player.gameboard.placeShip(3, [0, 5], "h");
player.gameboard.placeShip(4, [3, 3], "v");
// player.gameboard.receiveAttack([0, 0]);
// player.gameboard.receiveAttack([6, 6]);
// player.gameboard.receiveAttack([1, 1]);
console.log(player.randomAttack());

let enemy = new Player();
enemy.gameboard.placeShip(2, [4, 1], "h");
enemy.gameboard.placeShip(1, [0, 0], "v");

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
    computerAttacks();
  }
}

function computerAttacks() {
  console.log("computer attacks");
  let attackCoords = enemy.randomAttack();
  player.gameboard.receiveAttack(attackCoords);
  updatePlayerBoard(player.gameboard);

  // Check if game has ended
  if (player.gameboard.allSunk()) {
    alert("Computer wins!");
    // Handle end game
  }
}
