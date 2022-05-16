
/* 手写bind */
Function.prototype.myBind = function (context, ...args) {
  if (!context) {
    context = globalThis;
  }
  const fn = this;

  const result = function (...newArgs) {
    if (this instanceof result) {
      return new fn(...args, ...newFnArgs)
    }
    return fn.apply(context, [...args, ...newFnArgs])
  }

  return result;
}

// 手写call
Function.prototype.myCall = function (context, ...args) {
  if (!context) {
    context = globalThis;
  }
  context.fn = this;

  const result = context.fn(...args);
  delete context.fn

  return result;

}

// 手写apply
Function.prototype.myApply = function (context, args) {
  if (!context) {
    context = globalThis;
  }
  context.fn = this;

  const result = context.fn(...args);
  delete context.fn

  return result;

}

// 手写promise.all 
function promiseAll(promiseArr) {
  const result = [];
  let count = 0;

  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseArr.length; i++) {
      Promise.resolve(promiseArr[i]).then((res) => {
        result[i] = res
        count++;
        if (count === promiseArr.length) {
          resolve(result);
        }
      }, (err) => {
        reject(err);
      })
    }
  });
}

// promise race
function promiseRace(promiseArr) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseArr.length; i++) {
      Promise.resolve(promiseArr[i]).then(
        (res) => {
          //promise数组只要有任何一个promise 状态变更  就可以返回
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    }
  });
}

// 寄生组合继承
function Parent(name) {
  this.name = name;
  this.say = function () {
    console.log('say someting');
  }
}
Parent.prototype.play = function () {
  console.log('playing')
}
function Children() {
  Parent.call(this);
  this.age = 1;
}
Children.prototype = Object.create(Parent.prototype);
Children.prototype.constructor = Children;

// new
function myNew(constructor, ...args) {
  const obj = Object.create(constructor.prototype);
  const result = constructor.call(obj, ...args);
  if (result && (typeof result === 'object' || typeof result === 'function')) {
    return result;
  }
  return obj;
}

// 防抖/节流
// 一定时间内重复触发不执行，只执行最后一次
function debounce(fn, delay) {
  let timer = null;
  
  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    };
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
// 一定时间内只执行一次
function throttle(fn, delay) {
  let tiemr = null;

  return function (...args) {
    if (tiemr) return;
    tiemr = setTimeout(() => {
      fn.apply(this, args)
      tiemr = null;
    }, delay)
  }
}

// 