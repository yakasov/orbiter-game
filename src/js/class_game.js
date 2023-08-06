class Game {
  constructor() {
    this.producers = [];
    this.upgrades = [];
    this.producing = 0;
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

    while (gl.ec.balance.gte(p.costNow)) {
      // TODO: This breaks if balance is high enough, too many numbers!!
      //       Figure out the proper formula for figuring this out
      p.amount = p.amount.plus(1);
      gl.ec.removeFromBalance(p.costNow);
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
    p[u.bonusType] = this.switchUpgrade(
      p[u.bonusType],
      u.bonusOp,
      u.bonusAmount
    );

    if (u.affects.slice(-1) == p.id) {
      u.applied = true;
    }
  }

  switchUpgrade(n, o, a) {
    if (typeof n == "number") n = new Decimal(n);

    switch (o) {
      case "add":
        return n.add(a);
      case "sub":
        return n.sub(a);
      case "mul":
        return n.mul(a);
      case "div":
        return n.div(a);
      case "pow":
        return n.pow(a);
      case "log":
        return n.log(a);
    }
  }

  updateGameInternals(p) {
    p.costNow = p.amount
      .add(1)
      .mul(p.costStart)
      .mul(Math.pow(p.costScale, p.amount.toFixed(0)));
    // currently: (n + 1) * cst * (csc ^ costScale)
    // prices   : 10.00, 21.00, 33.08, 46.31, 60.78
    p.producesNow = p.producesFirst.mul(p.amount);

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
      p.elementAmount = p.elementAmount.add(p.amount.div(100));
      this.producing = this.producing.add(p.producesNow);
    });

    gl.ec.addToBalance(this.producing.div(100));
  }
}
