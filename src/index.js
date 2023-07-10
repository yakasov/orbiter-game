class Tier1 {
  constructor() {
    this.counters = [
      { n: "counter1_amount", a: new Decimal(0) },
      { n: "counter2_amount", a: new Decimal(0) },
    ];
  }

  increaseCounter(c) {
    this.counters[c - 1].a = this.counters[c - 1].a.plus(1);
  }

  updateCounters() {
    this.counters.forEach((c) => {
      const el = document.getElementById(c.n);
      el.innerText = c.a;
    });
  }

  loop() {}
}

class GameLoop {
  constructor() {
    this.t1 = new Tier1();
  }

  main() {
    setInterval(() => {
      this.t1.updateCounters().bind(this);
    }, 10);
  }
}

let gl = new GameLoop();
gl.main();
