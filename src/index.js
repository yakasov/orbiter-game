class GameLoop {
  constructor() {
    this.gm = new Game();
    this.ec = new Economy();
    this.ds = new Display();
    this.ac = new Achievements();
    this.loadedSave = false;

    this.updateLoopInterval = 10;
    this.saveGameInterval = 10000;
  }

  main() {
    setInterval(() => {
      try {
        // Run game updates @ 10ms
        this.gm.updateLoop().bind(this);
      } catch {}
    }, this.updateLoopInterval);
    setInterval(() => {
      try {
        // Run display updates @ 10ms
        this.ds.updateLoop().bind(this);
      } catch {}
    }, this.updateLoopInterval);
    setInterval(() => {
      try {
        // Run economy updates @ 10ms
        this.ec.updateLoop().bind(this);
      } catch {}
    }, this.updateLoopInterval);

    setInterval(() => {
      try {
        // Run achievement updates @ 100ms
        this.ac.updateLoop().bind(this);
      } catch {}
    }, this.updateLoopInterval * 10);

    setInterval(() => {
      if (loadedGame && !this.loadedSave) {
        loadSave();
        this.loadedSave = true;
      }
    }, this.updateLoopInterval);
    setInterval(saveGame, this.saveGameInterval);
  }
}

let gl = new GameLoop();
gl.main();
