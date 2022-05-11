const MyPromise = require('./MyPromise');

const promise = new MyPromise((resolve, reject) => {
  // setTimeout(() => {
  //   resolve(2);
  // }, 2000)
  reject(1);
});

promise.then().then().then(() => {}, error => {
  console.log(error);
});

// promise.then(value => {
//   console.log(value, '第一个promise的success');
//   return 'aaa';
// }, error => {
//   console.log(error);
// }).then(value2 => {
//   console.log(value2, '第二个promise的success');
// }, error => {
//   console.log(error);
// });
