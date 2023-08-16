const rawUpgrades = [
  {
    tab: 1,
    id: "t1_u1",
    align: "t1_p1",
    name: "Hydrogen Coffee Breaks",
    desc: "2x Hydrogen Gatherers speed",
    subdesc: "Motivate your little gatherers",
    cost: 100,
    affects: function () {
      const ps = ["t1_p1"];
      return ps.map((pid) => producers.filter((p) => p.id == pid)[0]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.producesFirst = p.producesFirst.mul(2);
      });
    },
    reveal: function () {
      const s = this.source ? this.source() : this.affects();
      return s.every((p) => {
        return p.amount.gte(2);
      });
    },
  },
  {
    tab: 1,
    id: "t1_u2",
    align: "t1_p2",
    name: "Hunter Bow Strengthening",
    desc: "-0.06 Helium Hunters cost scale",
    subdesc: "Improve hunter bows, decreasing replacement costs",
    cost: 1500,
    affects: function () {
      const ps = ["t1_p2"];
      return ps.map((pid) => producers.filter((p) => p.id == pid)[0]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.costScale -= 0.06;
      });
    },
    reveal: function () {
      const s = this.source ? this.source() : this.affects();
      return s.every((p) => {
        return p.amount.gte(2);
      });
    },
  },
  {
    tab: 1,
    id: "t1_u3",
    align: "t1_p2",
    name: "Period 1 Discounts",
    desc: "-0.04 Gatherer + Hunter cost scale",
    subdesc: "Work out a deal for some cheaper collectors",
    cost: 5000,
    affects: function () {
      const ps = ["t1_p1", "t1_p2"];
      return ps.map((pid) => producers.filter((p) => p.id == pid)[0]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.costScale -= 0.04;
      });
    },
    reveal: function () {
      const s = this.source ? this.source() : this.affects();
      return s.every((p) => {
        return p.amount.gte(5);
      });
    },
  },
  {
    tab: 1,
    id: "t1_u4",
    align: "t1_p3",
    name: "Gatherer Energizing",
    desc: "Lithium boosts Gatherer amount (2Li => H)",
    subdesc: "Not related to a certain rabbit",
    cost: 50000,
    affects: function () {
      const ps = ["t1_p1"];
      return ps.map((pid) => producers.filter((p) => p.id == pid)[0]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.bonusAmount = this.source()[0].elementAmount.mul(0.5);
      });
    },
    bonusAmountEffect: true,
    reveal: function () {
      const s = this.source ? this.source() : this.affects();
      return s.every((p) => {
        return p.amount.gte(5);
      });
    },
    source: function () {
      const ps = ["t1_p3"];
      return ps.map((pid) => producers.filter((p) => p.id == pid)[0]);
    },
  },
  {
    tab: 1,
    id: "t1_u5",
    align: "t1_p4",
    name: "Miner Reinforcements",
    desc: "3x Lithum Miner speed",
    subdesc: "Beryllium pickaxes are better than nothing",
    cost: 50000,
    affects: function () {
      const ps = ["t1_p3"];
      return ps.map((pid) => producers.filter((p) => p.id == pid)[0]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.producesFirst = p.producesFirst.mul(3);
      });
    },
    reveal: function () {
      const s = this.source ? this.source() : this.affects();
      return s.every((p) => {
        return p.amount.gte(2);
      });
    },
    source: function () {
      const ps = ["t1_p4"];
      return ps.map((pid) => producers.filter((p) => p.id == pid)[0]);
    },
  },
  {
    tab: 1,
    id: "t1_u6",
    align: "t1_p5",
    name: "Helium Retention",
    desc: "Boron boosts Hunter amount (2B => He)",
    subdesc: "Excess boron can strengthen helium structures",
    cost: 1e6,
    affects: function () {
      const ps = ["t1_p2"];
      return ps.map((pid) => producers.filter((p) => p.id == pid)[0]);
    },
    bonus: function () {
      this.affects().forEach((p) => {
        p.bonusAmount = this.source()[0].elementAmount.mul(0.5);
      });
    },
    bonusAmountEffect: true,
    reveal: function () {
      const s = this.source ? this.source() : this.affects();
      return s.every((p) => {
        return p.amount.gte(1);
      });
    },
    source: function () {
      const ps = ["t1_p5"];
      return ps.map((pid) => producers.filter((p) => p.id == pid)[0]);
    },
  },
];
