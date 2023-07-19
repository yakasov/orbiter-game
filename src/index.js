class GameLoop {
  constructor() {
    this.gm = new Game();
    this.ec = new Economy();
    this.ds = new Display();
    this.ac = new Achievements();
  }

  main() {
    setInterval(() => {
      try {
        this.gm.updateLoop().bind(this);
      } catch {}
    }, 10);
    setInterval(() => {
      try {
        this.ds.updateLoop().bind(this);
      } catch {}
    }, 10);
    setInterval(() => {
      try {
        this.ec.updateLoop().bind(this);
      } catch {}
    }, 10);

    setInterval(() => {
      try {
        this.ac.updateLoop().bind(this);
      } catch {}
    }, 100);
  }
}

let gl = new GameLoop();
gl.main();
