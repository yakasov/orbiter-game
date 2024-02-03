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
        document
          .getElementById(`ach${a.id}Name`)
          .classList.contains("unachieved")
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

    const el = document.getElementById(`ach${a.id}Name`);
    el.classList.remove("unachieved");
    el.classList.remove("dotted");
    el.classList.add("solid");
  }

  updateLoop() {
    this.checkAchievements();
  }
}
