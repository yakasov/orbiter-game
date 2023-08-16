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
        gl.ac.achievementsChecked = true;
      }
    }
  }

  updateProducerDisplays(p) {
    const ela = document.getElementById(`${p.id}a`); // amount eg '12 quarks'
    const elb = document.getElementById(`${p.id}b`); // button string
    const elg = document.getElementById(`${p.id}g`); // group for visibility
    const elp = document.getElementById(`${p.id}p`); // producing eg '50 matter /s'
    const elea = document.getElementById(`${p.id}ea`); // element amount
    const ele = document.getElementById(`${p.id}e`); // element group

    if (elg) {
      if (elg.classList.contains("hidden") && p.reveal()) {
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

    if (ela)
      ela.innerText = `${f(p.amount, 0)} ${
        p.bonusAmount.gt(0) ? "(+" + f(p.bonusAmount, 2) + ")" : ""
      } ${p.plural}`;
    if (elb) elb.innerText = `Buy 1 ${p.name} for ${f(p.costNow)}`;
    if (elp) elp.innerText = `${f(p.producesNow)} matter /s`;
    if (elea) elea.innerText = `${f(p.elementAmount)} ${p.elementName}`;
  }

  updateUpgradeDisplays(u) {
    const elg = document.getElementById(`${u.id}g`); // group for visibility
    const elub = document.getElementById(`${u.id}b`); // button

    if (elg) {
      if (elg.classList.contains("hidden") && u.reveal()) {
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

    if (elub && u.bought) {
      elub.innerText = "Bought!";
      elub.classList.add("disabled");
      elub.setAttribute("disabled", true);
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
