const updateLoopInterval = 25;
const saveGameInterval = 10000;

function f(n, decimals = 2) {
  if (typeof n == "string" || !n) return n;
  if (n.lte(1e3)) return n.toFixed(decimals);

  const ns = n.toString();

  function getLength(n) {
    return n.toString().split(".")[0].length - 1;
  }

  if (n.gte(1e5)) {
    return `${ns[0]}.${ns[1]}${ns[2]}e${getLength(n)}`;
  }

  return n.toFixed(0);
}

function switchAffects(n, o, a) {
  // affect n by a using op o
  if (typeof n == "number") n = new Decimal(n);
  console.log(n, o, a);

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

function saveGame(showMessage = false) {
  const achievementsToSave = achievements.map((a) => {
    return { id: a.id, achieved: a.achieved };
  });
  const producersToSave = producers.map((p) => {
    return { id: p.id, amount: p.amount, elementAmount: p.elementAmount };
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

  const saveTime = document.getElementById("saveTime");
  const d = new Date();
  const t = new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000)
    .toISOString()
    .split("T");
  saveTime.innerText = `Last saved at ${t[0]} ${t[1].split(".")[0]}.`;

  if (showMessage) {
    const saveMessage = document.getElementById("saveMessage");
    saveMessage.innerText = "Saved game successfully!";
  }
}

function getSaveFromStorage() {
  const loadedAchievements = JSON.parse(localStorage.getItem("achievements"));
  const loadedProducers = JSON.parse(localStorage.getItem("producers"));
  const loadedUpgrades = JSON.parse(localStorage.getItem("upgrades"));
  const loadedGeneral = JSON.parse(localStorage.getItem("general"));

  return {
    achievements: loadedAchievements,
    producers: loadedProducers,
    upgrades: loadedUpgrades,
    general: loadedGeneral,
  };
}

function loadSave(data = null) {
  if (!data) data = getSaveFromStorage();
  if (data == {}) return;

  // Achievement save mapping
  data["achievements"]?.forEach((la) => {
    var ca = achievements.filter((a) => a.id == la.id)[0];

    ca["achieved"] = la.achieved;
  });

  // Producers save mapping
  data["producers"]?.forEach((lp) => {
    var cp = producers.filter((p) => p.id == lp.id)[0];

    cp["amount"] = new Decimal(lp.amount);
    cp["elementAmount"] = new Decimal(lp.elementAmount);
  });

  // Upgrades save mapping
  data["upgrades"]?.forEach((lu) => {
    var cu = upgrades.filter((u) => u.id == lu.id)[0];

    cu["bought"] = lu.bought;
  });

  // General save mapping
  if (data.general) {
    gl.ec.balance = new Decimal(data["general"].balance);
  }
}

function exportSave() {
  saveGame();

  const fullLoad = JSON.stringify({
    achievements: JSON.parse(localStorage.getItem("achievements")),
    producers: JSON.parse(localStorage.getItem("producers")),
    upgrades: JSON.parse(localStorage.getItem("upgrades")),
    general: JSON.parse(localStorage.getItem("general")),
  });
  const encodedFullLoad = btoa(fullLoad);

  const saveMessage = document.getElementById("saveMessage");
  try {
    navigator.clipboard.writeText(encodedFullLoad);
    saveMessage.innerText = "Copied save to clipboard!";
  } catch (e) {
    saveMessage.innerText = e;
  }
}

function importSave(encodedData = null) {
  if (!encodedData) {
    const saveDataEntryBox = document.getElementById("saveDataEntry");
    encodedData = saveDataEntryBox.value;
  }

  const saveMessage = document.getElementById("saveMessage");

  try {
    const decodedData = JSON.parse(atob(encodedData));
    if (
      decodedData["achievements"] &&
      decodedData["producers"] &&
      decodedData["upgrades"] &&
      decodedData["general"]
    ) {
      loadSave(decodedData);
      saveMessage.innerText = "Loaded game!";
    }
  } catch (e) {
    if (!encodedData.length) {
      saveMessage.innerText = "No data to load!";
    } else {
      saveMessage.innerText = e;
    }
  }
}

function resetSave() {
  if (
    confirm("Are you sure you want to delete your save? There's no going back!")
  ) {
    localStorage.clear();
    location.reload();
  }
}
