class GameLoop {
  constructor() {
    this.gm = new Game();
    this.ec = new Economy();
    this.ds = new Display();
    this.ac = new Achievements();
    this.loadedSave = false;

    this.ignoreMessage = "Cannot read properties of undefined (reading 'bind')";
  }

  main() {
    setInterval(() => {
      try {
        // Run game updates
        this.gm.updateLoop().bind(this);
      } catch (e) {
        if (e.message != this.ignoreMessage) {
          console.error(e);
        }
      }
    }, updateLoopInterval);
    setInterval(() => {
      try {
        // Run display updates
        this.ds.updateLoop().bind(this);
      } catch (e) {
        if (e.message != this.ignoreMessage) {
          console.error(e);
        }
      }
    }, updateLoopInterval);
    setInterval(() => {
      try {
        // Run economy updates
        this.ec.updateLoop().bind(this);
      } catch (e) {
        if (e.message != this.ignoreMessage) {
          console.error(e);
        }
      }
    }, updateLoopInterval);

    setInterval(() => {
      try {
        // Run achievement updates @ 100ms
        this.ac.updateLoop().bind(this);
      } catch (e) {
        if (e.message != this.ignoreMessage) {
          console.error(e);
        }
      }
    }, 100);

    setInterval(() => {
      if (loadedGame && !this.loadedSave) {
        loadSave();
        this.loadedSave = true;
      }
    }, updateLoopInterval);
    setInterval(saveGame, saveGameInterval);
  }
}

let gl = new GameLoop();
gl.main();
