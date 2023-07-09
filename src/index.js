var counters = [0];

function increaseCounter(c) {
  counters[c - 1] += 1;
}

function updateCounters() {
  const counter1 = document.getElementById("counter1_amount");
  if (counter1) {
    counter1.innerText = counters[0];
  }
}

setInterval(updateCounters, 10);