class Tier1 {
  constructor() {
    this.prods = [
      new Prod("t1_c1p", "Hydrogen Gatherer", 10, 1.18, 2),
      new Prod("t1_c2p", "Helium Hunter", 100, 1.12, 10),
    ];
    this.upgrades = [
      new Upgrade("t1_u1", "t1_c1p", "Hydrogen Coffee Breaks", 250, (p) => {
        return p.mul(2);
      }),
    ];
    this.producing = 0;
  }

  buyProd(n) {
    var p = this.prods[n];
    if (gl.ec.balance.gte(p.cn)) {
      p.a = p.a.plus(1);
      gl.ec.removeFromBalance(p.cn);
    }
  }

  buyUpgrade(n) {
    var u = this.upgrades[n];
    if (gl.ec.balance.gte(u.c)) {
      u.b = true;
      gl.ec.removeFromBalance(u.c);
      const elub = document.getElementById(`${u.n}b`);
      if (elub) {
        elub.innerText = "Bought!";
        elub.classList.add("disabled");
        elub.setAttribute("disabled", true);
      }
    }
  }

  updatePeriod12Internals(c) {
    c.cn = c.a
      .add(c.a.add(1).mul(c.cf))
      .sub(c.cf)
      .pow(c.cs)
      .add(c.cf)
      .toFixed(2); // cost scaling
    // currently: (n + ((n + 1) * cf) - cf) ^ cs + cf
    // for t1_c1: (n + ((n + 1) * 10) - 10) ^ 1.15 + 10
    // prices   : 10.00, 25.76, 44.98, 65.76
    c.pn = c.pf.mul(c.a);

    this.upgrades
      .filter((u) => u.np === c.n && u.b && !u.a)
      .forEach((u) => {
        c.pf = u.p(c.pf);
        u.a = true;
      });
  }

  updatePeriod12Displays(c) {
    const ela = document.getElementById(`${c.n}a`); // amount eg '12 quarks'
    const elb = document.getElementById(`${c.n}b`); // button string
    const elg = document.getElementById(`${c.n}g`); // group for visibility
    const elp = document.getElementById(`${c.n}p`); // producing eg '50 matter /s'

    if (elg) {
      if (elg.classList.contains("hidden") && gl.ec.balance.gte(c.cf.div(2))) {
        elg.classList.remove("hidden");
        elg.classList.add("fade-in");
      }
    }

    if (ela) {
      ela.innerText = `${c.a} ${c.t}`;
    }

    if (elb) {
      elb.innerText = `Buy 1 ${c.ft} for ${c.cn.toString()}`;
    }

    if (elp) {
      elp.innerText = `${c.pn.toString()} matter /s`;
    }
  }

  updatePeriod12UpgradeDisplays(u) {
    const elg = document.getElementById(`${u.n}g`); // group for visibility

    if (elg) {
      if (elg.classList.contains("hidden") && gl.ec.balance.gte(u.c.div(2))) {
        elg.classList.remove("hidden");
        elg.classList.add("fade-in");
      }
    }
  }

  updateBalance() {
    gl.ec.addToBalance(this.producing.div(10));
  }

  updateLoop() {
    var p = new Decimal(0);
    this.prods.forEach((c) => {
      this.updatePeriod12Internals(c);
      this.updatePeriod12Displays(c);
      p = p.add(c.pn);
    });
    this.upgrades.forEach((u) => {
      this.updatePeriod12UpgradeDisplays(u);
    });
    this.producing = p;
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
