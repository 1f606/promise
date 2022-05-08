const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
    // 在这里定义实例属性，resolve方法不会执行
    console.log(this);
  }
  status = PENDING;
  value = undefined;
  reason = undefined;
  resolve = value => {
    console.log(this);
    if (this.status !== PENDING) return;
    this.status = FULFILLED;
    this.value = value;
  }
  reject = reason => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    this.reason = reason;
  }
  then (successCb, failCb) {
    if (this.status === FULFILLED) {
      successCb(this.value);
    } else if (this.status === REJECTED) {
      failCb(this.reason);
    }
  }
}

module.exports = MyPromise;
