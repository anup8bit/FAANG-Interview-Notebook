# 🚀 Day 2 – Practice Set
# Section 1 – Algorithm / DSA

# Q1. Given a string s, return the length of the longest substring without repeating characters.

# Section 2 – Frontend Browser Coding (React)

# Q2. Implement a Debounced Search component in React.

Input field where user types query.

Wait 500ms before firing API call.

Cancel previous API call if typing continues.

Show “Loading…” while fetching.

# Section 3 – JavaScript Polyfill

# Q3. Write a polyfill for Function.prototype.bind.

# Section 4 – Arrays (JS)

Q4. Rotate an array by k steps to the right.

[1,2,3,4,5,6,7], k = 3 → [5,6,7,1,2,3,4]


Q5. Find the intersection of two arrays.

[1,2,2,1], [2,2] → [2,2]

Section 5 – Strings (JS)

Q6. Check if a string is a palindrome, ignoring case and non-alphanumeric characters.

Q7. Find the first unique character in a string.

"leetcode" → "l"
"loveleetcode" → "v"

Section 6 – Promises

Q8. Implement a Promise.race polyfill.

Q9. Predict the output:

console.log("start");

setTimeout(() => console.log("setTimeout"), 0);

Promise.resolve().then(() => console.log("promise"));

console.log("end");

Section 7 – this

Q10.

const person = {
  name: "Alice",
  greet: function() {
    console.log("Hello, " + this.name);
  },
};
setTimeout(person.greet, 1000);


Q11.

var length = 10;
function fn() {
  console.log(this.length);
}
const obj = {
  length: 5,
  method(fn) {
    fn();
    arguments[0]();
  }
};
obj.method(fn, 1);

Section 8 – Snippets

Q12.

console.log(null == undefined);
console.log(null === undefined);


Q13.

console.log([..."hello"]);


Q14.

console.log(+true);
console.log(!"false");


Q15.

console.log(1 < 2 < 3);
console.log(3 > 2 > 1);


Q16.

console.log([] == ![]);
