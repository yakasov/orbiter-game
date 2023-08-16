const rawProducers = [
  {
    tab: 1,
    id: "t1_p1",
    name: "Hydrogen Gatherer",
    plural: "gatherers",
    costStart: 10,
    costScale: 1.05,
    produces: 1,
    reveal: () => {
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
    reveal: () => {
      return gl.ec.balance.gte(100);
    },
    element: {
      name: "He",
    },
    spacesBelow: 1,
  },
  {
    tab: 1,
    id: "t1_p3",
    name: "Lithium Miner",
    plural: "miners",
    costStart: 7500,
    costScale: 1.05,
    produces: 250,
    reveal: () => {
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
    plural: "miners",
    costStart: 40000,
    costScale: 1.05,
    produces: 1250,
    reveal: () => {
      return gl.ec.balance.gte(20000);
    },
    element: {
      name: "Be",
    },
  },
];
