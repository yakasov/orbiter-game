function getAffects(ps) {
  return ps.map((pid) => getProducer(pid));
}

const rawUpgrades = [
  {
    tab: 1,
    id: "t1_u1",
    align: "t1_p1",
    name: "Hydrogen Coffee Breaks",
    desc: "2x Hydrogen Gatherers speed",
    cost: 100,
    affects: function () {
      return getAffects(["t1_p1"]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.producesFirst = p.producesFirst.mul(2);
      });
    },
  },
  {
    tab: 1,
    id: "t1_u2",
    align: "t1_p1",
    name: "Hunter Bow Strengthening",
    desc: "Decrease Helium Hunters cost scaling",
    cost: 1500,
    affects: function () {
      return getAffects(["t1_p2"]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.costScale -= 0.07;
      });
    },
  },
  {
    tab: 1,
    id: "t1_u3",
    align: "t1_p1",
    name: "Period 1 Discounts",
    desc: "Decrease Gatherer and Hunter cost scaling further",
    cost: 5000,
    affects: function () {
      return getAffects(["t1_p1", "t1_p2"]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.costScale -= 0.05;
      });
    },
  },
  {
    tab: 1,
    id: "t1_u4",
    align: "t1_p2",
    name: "Gatherer Energizing",
    desc: "Lithium boosts Gatherer amount (4Li => 3H)",
    cost: 50000,
    affects: function () {
      return getAffects(["t1_p1"]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.bonusAmount = getAffects(["t1_p3"])[0].elementAmount.mul(0.75);
      });
    },
    bonusAmountEffect: true,
    reveal: function () {
      return getReveal(getAffects(["t1_p3"]), 2);
    },
  },
  {
    tab: 1,
    id: "t1_u5",
    align: "t1_p2",
    name: "Miner Reinforcements",
    desc: "3x Lithum Miner speed",
    cost: 50000,
    affects: function () {
      return getAffects(["t1_p3"]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.producesFirst = p.producesFirst.mul(3);
      });
    },
  },
  {
    tab: 1,
    id: "t1_u6",
    align: "t1_p2",
    name: "Helium Retention",
    desc: "Boron boosts Hunter amount (4B => 3He)",
    cost: 1e6,
    affects: function () {
      return getAffects(["t1_p2"]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.bonusAmount = getAffects(["t1_p5"])[0].elementAmount.mul(0.75);
      });
    },
    bonusAmountEffect: true,
  },
];
