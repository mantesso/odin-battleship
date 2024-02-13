const Gameboard = require("./gameboard");

describe("gameboard module tests", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip(1, [0, 0], "h");
  gameboard.placeShip(1, [2, 2], "h");

  test("should be able to place ships at specific coordinates", () => {
    expect(gameboard.shipsArray[0][0]).toBeTruthy();
  });

  test("cannot place ship out of bounds", () => {
    expect(gameboard.placeShip(3, [0, 9], "h")).toBe(false);
  });

  test("cannot place ship on the top of another ship", () => {
    expect(gameboard.placeShip(1, [0, 0], "h")).toBe(false);
  });

  test("determines whether or not the attack hit a ship", () => {
    gameboard.receiveAttack([0, 0]);
    expect(gameboard.shipsArray[0][0].hits).toBe(1);
  });

  test("keep track of missed attacks", () => {
    gameboard.receiveAttack([1, 1]);
    expect(gameboard.missedShots).toContainEqual([1, 1]);
  });

  test("report whether or not all of their ships have been sunk", () => {
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([2, 2]);
    expect(gameboard.allSunk()).toBe(true);
  });
});
