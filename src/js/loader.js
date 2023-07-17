class Producer {
  constructor(tab, id, name, plural, costStart, costScale, produces, reveal) {
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
  }
}

const tabs = {
  1: {
    id: "period12",
    name: "Periods 1 and 2",
  },
  2: {
    id: "period3",
    name: "Period 3",
  },
  3: {
    id: "period4",
    name: "Period 4",
  },
};

async function loadJson(l) {
  return fetch(l).then((r) => r.json());
}

var producers = [];
var upgrades = [];

(async () => {
  const loadedProducers = await loadJson("./src/producers.json");
  const loadedUpgrades = await loadJson("./src/upgrades.json");

  loadedProducers.forEach((p) => {
    const pr = new Producer(
      p.tab,
      p.id,
      p.name,
      p.plural,
      p.costStart,
      p.costScale,
      p.produces,
      p.reveal
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
  Object.entries(tabs).forEach(([t, i]) => {
    body.innerHTML += `
  <!-- ${i.name} Tab -->
  <div class="tab hidden" id="${i.id}">
    <div class="group left-group" id="${i.id}_producers">
        <h2>${i.name}</h2>
    </div>
    <div class="group"></div>
    <div class="group right-group" id="${i.id}_upgrades">
        <h2>${i.name} Upgrades</h2>
    </div>
  </div>
  `;
  });

  producers.forEach((p, i) => {
    const group = document.getElementById(`${tabs[p.tab].id}_producers`);
    group.innerHTML += `
  <!-- ${p.name}s -->
  <div id="${p.id}g" class="hidden">
    <div class="subgroup">
        <p class="inline push-right">${p.name}s</p>
        <button id="${p.id}b" onclick="gl.gm.buyProducer(${i})">
            Buy 1 ${p.name} for ${p.costNow}
        </button>
    </div>
    <div class="stat-group">
        <p class="inline amount grey glow" style="margin-left: 0" id="${p.id}a">0</p>
        <p class="inline amount grey glow" id="${p.id}p">0</p>
    </div>
  </div>
  `;
  });

  upgrades.forEach((u, i) => {
    const group = document.getElementById(`${tabs[u.tab].id}_upgrades`);
    group.innerHTML += `
  <!-- ${u.name}s -->
  <div id="${u.id}g" class="hidden">
      <div class="subgroup">
          <button id="${u.id}b" class="push-right" onclick="gl.gm.buyUpgrade(${i})">
              Buy Upgrade for ${u.cost}
          </button>
          <p class="inline">${u.name}</p>
      </div>
      <div class="stat-group">
          <p class="inline amount grey glow" style="margin-left: 0" id="${u.id}p">
              ${u.desc}
          </p>
          <p class="inline amount grey glow" id="${u.id}a">
              ${u.subdesc}
          </p>
      </div>
  </div>
  `;
  });

  document.getElementById("period12").classList.remove("hidden");
  //document.getElementById("t1_c1pg").classList.remove("hidden");
})();
