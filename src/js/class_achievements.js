class Achievements {
  constructor() {}

  achievementSwitch(type) {
    switch (type) {
      case "producer":
        return gl.gm.producers;
      case "upgrade":
        return gl.gm.upgrades;
      case "balance":
        return gl.ec.balance;
    }
  }

  checkAchievements() {
    achievements.forEach((a) => {
      const source = this.achievementSwitch(a.args.type);
      const obj = source.filter((x) => x.id == a.args.id)[0];
      if (
        (obj.amount && obj.amount >= a.args.amount) ||
        (!obj.amount && obj.bought && !a.achieved)
      ) {
        a.achieved = true;
      }

      if (
        a.achieved &&
        document.getElementById(`ach${a.id}_n`).classList.contains("unachieved")
      ) {
        if (tabs[gl.ds.activeTab].id != "achievements") {
          const achTabEl = document.getElementById("achievementsbutton");
          achTabEl.classList.add("pulse");
        }

        const elIds = ["n", "r", "e"];
        elIds.forEach((i) => {
          const el = document.getElementById(`ach${a.id}_${i}`);
          el.classList.remove("unachieved");

          if (i == "e") {
            el.classList.add("glow");
          }
        });
      }
    });
  }

  updateLoop() {
    this.checkAchievements();
  }
}
