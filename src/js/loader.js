class Producer {
  constructor(
    tab,
    id,
    name,
    plural,
    costStart,
    costScale,
    produces,
    reveal,
    element
  ) {
    this.tab = tab;
    this.id = id;
    this.name = name;
    this.plural = plural;

    this.amount = new Decimal(0);
    this.costStart = new Decimal(costStart);
    this.costNow = new Decimal(0);
    this.costScale = costScale;
    this.producesFirst = new Decimal(produces);
    this.producesNow = new Decimal(0);

    this.revealType = reveal.type;
    this.revealAmount = reveal.amount;
    this.revealTime;

    this.elementName = element.name;
    this.elementAmount = new Decimal(0);
    this.elementRevealTime;
  }
}

class Upgrade {
  constructor(tab, id, affects, name, desc, subdesc, cost, bonus, reveal) {
    this.tab = tab;
    this.id = id;
    this.affects = affects;
    this.name = name;
    this.desc = desc;
    this.subdesc = subdesc;

    this.bought = false;
    this.applied = false;

    this.cost = new Decimal(cost);
    this.bonusType = bonus.type;
    this.bonusOp = bonus.op;
    this.bonusAmount = bonus.amount;

    this.revealType = reveal.type;
    this.revealAmount = reveal.amount;
    this.revealTime;
  }
}

var tabs = {
  1: {
    id: "period12",
    name: "Periods 1 and 2",
    hidden: false,
  },
  2: {
    id: "period3",
    name: "Period 3",
    hidden: true,
  },
  3: {
    id: "period4",
    name: "Period 4",
    hidden: true,
  },
  4: {
    id: "period5",
    name: "Period 5",
    hidden: true,
  },
  5: {
    id: "period6",
    name: "Period 6",
    hidden: true,
  },
  6: {
    id: "period7",
    name: "Period 7",
    hidden: true,
  },
  7: {
    id: "achievements",
    name: "Achievements",
    hidden: false,
  },
  8: {
    id: "settings",
    name: "Settings",
    hidden: false,
  },
};

async function loadJson(l) {
  return fetch(l).then((r) => r.json());
}

function getHTML(i) {
  switch (i.id) {
    case "achievements":
      return `
      <div class="group center" id="achievements_names">
        <h2>⠀</h2>
        <h3>Name</h3>
      </div>
      <div class="group center" id="achievements_reqs">
        <h2>Achievements</h2>
        <h3>Requirements</h3>
      </div>
      <div class="group center" id="achievements_effs">
        <h2>⠀</h2>
        <h3>Effects</h3>
      </div>`;
    case "settings":
      return `
      <div class="group center" id="settings_group">
        <h2>Settings</h2>
      </div>`;
    default:
      return `
      <div class="group left-group" id="${i.id}_producers">
        <h2>${i.name}</h2>
      </div>
      <div class="group center-group" id="${i.id}_elements">
        <h2>Elements</h2>
      </div>
      <div class="group right-group" id="${i.id}_upgrades">
        <h2>${i.name} Upgrades</h2>
      </div>`;
  }
}

var producers = [];
var upgrades = [];
var achievements = [];
var loadedGame = false;

(async () => {
  const loadedProducers = await loadJson("./src/res/producers.json");
  const loadedUpgrades = await loadJson("./src/res/upgrades.json");
  achievements = await loadJson("./src/res/achievements.json");

  loadedProducers.forEach((p) => {
    const pr = new Producer(
      p.tab,
      p.id,
      p.name,
      p.plural,
      p.costStart,
      p.costScale,
      p.produces,
      p.reveal,
      p.element
    );
    producers = producers.concat(pr);
  });

  loadedUpgrades.forEach((u) => {
    const up = new Upgrade(
      u.tab,
      u.id,
      u.affects,
      u.name,
      u.desc,
      u.subdesc,
      u.cost,
      u.bonus,
      u.reveal
    );
    upgrades = upgrades.concat(up);
  });

  const body = document.getElementById("body");
  var tabButtons = "";
  Object.entries(tabs).forEach(([t, i]) => {
    tabButtons += `
  <button class="tab-button ${i.hidden ? "hidden" : ""}" id="${
      i.id
    }button" onclick="gl.ds.showTab(${t})">${i.name}</button>
  `;
  });

  body.innerHTML += `
  <div class="tab-bar" id="tab-bar">
    ${tabButtons}
  </div>
  `;

  Object.entries(tabs).forEach(([t, i]) => {
    body.innerHTML += `
  <!-- ${i.name} Tab -->
  <div class="tab hidden" id="${i.id}">
    ${getHTML(i)}
  </div>
  `;
  });

  producers.forEach((p, i) => {
    const leftGroup = document.getElementById(`${tabs[p.tab].id}_producers`);
    leftGroup.innerHTML += `
  <!-- ${p.name}s -->
  <div id="${p.id}g" class="hidden">
    <div class="subgroup">
      <p class="inline push-right">${p.name}s</p>
      <button id="${p.id}b" onclick="gl.gm.buyProducer(${i})">
          Buy 1 ${p.name} for ${p.costNow}
      </button>
    </div>
    <div class="stat-group">
      <p class="inline amount grey glow left" id="${p.id}a">0</p>
      <p class="inline amount grey glow right" id="${p.id}p">0</p>
    </div>
  </div>
  `;

    const centerGroup = document.getElementById(`${tabs[p.tab].id}_elements`);
    centerGroup.innerHTML += `
  <div class="hidden" id="${p.id}e">
    <div class="subgroup" style="display: block">
      <p class="center inline" id="${p.id}ea">0</p>
    </div>
  </div>
  `;
  });

  upgrades.forEach((u, i) => {
    const rightGroup = document.getElementById(`${tabs[u.tab].id}_upgrades`);
    rightGroup.innerHTML += `
  <!-- ${u.name}s -->
  <div id="${u.id}g" class="hidden">
    <div class="subgroup">
      <button id="${u.id}b" class="push-right" onclick="gl.gm.buyUpgrade(${i})">
          Buy Upgrade for ${u.cost}
      </button>
      <p class="inline">${u.name}</p>
    </div>
    <div class="stat-group">
      <p class="inline amount grey glow left" id="${u.id}p">
          ${u.desc}
      </p>
      <p class="inline amount grey glow right" id="${u.id}a">
          ${u.subdesc}
      </p>
    </div>
  </div>
  `;
  });

  const achNames = document.getElementById("achievements_names");
  const achReqs = document.getElementById("achievements_reqs");
  const achEffs = document.getElementById("achievements_effs");
  achievements.forEach((a) => {
    achNames.innerHTML += `
  <p id="ach${a.id}_n" class="unachieved">${a.id}: ${a.name}</p>
  `;
    achReqs.innerHTML += `
  <p id="ach${a.id}_r" class="unachieved">${a.reqs}</p>
  `;
    achEffs.innerHTML += `
  <p id="ach${a.id}_e" class="unachieved">${a.effs}</p>
  `;
  });

  const settings = document.getElementById("settings_group");
  settings.innerHTML += `
  <div class="center">
    <div>
      <p id="saveMessage">⠀</p>
    </div>
    <div>
      <button onclick="exportSave();">Export Save</button>
      <button onclick="importSave();">Import Save</button>
      <input id="saveDataEntry" />
      <button class="scary" onclick="resetSave();">Reset Save</button>
    </div>
  </div>
  `;

  document.getElementById("period12").classList.remove("hidden");
  loadedGame = true;
})();
