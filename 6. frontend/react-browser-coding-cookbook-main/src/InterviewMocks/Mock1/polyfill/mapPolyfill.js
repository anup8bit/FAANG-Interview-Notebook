const myMap = Array.prototype.map || function(cb) {
  const arr = [];
  this.forEach((item) => {
    arr.push(cb(item));
  });
  return arr;
}

Array.prototype.map = myMap;