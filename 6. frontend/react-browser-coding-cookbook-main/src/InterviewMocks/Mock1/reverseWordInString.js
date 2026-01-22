function reverseWord(s) {
  let res = "";
  let tempStr = "";
  let stack = [];
  for(let ch of s) {
    if(ch === " ") {
      if (tempStr !== "") {
        stack.push(tempStr);
      }
      tempStr = "";
    } else {
      tempStr += ch;
    }
  }

  if (tempStr !== "") stack.push(tempStr);

  while (stack.length > 0) {
    res += stack.pop() + " ";
  }

  return res.substr(0, res.length-1);
}