const Player = require("./player");

describe("player class", () => {
  const player = new Player();

  test("computer is capable of making random plays", () => {
    let attack = player.randomAttack();
    expect(attack[0]).toBeLessThanOrEqual(9);
    expect(attack[0]).toBeGreaterThanOrEqual(0);
    expect(attack[1]).toBeLessThanOrEqual(9);
    expect(attack[1]).toBeGreaterThanOrEqual(0);
  });
});
