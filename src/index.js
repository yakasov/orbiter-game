/*
n: name
a: amount
t: translation (plural)
ft: full translation (singular)
cf: cost (first)
cn: cost (now)
cs: cost scale
pf: produces base /s
pn: produces now /s

c1a: amount
c1b: button
c1p: producing
*/

class Tier1 {
  constructor() {
    this.atomics = [
      { n: "t1_c1", a: new Decimal(), t: "quarks", ft: "Quark Gatherer", cf: 10, cn: new Decimal(), cs: 2, pf: new Decimal(1), pn: new Decimal() },
      { n: "t1_c2", a: new Decimal(), t: "hadrons", ft: "Hadron Hunters", cf: 100, cn: new Decimal(), cs: 2, pf: new Decimal(10), pn: new Decimal() },
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
    c.cn = c.cf + c.a ** c.cs; // cost scaling
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
    gl.ec.addToBalance(this.producing.div(10))   
  }

  updateLoop() {
    var p = new Decimal(0);
    this.atomics.forEach((c) => {
      this.updateAtomicInternals(c);
      this.updateAtomicDisplays(c);
      p = p.add(c.pn)
    });
    this.producing = p;
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
    const el = document.getElementById('mainBalance');
    el.innerText = `You have ${this.balance.toFixed(2)} matter.`;
  }

  displayProducing() {
    const producing = gl.t1.producing;

    const el = document.getElementById('producingBalance');
    el.innerText = `producing ${producing} matter /s`
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
    setInterval(() => { try { this.t1.updateLoop().bind(this) } catch {} }, 10);
    setInterval(() => { try { this.ec.updateLoop().bind(this) } catch {} }, 10);

    setInterval(() => { try { this.t1.updateBalance().bind(this) } catch {} }, 100);
  }
}

let gl = new GameLoop();
gl.main();
