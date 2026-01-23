Promise.resolve()
  .then(() => {
    console.log(1);
    return Promise.resolve(2);
  })
  .then(console.log);

Promise.resolve()
  .then(() => {
    console.log(3);
  });
