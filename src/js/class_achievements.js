class Achievements {
  constructor() {
    this.achievementBoosts = [];
    this.achievementGlobalBoosts = [];
  }

  checkAchievements() {
    achievements.forEach((a) => {
      if (a.unlock()) {
        a.achieved = true;
      }

      if (
        a.achieved &&
        document.getElementById(`ach${a.id}_n`).classList.contains("unachieved")
      ) {
        this.markAchievementAsAchieved(a);

        if (a.bonus)
          this.achievementGlobalBoosts = this.achievementGlobalBoosts.concat(a);
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
        el.innerText = a.bonusDesc ?? "⠀";
      }
    });
  }

  updateLoop() {
    this.checkAchievements();
  }
}
