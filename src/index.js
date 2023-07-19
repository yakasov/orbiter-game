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
      p.elementAmount = p.elementAmount.add(p.producesNow.div(10));
      this.producing = this.producing.add(p.producesNow);
    });
  }
}

class Economy {
  constructor() {
    this.balance = new Decimal(1000);
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

class Display {
  constructor() {
    this.activeTab = 1;
  }

  showTab(i) {
    var currentTab = tabs[this.activeTab];
    if (currentTab.id != tabs[i].id) {
      this.activeTab = i;
      document.getElementById(currentTab.id).classList.add("hidden");
      document.getElementById(tabs[i].id).classList.remove("hidden");

      if (tabs[i].id == "achievements") {
        document.getElementById("achievementsbutton").classList.remove("pulse");
      }
    }
  }

  handleReveal(u, p) {
    if (p) {
      const p1 = p.revealType == "balance" ? gl.ec.balance : p.amount;
      const p2 = p.revealAmount;
      return p1.gte(p2);
    }

    if (u) {
      const up = gl.gm.producers.filter((p) => p.id == u.affects[0])[0];
      const p1 = u.revealType == "balance" ? gl.ec.balance : up.amount;
      const p2 = u.revealAmount;
      return p1.gte(p2);
    }

    return false;
  }

  updateProducerDisplays(p) {
    const ela = document.getElementById(`${p.id}a`); // amount eg '12 quarks'
    const elb = document.getElementById(`${p.id}b`); // button string
    const elg = document.getElementById(`${p.id}g`); // group for visibility
    const elp = document.getElementById(`${p.id}p`); // producing eg '50 matter /s'
    const elea = document.getElementById(`${p.id}ea`); // element amount

    if (elg) {
      if (elg.classList.contains("hidden") && this.handleReveal(null, p)) {
        elg.classList.remove("hidden");
        elg.classList.add("fade-in");
        p.revealTime = Date.now() / 1000;
      }

      if (
        elg.classList.contains("fade-in") &&
        Date.now() / 1000 > p.revealTime + 1
      ) {
        elg.classList.remove("fade-in");
      }
    }

    if (ela) ela.innerText = `${p.amount} ${p.plural}`;
    if (elb) elb.innerText = `Buy 1 ${p.name} for ${p.costNow.toString()}`;
    if (elp) elp.innerText = `${p.producesNow.toString()} matter /s`;
    if (elea) elea.innerText = `${p.elementAmount.toFixed(0)} ${p.elementName}`;
  }

  updateUpgradeDisplays(u) {
    const elg = document.getElementById(`${u.id}g`); // group for visibility

    if (elg) {
      if (elg.classList.contains("hidden") && this.handleReveal(u, null)) {
        elg.classList.remove("hidden");
        elg.classList.add("fade-in");
        u.revealTime = Date.now() / 1000;
      }

      if (
        elg.classList.contains("fade-in") &&
        Date.now() / 1000 > u.revealTime + 1
      ) {
        elg.classList.remove("fade-in");
      }
    }
  }

  updateLoop() {
    console.log(gl.gm.producers);
    gl.gm.producers.forEach((p) => {
      this.updateProducerDisplays(p);
    });

    gl.gm.upgrades.forEach((u) => {
      this.updateUpgradeDisplays(u);
    });
  }
}

class GameLoop {
  constructor() {
    this.gm = new Game();
    this.ec = new Economy();
    this.ds = new Display();
  }

  achievementSwitch(type) {
    switch (type) {
      case "producer":
        return this.gm.producers;
      case "upgrade":
        return this.gm.upgrades;
      case "balance":
        return this.ec.balance;
    }
  }

  checkAchievements() {
    achievements.forEach((a) => {
      const source = this.achievementSwitch(a.args.type);
      const obj = source.filter((x) => x.id == a.args.id)[0];
      if (
        (obj.amount && obj.amount >= a.args.amount) ||
        (!obj.amount && obj.bought && !a.achieved)
      ) {
        a.achieved = true;
      }

      if (
        a.achieved &&
        document.getElementById(`ach${a.id}_n`).classList.contains("unachieved")
      ) {
        if (tabs[this.ds.activeTab].id != "achievements") {
          const achTabEl = document.getElementById("achievementsbutton");
          achTabEl.classList.add("pulse");
        }

        const elIds = ["n", "r", "e"];
        elIds.forEach((i) => {
          const el = document.getElementById(`ach${a.id}_${i}`);
          el.classList.remove("unachieved");

          if (i == "e") {
            el.classList.add("glow");
          }
        });
      }
    });
  }

  main() {
    setInterval(() => {
      try {
        this.gm.updateLoop().bind(this);
      } catch {}
    }, 10);
    setInterval(() => {
      try {
        this.ds.updateLoop().bind(this);
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
    setInterval(() => {
      try {
        this.checkAchievements().bind(this);
      } catch {}
    }, 100);
  }
}

let gl = new GameLoop();
gl.main();
