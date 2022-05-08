const MyPromise = require('./MyPromise');

const promise = new MyPromise(resolve => {
  setTimeout(() => {
    resolve(2);
  }, 2000)
});

promise.then(value => {
  console.log(value);
});
