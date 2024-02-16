const Gameboard = require("./gameboard");
const { updatePlayerBoard, updateEnemyBoard } = require("./ui");

let gameboard = new Gameboard();
gameboard.placeShip(3, [1, 1], "h");
gameboard.placeShip(4, [3, 3], "v");
gameboard.receiveAttack([0, 0]);
gameboard.receiveAttack([6, 6]);
gameboard.receiveAttack([1, 1]);

let enemy = new Gameboard();
enemy.placeShip(2, [4, 1], "h");
enemy.placeShip(1, [0, 0], "v");

updatePlayerBoard(gameboard);
updateEnemyBoard(enemy);
