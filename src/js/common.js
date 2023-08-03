function f(n) {
  if (typeof n == "string" || !n) {
    return n;
  }

  const ns = n.toString();

  function getLength(n) {
    return n.toString().split(".")[0].length - 1;
  }

  if (n.gte(1e5)) {
    return `${ns[0]}.${ns[1]}${ns[2]}e${getLength(n)}`;
  }

  return n.toFixed(0);
}
