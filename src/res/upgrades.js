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
    align: "t1_p2",
    name: "Hunter Bow Strengthening",
    desc: "-0.06 Helium Hunters cost scale",
    cost: 1500,
    affects: function () {
      return getAffects(["t1_p2"]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.costScale -= 0.06;
      });
    },
  },
  {
    tab: 1,
    id: "t1_u3",
    align: "t1_p2",
    name: "Period 1 Discounts",
    desc: "-0.04 Gatherer + Hunter cost scale",
    cost: 5000,
    affects: function () {
      return getAffects(["t1_p1", "t1_p2"]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.costScale -= 0.04;
      });
    },
  },
  {
    tab: 1,
    id: "t1_u4",
    align: "t1_p3",
    name: "Gatherer Energizing",
    desc: "Lithium boosts Gatherer amount (2Li => H)",
    cost: 50000,
    affects: function () {
      return getAffects(["t1_p1"]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.bonusAmount = getAffects(["t1_p3"])[0].elementAmount.mul(0.5);
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
    align: "t1_p4",
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
    align: "t1_p5",
    name: "Helium Retention",
    desc: "Boron boosts Hunter amount (2B => He)",
    cost: 1e6,
    affects: function () {
      return getAffects(["t1_p2"]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.bonusAmount = getAffects(["t1_p5"])[0].elementAmount.mul(0.5);
      });
    },
    bonusAmountEffect: true,
  },
];
