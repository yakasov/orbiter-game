class Tier1 {
  constructor() {
    this.producers = producers.filter((p) => p.tab === 1);
    this.upgrades = upgrades.filter((u) => u.tab === 1);
    this.producing = 0;
  }

  buyProd(n) {
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
    p[u.bonus.type] = this.switchUpgrade(p[u.bonus.type], u.bonus);
    u.applied = true;
  }

  switchUpgrade(n, o) {
    switch (o.op) {
      case "add":
        return n.add(o.amount);
      case "sub":
        return n.sub(o.amount);
      case "mul":
        return n.mul(o.amount);
      case "div":
        return n.div(o.amount);
      case "pow":
        return n.pow(o.amount);
      case "log":
        return n.log(o.amount);
    }
  }

  updatePeriod12Internals(p) {
    p.costNow = p.amount
      .add(p.amount.add(1).mul(p.costFirst))
      .sub(p.costFirst)
      .pow(p.costScale)
      .add(p.costFirst)
      .toFixed(2); // cost scaling
    // currently: (n + ((n + 1) * cf) - cf) ^ cs + cf
    // for t1_c1: (n + ((n + 1) * 10) - 10) ^ 1.15 + 10
    // prices   : 10.00, 25.76, 44.98, 65.76
    p.producesNow = p.producesFirst.mul(p.amount);

    this.upgrades
      .filter((u) => u.affects === p.id && u.bought && !u.applied)
      .forEach((u) => {
        this.handleUpgrade(u, p);
      });
  }

  updatePeriod12Displays(p) {
    const ela = document.getElementById(`${p.id}a`); // amount eg '12 quarks'
    const elb = document.getElementById(`${p.id}b`); // button string
    const elg = document.getElementById(`${p.id}g`); // group for visibility
    const elp = document.getElementById(`${p.id}p`); // producing eg '50 matter /s'

    if (elg) {
      if (
        elg.classList.contains("hidden") &&
        gl.ec.balance.gte(p.costFirst.div(2))
      ) {
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

  updatePeriod12UpgradeDisplays(u) {
    const elg = document.getElementById(`${u.id}g`); // group for visibility

    if (elg) {
      if (
        elg.classList.contains("hidden") &&
        gl.ec.balance.gte(u.cost.div(2))
      ) {
        elg.classList.remove("hidden");
        elg.classList.add("fade-in");
      }
    }
  }

  updateBalance() {
    gl.ec.addToBalance(this.producing.div(10));
  }

  updateLoop() {
    var pr = new Decimal(0);
    this.prods.forEach((p) => {
      this.updatePeriod12Internals(p);
      this.updatePeriod12Displays(p);
      pr = pr.add(p.producesNow);
    });
    this.upgrades.forEach((u) => {
      this.updatePeriod12UpgradeDisplays(u);
    });
    this.producing = pr;
  }
}

class Economy {
  constructor() {
    this.balance = new Decimal(10000);
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
    const producing = gl.t1.producing;

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
    this.t1 = new Tier1();
    this.ec = new Economy();
  }

  main() {
    setInterval(() => {
      try {
        this.t1.updateLoop().bind(this);
      } catch {}
    }, 10);
    setInterval(() => {
      try {
        this.ec.updateLoop().bind(this);
      } catch {}
    }, 10);

    setInterval(() => {
      try {
        this.t1.updateBalance().bind(this);
      } catch {}
    }, 100);
  }
}

let gl = new GameLoop();
gl.main();
