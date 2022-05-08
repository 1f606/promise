const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function handlePromiseResult (result, resolve, reject) {
  if (result instanceof MyPromise) {
    result.then(resolve, reject);
  } else {
    resolve(result);
  }
}

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
    // 在这里定义实例属性，resolve方法不会执行
  }
  status = PENDING;
  value = undefined;
  reason = undefined;
  successCallback = [];
  failCallback = [];
  resolve = value => {
    if (this.status !== PENDING) return;
    this.status = FULFILLED;
    this.value = value;
    while (this.successCallback.length) this.successCallback.shift()(this.value);
  }
  reject = reason => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    this.reason = reason;
    while (this.failCallback.length) this.failCallback.shift()(this.reason);
  }
  then (successCb, failCb) {
    return new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        const result = successCb(this.value);
        handlePromiseResult(result, resolve, reject);
      } else if (this.status === REJECTED) {
        reject(failCb(this.reason));
      } else {
        // pending
        successCb && this.successCallback.push(successCb);
        failCb && this.failCallback.push(failCb);
      }
    })
  }
}

module.exports = MyPromise;
