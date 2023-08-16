const rawAchievements = [
  {
    id: 1,
    name: "The First One's Nearly Free",
    reqs: "Own your first producer",
    unlock: function () {
      const p = producers.filter((p) => p.id == "t1_p1")[0];
      return p.amount.gte(1);
    },
  },
  {
    id: 2,
    name: "Union Organised Breaks",
    reqs: "Own your first upgrade",
    unlock: function () {
      const u = upgrades.filter((p) => p.id == "t1_u1")[0];
      return u.bought;
    },
  },
  {
    id: 3,
    name: "Metallic Substances",
    reqs: "Reach Period 2",
    unlock: function () {
      const p = producers.filter((p) => p.id == "t1_p3")[0];
      return p.amount.gte(1);
    },
    bonus: function () {
      gl.gm.producing = gl.gm.producing.mul(1.05);
    },
    bonusDesc: "5% bonus to all production!",
  },
  {
    id: 4,
    name: "Rapid Expansion",
    reqs: "Produce 1000 matter a second",
    unlock: function () {
      return gl.gm.producing.gte(1000);
    },
  },
  {
    id: 5,
    name: "My First Metalloid",
    reqs: "Purchase your first metalloid",
    unlock: function () {
      const p = producers.filter((p) => p.id == "t1_p5")[0];
      return p.amount.gte(1);
    },
  },
];
