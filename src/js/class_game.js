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

  buyUpgrade(n) {
    var u = this.upgrades[n];
    if (gl.ec.balance.gte(u.cost)) {
      u.bought = true;
      gl.ec.removeFromBalance(u.cost);
      const elub = document.getElementById(`${u.id}b`);
      if (elub) {
        elub.innerText = "Bought!";
        elub.classList.add("disabled");
        elub.setAttribute("disabled", true);
      }
    }
  }

  handleUpgrade(u, p) {
    p[u.bonusType] = this.switchUpgrade(
      p[u.bonusType],
      u.bonusOp,
      u.bonusAmount
    );
    u.applied = true;
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
      .add(p.amount.mul(p.costStart / 2))
      .pow(p.costScale)
      .add(p.costStart)
      .toFixed(2); // cost scaling
    // currently: (n + (n * (cs / 2))) + cs
    // prices   : 10.00, 16.92, 24.64, 32.68, 40.95
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
