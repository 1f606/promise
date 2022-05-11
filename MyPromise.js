const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function handlePromiseResult (newPromise, result, resolve, reject) {
  if (newPromise === result) return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
  if (result instanceof MyPromise) {
    result.then(resolve, reject);
  } else {
    resolve(result);
  }
}

class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
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
    while (this.successCallback.length) this.successCallback.shift()();
  }
  reject = reason => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    this.reason = reason;
    while (this.failCallback.length) this.failCallback.shift()();
  }
  then (successCb = value => value, failCb = reason => {throw reason}) {
    const newPromise = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const result = successCb(this.value);
            handlePromiseResult(newPromise, result, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const result = failCb(this.reason);
            handlePromiseResult(newPromise, result, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else {
        // pending
        successCb && this.successCallback.push(() => {
          setTimeout(() => {
            try {
              const result = successCb(this.value);
              handlePromiseResult(newPromise, result, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        failCb && this.failCallback.push(() => {
          setTimeout(() => {
            try {
              const result = failCb(this.reason);
              handlePromiseResult(newPromise, result, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return newPromise;
  }
  catch (callback) {
    return this.then(undefined, callback);
  }
  finally (callback) {
    return this.then(value => {
      return MyPromise.resolve(callback()).then(() => value);
    }, error => {
      return MyPromise.resolve(callback()).then(() => { throw error; })
    });
  }
  static all (array) {
    return new MyPromise((resolve, reject) => {
      const result = [];
      let nums = 0;
      function addData (index, data) {
        result[index] = data;
        nums++;
        if (nums === array.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < array.length; i++) {
        if (array[i] instanceof MyPromise) {
          array[i].then(res => addData(i, res), err => addData(i, err));
        } else {
          addData(i, array[i]);
        }
      }
    });
  }
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    } else {
      return new MyPromise(resolve => resolve(value));
    }
  }
}

module.exports = MyPromise;
