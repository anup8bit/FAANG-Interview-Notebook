Array.prototype.filter = function(cb) {
  if (!Array.isArray(this)) {
    throw new Error("Type error");
  }

  const result = [];

  for (let i = 0; i < this.length; i++) {
    if (cb(this[i])) {
      result.push(this[i]);
    }
  }

  return result;
}