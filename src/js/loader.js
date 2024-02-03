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
    element,
    dividerAbove
  ) {
    this.tab = tab;
    this.id = id;
    this.name = name;
    this.plural = plural;

    this.amount = new Decimal(0);
    this.bonusAmount = new Decimal(0);
    this.costStart = new Decimal(costStart);
    this.costNow = new Decimal(0);
    this.costScale = costScale;
    this.producesFirst = new Decimal(produces);
    this.producesNow = new Decimal(0);

    this.reveal = reveal;
    this.revealTime;

    this.elementName = element.name;
    this.elementAmount = new Decimal(0);
    this.elementRevealTime;

    this.dividerAbove = dividerAbove;
  }
}

class Upgrade {
  constructor(
    tab,
    id,
    name,
    desc,
    cost,
    affects,
    bonus,
    bonusAmountEffect,
    reveal,
    source,
    align
  ) {
    this.tab = tab;
    this.id = id;
    this.affects = affects;
    this.name = name;
    this.desc = desc;

    this.bought = false;
    this.applied = false;

    this.cost = new Decimal(cost);
    this.bonus = bonus;
    this.bonusAmountEffect = bonusAmountEffect;

    this.reveal = reveal;
    this.source = source;
    this.revealTime;

    this.align = align;
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

var producers = [];
var upgrades = [];
var achievements = rawAchievements;
var loadedGame = false;

(async () => {
  function getHTML(i) {
    switch (i.id) {
      case "achievements":
        return `
        <div class="group center" id="achievements_col1">
          <h2>⠀</h2>
        
        </div>
        <div class="group center" id="achievements_col2">
          <h2>Achievements</h2>
          
        </div>
        <div class="group center" id="achievements_col3">
          <h2>⠀</h2>
        
        </div>`;
      case "settings":
        return `
        <div class="group center" id="settings_group">
          <h2>Settings</h2>
        </div>`;
      default:
        return `
        <div class="group" id="${i.id}_content">
          <h2 style="margin: 0;">${i.name}</h2>
        </div>`;
    }
  }

  rawProducers.forEach((p) => {
    const pr = new Producer(
      p.tab,
      p.id,
      p.name,
      p.plural,
      p.costStart,
      p.costScale,
      p.produces,
      p.reveal,
      p.element,
      p.dividerAbove ?? false
    );
    producers = producers.concat(pr);
  });

  rawUpgrades.forEach((u) => {
    const up = new Upgrade(
      u.tab,
      u.id,
      u.name,
      u.desc,
      u.cost,
      u.affects,
      u.bonus,
      u.bonusAmountEffect ?? false,
      u.reveal,
      u.source,
      u.align
    );
    upgrades = upgrades.concat(up);
  });

  const body = document.getElementById("body");
  const topBar = document.getElementById("topBar");

  var tabButtons = "";
  Object.entries(tabs).forEach(([t, i]) => {
    tabButtons += `
  <button class="tab-button ${i.hidden ? "hidden" : ""}" id="${
      i.id
    }button" onclick="gl.ds.showTab(${t})">${i.name}</button>
  `;
  });

  topBar.innerHTML += `
  <div class="tab-bar" id="tab-bar">
    ${tabButtons}
  </div>
  <hr />
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
    const leftGroup = document.getElementById(`${tabs[p.tab].id}_content`);

    if (p.dividerAbove) leftGroup.innerHTML += `<hr style="width:20%" />`;

    leftGroup.innerHTML += `
  <!-- ${p.name}s -->
  <div id="${p.id}Group" class="hidden content-group">
    <div class="left">
      <div class="subgroup">
        <p class="no-margin">${p.name}s</p>
        <div>
          <button id="${p.id}Buy" onclick="gl.gm.buyProducer(${i})">
            Buy 1 ${p.name} for ${f(p.costNow)}
          </button>
          <button id="${p.id}BuyMax" onclick="gl.gm.buyMax(${i})">
            Buy max
          </button>
        </div>
      </div>
      <div class="stat-group">
        <p class="no-margin amount grey glow left" id="${p.id}Amount">0</p>
        <p class="no-margin amount grey glow right" id="${p.id}Producing">0</p>
      </div>
      <div class="stat-group">
        <p class="no-margin amount grey left" id="${p.id}ElementDesc">0</p>
        <p class="no-margin amount grey right" id="${p.id}ElementAmount">0</p>
      </div>
    </div>
  </div>
  `;
  });

  upgrades.forEach((u, i) => {
    const rightGroup = document.getElementById(`${u.align}Group`);

    if (rightGroup.children.length == 2) {
      const ghostGroup = rightGroup.children[0].cloneNode();
      rightGroup.insertAdjacentElement("beforeEnd", ghostGroup);
    }

    rightGroup.innerHTML += `
  <!-- ${u.name}s -->
  <div id="${u.id}Group" class="hidden right">
    <div class="subgroup">
      <button id="${u.id}Buy" onclick="gl.gm.buyUpgrade(${i})">
          Buy Upgrade for ${f(u.cost)}
      </button>
      <p class="no-margin">${u.name}</p>
    </div>
    <div class="stat-group rtl">
      <p class="no-margin amount grey glow" id="${u.id}Amount">
          ${u.desc}
      </p>
    </div>
  </div>
  `;
  });

  const achCols = [
    document.getElementById("achievements_col1"),
    document.getElementById("achievements_col2"),
    document.getElementById("achievements_col3"),
  ];
  rawAchievements.forEach((a, i) => {
    achCols[i % 3].innerHTML += `
    <div id="ach${a.id}Name" class="unachieved dashed achievement">
      <p class="bold">${a.name}</p>
      <p class="amount hidden">${a.reqs}</p>
      <p class="amount hidden glow">${a.bonusDesc ?? ""}</p>
    </div>
  `;
  });

  const settings = document.getElementById("settings_group");
  settings.innerHTML += `
  <div class="center">
      <p id="saveMessage">⠀</p>
      <button onclick="saveGame(true);" style="margin-right: 24px">Manual Save</button>
      <button onclick="exportSave();">Export Save</button>
      <button onclick="importSave();">Import Save</button>
      <input id="saveDataEntry" />
      <button class="scary" onclick="resetSave();" style="margin-left: 24px">Reset Save</button>
      <p id="saveTime">⠀</p>
    </div>
  </div>
  `;

  document.getElementById("period12").classList.remove("hidden");
  loadedGame = true;
})();
