class Economy {
  constructor() {
    this.balance = new Decimal(10);
  }

  addToBalance(a) {
    this.balance = this.balance.add(a);
  }

  removeFromBalance(a) {
    this.balance = this.balance.sub(a);
  }

  displayBalance() {
    const el = document.getElementById("mainBalance");
    el.innerText = `You have ${f(this.balance)} matter.`;
  }

  displayProducing() {
    const producing = gl.gm.producing;
    const el = document.getElementById("producingBalance");
    el.innerText = `producing ${f(producing)} matter /s`;
  }

  updateLoop() {
    this.displayBalance();
    this.displayProducing();
  }
}
