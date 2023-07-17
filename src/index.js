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

  handleReveal(u, p) {
    if (p) {
      const p1 = p.revealType == "balance" ? gl.ec.balance : p.amount;
      const p2 = p.revealAmount;
      return p1.gte(p2);
    }

    if (u) {
      const up = this.producers.filter((p) => p.id == u.affects[0])[0];
      const p1 = u.revealType == "balance" ? gl.ec.balance : up.amount;
      const p2 = u.revealAmount;
      return p1.gte(p2);
    }

    return false;
  }

  updateGameInternals(p) {
    p.costNow = p.amount
      .add(p.amount.add(1).mul(p.costStart))
      .sub(p.costStart)
      .pow(p.costScale)
      .add(p.costStart)
      .toFixed(2); // cost scaling
    // currently: (n + ((n + 1) * cf) - cf) ^ cs + cf
    // for t1_c1: (n + ((n + 1) * 10) - 10) ^ 1.15 + 10
    // prices   : 10.00, 25.76, 44.98, 65.76
    p.producesNow = p.producesFirst.mul(p.amount);

    this.upgrades
      .filter((u) => u.affects.includes(p.id) && u.bought && !u.applied)
      .forEach((u) => {
        this.handleUpgrade(u, p);
      });
  }

  updateProducerDisplays(p) {
    const ela = document.getElementById(`${p.id}a`); // amount eg '12 quarks'
    const elb = document.getElementById(`${p.id}b`); // button string
    const elg = document.getElementById(`${p.id}g`); // group for visibility
    const elp = document.getElementById(`${p.id}p`); // producing eg '50 matter /s'

    if (elg) {
      if (elg.classList.contains("hidden") && this.handleReveal(null, p)) {
        elg.classList.remove("hidden");
        elg.classList.add("fade-in");
      }
    }

    if (ela) {
      ela.innerText = `${p.amount} ${p.plural}`;
    }

    if (elb) {
      elb.innerText = `Buy 1 ${p.name} for ${p.costNow.toString()}`;
    }

    if (elp) {
      elp.innerText = `${p.producesNow.toString()} matter /s`;
    }
  }

  updateUpgradeDisplays(u) {
    const elg = document.getElementById(`${u.id}g`); // group for visibility

    if (elg) {
      if (elg.classList.contains("hidden") && this.handleReveal(u, null)) {
        elg.classList.remove("hidden");
        elg.classList.add("fade-in");
      }
    }
  }

  updateBalance() {
    gl.ec.addToBalance(this.producing.div(10));
  }

  updateLoop() {
    if (this.producers.length == 0 || this.upgrades.length == 0) {
      this.getProducersAndUpgrades();
    }

    this.producing = new Decimal(0);
    this.producers.forEach((p) => {
      this.updateGameInternals(p);
      this.updateProducerDisplays(p);
      this.producing = this.producing.add(p.producesNow);
    });

    this.upgrades.forEach((u) => {
      this.updateUpgradeDisplays(u);
    });
  }
}

class Economy {
  constructor() {
    this.balance = new Decimal(10);
  }

  addToBalance(a) {
    this.balance = this.balance.add(a);
  }

  removeFromBalance(a) {
    this.balance = this.balance.sub(a);
  }

  displayBalance() {
    const el = document.getElementById("mainBalance");
    el.innerText = `You have ${this.balance.toFixed(2)} matter.`;
  }

  displayProducing() {
    const producing = gl.gm.producing;

    const el = document.getElementById("producingBalance");
    el.innerText = `producing ${producing} matter /s`;
  }

  updateLoop() {
    this.displayBalance();
    this.displayProducing();
  }
}

class GameLoop {
  constructor() {
    this.gm = new Game();
    this.ec = new Economy();
  }

  main() {
    setInterval(() => {
      try {
        this.gm.updateLoop().bind(this);
      } catch {}
    }, 10);
    setInterval(() => {
      try {
        this.ec.updateLoop().bind(this);
      } catch {}
    }, 10);

    setInterval(() => {
      try {
        this.gm.updateBalance().bind(this);
      } catch {}
    }, 100);
  }
}

let gl = new GameLoop();
gl.main();
