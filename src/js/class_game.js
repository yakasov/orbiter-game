class Game {
  constructor() {
    this.producers = [];
    this.upgrades = [];
    this.producing = 0;

    this.upgradeBoosts = [];
  }

  getProducersAndUpgrades() {
    this.producers = producers;
    this.upgrades = upgrades;
  }

  buyProducer(n) {
    var p = this.producers[n];
    if (gl.ec.balance.gte(p.costNow)) {
      p.amount = p.amount.plus(1);
      gl.ec.removeFromBalance(p.costNow);
    }
  }

  buyMax(n) {
    var p = this.producers[n];
    var tempCostNow = new Decimal(0);

    while (gl.ec.balance.gte(tempCostNow)) {
      tempCostNow = p.amount
        .add(1)
        .mul(p.costStart)
        .mul(Math.pow(p.costScale, p.amount.toFixed(0)));

      if (gl.ec.balance.sub(tempCostNow).gte(0)) {
        p.amount = p.amount.plus(1);
        gl.ec.removeFromBalance(tempCostNow);
      }
    }
  }

  buyUpgrade(n) {
    var u = this.upgrades[n];
    if (gl.ec.balance.gte(u.cost)) {
      u.bought = true;
      gl.ec.removeFromBalance(u.cost);
    }
  }

  handleUpgrade(u, p) {
    if (u.bonusType == "bonusAmount") {
      this.upgradeBoosts = this.upgradeBoosts.concat({
        affects: u.affects[0],
        source: u.bonusOp,
        ratio: u.bonusAmount,
      });
    } else {
      p[u.bonusType] = switchAffects(p[u.bonusType], u.bonusOp, u.bonusAmount);
    }

    if (u.affects.slice(-1) == p.id) {
      u.applied = true;
    }
  }

  updateBoosts() {
    this.upgradeBoosts.forEach((b) => {
      const affectsProducer = producers.filter((p) => p.id == b.affects)[0];
      const sourceProducer = producers.filter((p) => p.id == b.source)[0];

      affectsProducer.bonusAmount = sourceProducer.elementAmount.mul(b.ratio);
    });
  }

  updateGameInternals(p) {
    this.updateBoosts();
    p.costNow = p.amount
      .add(1)
      .mul(p.costStart)
      .mul(Math.pow(p.costScale, p.amount.toFixed(0)));
    // currently: (n + 1) * cst * (csc ^ costScale)
    // prices   : 10.00, 21.00, 33.08, 46.31, 60.78
    p.producesNow = p.producesFirst.mul(p.amount.add(p.bonusAmount));

    this.upgrades
      .filter((u) => u.affects.includes(p.id) && u.bought && !u.applied)
      .forEach((u) => {
        this.handleUpgrade(u, p);
      });
  }

  updateLoop() {
    if (this.producers.length == 0 || this.upgrades.length == 0) {
      this.getProducersAndUpgrades();
    }

    this.producing = new Decimal(0);
    this.producers.forEach((p) => {
      this.updateGameInternals(p);
      p.elementAmount = p.elementAmount.add(
        p.amount.div(1000 / updateLoopInterval)
      );
      this.producing = this.producing.add(p.producesNow);
    });
    gl.ac.achievementGlobalBoosts.forEach((b) => {
      this.producing = switchAffects(this.producing, b.op, b.amount);
    });

    gl.ec.addToBalance(this.producing.div(1000 / updateLoopInterval));
  }
}
