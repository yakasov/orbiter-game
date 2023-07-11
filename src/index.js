class Prod {
  constructor(name, trans, costStart, costScale, produces) {
    this.n = name;
    this.a = new Decimal(0);
    this.t = `${trans.split(" ")[0].toLowerCase()}s`;
    this.ft = trans;
    this.cf = costStart;
    this.cn = new Decimal(0);
    this.cs = costScale;
    this.pf = new Decimal(produces);
    this.pn = new Decimal(0);
  }
}

class Tier1 {
  constructor() {
    this.atomics = [
      new Prod("t1_c1", "Quark Gatherer", 10, 1.15, 2),
      new Prod("t1_c2", "Hadron Hunter", 100, 1.15, 10),
    ];
    this.producing = 0;
  }

  buyAtomic(n) {
    var atomic = this.atomics[n];
    if (gl.ec.balance.gte(atomic.cn)) {
      atomic.a = atomic.a.plus(1);
      gl.ec.removeFromBalance(atomic.cn);
    }
  }

  updateAtomicInternals(c) {
    c.cn = c.a.add(c.a.add(1).mul(c.cf)).sub(c.cf).pow(c.cs).toFixed(2); // cost scaling
    c.pn = c.pf.mul(c.a);
  }

  updateAtomicDisplays(c) {
    const ela = document.getElementById(`${c.n}a`); // amount eg '12 quarks'
    const elb = document.getElementById(`${c.n}b`); // button string
    const elg = document.getElementById(`${c.n}g`); // group for display: none
    const elp = document.getElementById(`${c.n}p`); // producing eg '50 matter /s'

    if (elg) {
      if (elg.style.display === "none" && gl.ec.balance.gte(c.cf)) {
        elg.style.display = "";
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

  updateBalance() {
    gl.ec.addToBalance(this.producing.div(10));
  }

  updateLoop() {
    var p = new Decimal(0);
    this.atomics.forEach((c) => {
      this.updateAtomicInternals(c);
      this.updateAtomicDisplays(c);
      p = p.add(c.pn);
    });
    this.producing = p;
  }
}

class Economy {
  constructor() {
    this.balance = new Decimal(0);
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
