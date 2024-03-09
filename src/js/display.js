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
    const elAmount = document.getElementById(`${p.id}Amount`);
    const elBuy = document.getElementById(`${p.id}Buy`);
    const elGroup = document.getElementById(`${p.id}Group`);
    const elProducing = document.getElementById(`${p.id}Producing`);
    const elElementAmount = document.getElementById(`${p.id}ElementAmount`);
    const elElementDesc = document.getElementById(`${p.id}ElementDesc`);

    if (elGroup) {
      if (elGroup.classList.contains("hidden") && this.showProducer(p)) {
        elGroup.classList.remove("hidden");
        elGroup.classList.add("fade-in");
        p.revealTime = Date.now() / 1000;
      }

      if (
        elGroup.classList.contains("fade-in") &&
        Date.now() / 1000 > p.revealTime + 1
      ) {
        elGroup.classList.remove("fade-in");
      }
    }

    if (elElementAmount && elElementDesc) {
      if (elElementAmount.classList.contains("hidden") && p.amount.gte(1)) {
        elElementAmount.classList.remove("hidden");
        elElementDesc.classList.remove("hidden");
        elElementAmount.classList.add("fade-in");
        elElementDesc.classList.add("fade-in");
        p.elementRevealTime = Date.now() / 1000;
      }

      if (
        elElementAmount.classList.contains("fade-in") &&
        Date.now() / 1000 > p.elementRevealTime + 1
      ) {
        elElementAmount.classList.remove("fade-in");
        elElementDesc.classList.remove("fade-in");
      }
    }

    if (elAmount)
      elAmount.innerText = `${f(p.amount, 0)} ${
        p.bonusAmount.gt(0) ? "(+" + f(p.bonusAmount, 2) + ")" : ""
      } ${p.plural}`;
    if (elBuy) elBuy.innerText = `Buy 1 ${p.name} for ${f(p.costNow)}`;
    if (elProducing) elProducing.innerText = `${f(p.producesNow)} matter /s`;
    if (elElementAmount)
      elElementAmount.innerText = `${f(p.elementAmount)} ${p.elementName}`;
    if (elElementDesc)
      elElementDesc.innerText = `Producing ${f(p.amount.add(p.bonusAmount))} ${
        p.elementName
      } /s`;
  }

  updateUpgradeDisplays(u) {
    const elGroup = document.getElementById(`${u.id}`);
    const elBuy = document.getElementById(`${u.id}`);

    if (elGroup) {
      if (elGroup.classList.contains("hidden") && this.showUpgrade(u)) {
        elGroup.classList.remove("hidden");
        elGroup.classList.add("fade-in");
        u.revealTime = Date.now() / 1000;
      }

      if (
        elGroup.classList.contains("fade-in") &&
        Date.now() / 1000 > u.revealTime + 1
      ) {
        elGroup.classList.remove("fade-in");
      }
    }

    if (elBuy && u.bought) {
      elBuy.querySelectorAll(".amount")[1].innerText = "Bought!";
      elBuy.classList.add("disabled");
      elBuy.classList.add("solid");
      elBuy.classList.remove("dashed");
      elBuy.setAttribute("disabled", true);
    }
  }

  showProducer(p) {
    // Return true if the previous producer has been bought.
    return producers[
      (producers.indexOf(p) + producers.length - 1) % producers.length
    ].amount.gte(1);
  }

  showUpgrade(u) {
    /* 
    Return true if the aligned producer has been bought.
    If more than one upgrade is aligned to a producer,
    return true if:
    - it's also the first upgrade or
    - it's not the first upgrade but the previous has been bought. 
    */
    var alignedUpgrades = upgrades.filter((anyU) => anyU.align == u.align);
    return (
      getProducer(u.align).amount.gte(1) &&
      (alignedUpgrades.length > 1
        ? alignedUpgrades.indexOf(u) == 0 ||
          upgrades[alignedUpgrades.indexOf(u) - 1].bought
        : true)
    );
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
