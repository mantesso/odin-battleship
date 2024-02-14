const Gameboard = require("./gameboard");

class Player {
  constructor() {
    this.gameboard = new Gameboard();
    this.attackHistory = [];
  }

  randomAttack() {
    let randomAttack;
    let unique = false;
    while (!unique) {
      randomAttack = [this.getRandomInt(10), this.getRandomInt(10)];
      if (!this.containsAttack(randomAttack)) {
        unique = true;
        this.attackHistory.push(randomAttack);
      }
    }
    return randomAttack;
  }

  containsAttack(attack) {
    return this.attackHistory.some(
      ([x, y]) => x === attack[0] && y === attack[1]
    );
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
}

module.exports = Player;
