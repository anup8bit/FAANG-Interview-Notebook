const obj = {
  value: 10,
  getValue() {
    return this.value;
  }
};

const fn = obj.getValue;

console.log(fn());
console.log(obj.getValue());

const bound = fn.bind(obj);
console.log(bound());


let a = { n: 1 };
let b = a;

a.x = a = { n: 2 };

console.log(a.x);
console.log(b.x);
