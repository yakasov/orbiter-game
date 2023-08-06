class Achievements {
  constructor() {
    this.achievementBoosts = [];
    this.achievementGlobalBoosts = [];
  }

  achievementSwitch(type) {
    switch (type) {
      case "producer":
        return gl.gm.producers;
      case "upgrade":
        return gl.gm.upgrades;
      case "balance":
        return gl.ec.balance;
      case "producing":
        return gl.gm.producing;
    }
  }

  checkAchievements() {
    achievements.forEach((a) => {
      const source = this.achievementSwitch(a.args.type);
      const obj = ["balance", "producing"].includes(a.args.type)
        ? { val: source }
        : source.filter((x) => x.id == a.args.id)[0];

      if (
        (obj.amount && obj.amount.gte(new Decimal(a.args.amount))) ||
        obj.bought ||
        (!obj.amount && !obj.bought && obj.val.gte(a.args.amount))
      ) {
        a.achieved = true;
      }

      if (
        a.achieved &&
        document.getElementById(`ach${a.id}_n`).classList.contains("unachieved")
      ) {
        this.markAchievementAsAchieved(a);

        if (a.effs) this.handleAchievementEffects(a);
      }
    });
  }

  markAchievementAsAchieved(a) {
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
        el.innerText = a.effs.desc;
      }
    });
  }

  handleAchievementEffects(a) {
    if (a.effs.type == "producing") {
      this.achievementGlobalBoosts = this.achievementGlobalBoosts.concat({
        op: a.effs.op,
        amount: a.effs.amount,
      });
    }
  }

  updateLoop() {
    this.checkAchievements();
  }
}
