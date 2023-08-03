function f(n) {
  if (typeof n == "string" || !n) {
    return n;
  }

  const ns = n.toString();

  function getLength(n) {
    return n.toString().split(".")[0].length - 1;
  }

  if (n.gte(1e5)) {
    return `${ns[0]}.${ns[1]}${ns[2]}e${getLength(n)}`;
  }

  return n.toFixed(0);
}

function saveGame() {
  const achievementsToSave = achievements.map((a) => {
    return { id: a.id, achieved: a.achieved };
  });
  const producersToSave = producers.map((p) => {
    return { id: p.id, amount: p.amount };
  });
  const upgradesToSave = upgrades.map((u) => {
    return { id: u.id, bought: u.bought };
  });
  const generalToSave = {
    balance: gl.ec.balance,
  };

  localStorage.setItem("achievements", JSON.stringify(achievementsToSave));
  localStorage.setItem("producers", JSON.stringify(producersToSave));
  localStorage.setItem("upgrades", JSON.stringify(upgradesToSave));
  localStorage.setItem("general", JSON.stringify(generalToSave));
}

function loadSave() {
  const loadedAchievements = JSON.parse(localStorage.getItem("achievements"));
  const loadedProducers = JSON.parse(localStorage.getItem("producers"));
  const loadedUpgrades = JSON.parse(localStorage.getItem("upgrades"));
  const loadedGeneral = JSON.parse(localStorage.getItem("general"));

  loadedAchievements?.forEach((la) => {
    achievements.filter((a) => a.id == la.id)[0]["achieved"] = la.achieved;
  });
  loadedProducers?.forEach((lp) => {
    producers.filter((p) => p.id == lp.id)[0]["amount"] = new Decimal(
      lp.amount
    );
  });
  loadedUpgrades?.forEach((lu) => {
    upgrades.filter((u) => u.id == lu.id)[0]["bought"] = lu.bought;
  });
  gl.ec.balance = new Decimal(loadedGeneral.balance);
}
