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
    const ele = document.getElementById(`${p.id}e`); // element group

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

    if (ele) {
      if (ele.classList.contains("hidden") && p.amount.gte(1)) {
        ele.classList.remove("hidden");
        ele.classList.add("fade-in");
        p.elementRevealTime = Date.now() / 1000;
      }

      if (
        ele.classList.contains("fade-in") &&
        Date.now() / 1000 > p.elementRevealTime + 1
      ) {
        ele.classList.remove("fade-in");
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
    gl.gm.producers.forEach((p) => {
      this.updateProducerDisplays(p);
    });

    gl.gm.upgrades.forEach((u) => {
      this.updateUpgradeDisplays(u);
    });
  }
}
