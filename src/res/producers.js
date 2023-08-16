const rawProducers = [
  {
    tab: 1,
    id: "t1_p1",
    name: "Hydrogen Gatherer",
    plural: "gatherers",
    costStart: 10,
    costScale: 1.05,
    produces: 1,
    reveal: function () {
      return true;
    },
    element: {
      name: "H",
    },
  },
  {
    tab: 1,
    id: "t1_p2",
    name: "Helium Hunter",
    plural: "hunters",
    costStart: 200,
    costScale: 1.09,
    produces: 10,
    reveal: function () {
      return gl.ec.balance.gte(100);
    },
    element: {
      name: "He",
    },
  },
  {
    tab: 1,
    id: "t1_p3",
    name: "Lithium Miner",
    plural: "miners",
    costStart: 5000,
    costScale: 1.05,
    produces: 125,
    reveal: function () {
      return gl.gm.producing.gte(100);
    },
    element: {
      name: "Li",
    },
    dividerAbove: true,
  },
  {
    tab: 1,
    id: "t1_p4",
    name: "Beryllium Forager",
    plural: "foragers",
    costStart: 40000,
    costScale: 1.05,
    produces: 750,
    reveal: function () {
      return gl.ec.balance.gte(20000);
    },
    element: {
      name: "Be",
    },
  },
  {
    tab: 1,
    id: "t1_p5",
    name: "Boron Borer",
    plural: "borers",
    costStart: 3.5e5,
    costScale: 1.03,
    produces: 3500,
    reveal: function () {
      return gl.ec.balance.gte(1e5);
    },
    element: {
      name: "B",
    },
  },
];
