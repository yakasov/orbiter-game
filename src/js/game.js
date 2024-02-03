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
      tempCostNow = p.amount.add(
        new Decimal(1)
          .mul(p.costStart)
          .mul(Math.pow(p.costScale, p.amount.toFixed(0)))
      );

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

  handleUpgrade(u) {
    if (u.bonusAmountEffect) {
      this.upgradeBoosts = this.upgradeBoosts.concat(u);
    } else {
      u.bonus();
      u.applied = true;
    }
  }

  updateGameInternals(p) {
    this.upgradeBoosts.forEach((u) => u.bonus());

    p.costNow = p.amount.add(
      new Decimal(1)
        .mul(p.costStart)
        .mul(Math.pow(p.costScale, p.amount.toFixed(0)))
    );
    console.log(Math.pow(p.costScale, p.amount.toFixed(0)));
    // currently: (n + 1) * cst * (csc ^ costScale)
    // prices   : 10.00, 21.00, 33.08, 46.31, 60.78
    p.producesNow = p.producesFirst.mul(p.amount.add(p.bonusAmount));

    this.upgrades
      .filter((u) => u.affects().includes(p) && u.bought && !u.applied)
      .forEach((u) => {
        this.handleUpgrade(u);
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
      b.bonus();
    });

    gl.ec.addToBalance(this.producing.div(1000 / updateLoopInterval));
  }
}
