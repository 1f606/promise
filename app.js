const MyPromise = require('./MyPromise');

const promise = new MyPromise(resolve => {
  resolve(2);
});

promise.then(value => {
  console.log(value);
});
