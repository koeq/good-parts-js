// 1
function add(x, y) {
  return x + y;
}

function sub(x, y) {
  return x - y;
}

function mul(x, y) {
  return x * y;
}

const identitiyf = (x) => {
  return () => {
    return x;
  };
};

const five = identitiyf(5);
// console.log(five());

const addf = (x) => {
  return (y) => {
    return x + y;
  };
};

// console.log(addf(5)(10));

const liftf = (binaryFunc) => {
  return (x) => {
    return (y) => {
      return binaryFunc(x, y);
    };
  };
};

const mulf = liftf(mul);
// console.log(mulf(10)(5));

// 2
const curry = (binaryFunc, x) => {
  return (y) => {
    return binaryFunc(x, y);
  };
};

// alternative
// const curry = (binary, first) => {
//   return liftf(binary)(first);
// };

// const add3 = curry(add, 3);

// console.log(curry(add, 3)(7));

const inc1 = addf(1);
const inc2 = liftf(add)(1);
const inc3 = curry(add, 1);

// console.log(inc1(5));

// 3
// const twice = (binary) => {
//   return (a) => {
//     return binary(a, a);
//   };
// };

// the next solutions are unnecessarily complicated
// const twice = (binary) => {
//   return (first) => {
//     const curried = curry(binary, first);
//     return curried(first);
//   };
// };

const twice = (binary) => {
  const lifted = liftf(binary);
  return (first) => {
    return lifted(first)(first);
  };
};

// console.log(twice(mul)(10));

// const reverse = (binary) => {
//   return (x, y) => {
//     return binary(y, x);
//   };
// };

// reverse any number of arguments
const reverse = (func) => {
  return (...args) => {
    return func(...args.reverse());
  };
};

// console.log(reverse(sub)(3, 2));

const doubl = twice(add);
// const square = twice(mul);
function square(n) {
  return n * n;
}

const composeU = (firstFunc, secondFunc) => {
  return (first) => {
    return secondFunc(firstFunc(first));
  };
};

// console.log(composeU(doubl, square)(5));

const composeB = (firstFunc, secondFunc) => {
  return (first, second, third) => {
    return secondFunc(firstFunc(first, second), third);
  };
};

// console.log(composeB(add, mul)(2, 3, 7));

const limit = (binary, n) => {
  return (first, second) => {
    if (n >= 1) {
      n--;
      return binary(first, second);
    }

    return undefined;
  };
};

const addLtd = limit(add, 1);

// console.log(addLtd(3, 4), addLtd(3, 4));

// 4
// const from = (n) => {
//   let returned = false;
//   return () => {
//     if (returned) {
//       n = n + 1;
//     }

//     returned = true;
//     return n;
//   };
// };

// const from = (start) => {
//   return () => {
//     const next = start;
//     start += 1;
//     return next;
//   };
// };

const from = (n) => {
  return () => {
    return n++;
  };
};

// const index = from(0);
// console.log(index(), index(), index());

const to = (generator, limit) => {
  return () => {
    const result = generator();

    if (result < limit) {
      return result;
    }

    return undefined;
  };
};

const limitedFrom = to(from(1), 3);
// console.log(limitedFrom(), limitedFrom(), limitedFrom());

// const fromTo = (current, end) => {
//   return () => {
//     if (current < end) {
//       return current++;
//     }

//     return undefined;
//   };
// };

const fromTo = (start, end) => {
  return to(from(start), end);
};

// const index = fromTo(0, 3);
// console.log(index(), index(), index(), index());

const element = (arr, generator) => {
  return () => {
    const index = generator();
    if (index !== undefined) {
      return arr[index];
    }
  };
};

// const ele = element(["a", "b", "c"], fromTo(1, 3));
// console.log(ele(), ele(), ele());

const modifiedElement = (arr, generator = undefined) => {
  let counter = 0;

  return () => {
    const index = generator ? generator() : counter;
    if (index !== undefined) {
      counter += 1;
      return arr[index];
    }
  };
};

// const ele = modifiedElement(["a", "b", "c"]);
// console.log(ele(), ele(), ele(), ele());

// 5
const collect = (generator, arr) => {
  return () => {
    const res = generator();
    if (res || res === 0) {
      arr.push(res);
    }

    return res;
  };
};

// const arr = [];
// const col = collect(fromTo(0, 2), arr);
// console.log(col(), col(), col(), col());
// console.log(arr);

// const filter = (generator, predicate) => {
//   return () => {
//     let res = generator();
//     while (res !== undefined && !predicate(res)) {
//       res = generator();
//     }

//     return res;
//   };
// };

const filter = (generator, predicate) => {
  return function recur() {
    const res = generator();

    if (res === undefined || predicate(res)) {
      return res;
    }

    return recur();
  };
};

// const fil = filter(fromTo(0, 5), (value) => value % 3 === 0);
// console.log(fil(), fil(), fil());

const concat = (gen1, gen2) => {
  return () => {
    const res = gen1();

    if (res !== undefined) {
      return res;
    }

    return gen2();
  };
};

// const con = concat(fromTo(0, 3), fromTo(0, 2));
// console.log(con(), con(), con(), con(), con(), con());

const gensymf = (generator, prefix) => {
  return () => {
    const res = generator();
    if (res !== undefined) return `${prefix}${res}`;
  };
};

// const genh = gensymf(from(1), "H");
// const geng = gensymf(from(1), "G");
// console.log(genh(), genh(), geng(), geng());
const calllog = (func, n) => {
  while (n > 0) {
    n--;
    console.log(func());
  }
};

const fibonacci = (first, second) => {
  return () => {
    const next = first + second;
    first = second;
    second = next;
    // delay sequence
    return next - first;
  };
};

// const fib = fibonacci(0, 1);
// calllog(fib, 20);

//  7
const counter = (n) => {
  return {
    up() {
      return ++n;
    },

    down() {
      return --n;
    },
  };
};

// const obj = counter(10);
// console.log(obj.up(), obj.down(), obj.down(), obj.down());

const revokable = (binaryFunc) => {
  let revoked = false;
  return {
    invoke() {
      return (first, second) =>
        revoked ? undefined : binaryFunc(first, second);
    },
    revoke() {
      revoked = true;
    },
  };
};

// const rev = revokable(add);
// const rev_add = rev.invoke();
// console.log(rev_add(3, 5));
// rev.revoke();
// console.log(rev_add(3, 5));

// 8
const m = (value, source) => {
  return {
    value: value,
    source: typeof source === "string" ? source : String(value),
  };
};

// const addm = (obj1, obj2) => {
//   return m(obj1.value + obj2.value, `(${obj1.source} + ${obj2.source}`);
// };

// console.log(JSON.stringify(addm(m(3), m(4))));

const liftm = (binary, operator) => {
  return (a, b) => {
    if (typeof a === "number") {
      a = m(a);
    }
    if (typeof b === "number") {
      b = m(b);
    }

    return m(binary(a.value, b.value), `${a.source} ${operator} ${b.source}`);
  };
};

// const mulm = liftm(mul, "*");
// const addm = liftm(add, "+");
// console.log(JSON.stringify(mulm(m(3), m(4))));
// console.log(JSON.stringify(addm(3, 4)));

// 9
const exp = (value) => {
  if (Array.isArray(value)) {
    return value[0](exp(value[1]), exp(value[2]));
  }

  return value;
};

const nae = [Math.sqrt, [add, [square, 3], [square, 4]]];
// console.log(exp(nae));

const addg = (first) => {
  const more = (next) => {
    if (typeof next === "undefined") {
      return first;
    }

    first += next;
    return more;
  };

  if (first !== undefined) {
    return more;
  }
};

// console.log(addg(2)(4)(4)());

const liftg = (binary) => {
  return (first) => {
    const more = (next) => {
      if (typeof next === "undefined") {
        return first;
      }

      first = binary(first, next);
      return more;
    };

    if (first !== undefined) {
      return more;
    }
  };
};

// console.log(liftg(mul)(2)());

// const arrayg = (first) => {
//   const arr = [];
//   const more = (next) => {
//     if (next === undefined) {
//       return arr;
//     }

//     arr.push(next);

//     return more;
//   };

//   return more(first);
// };

const arrayg = liftg((first, second) => {
  const arr = [];
  arr.push(first, second);

  return arr;
});

// console.log(arrayg(2)(4)());

const continuize = (unary) => {
  return (callback, ...args) => callback(unary(...args));
};

// const sqrt = continuize(Math.sqrt);
// sqrt(console.log, 81);

const vector = () => {
  const arr = [];

  const get = (index) => {
    if (index < arr.length) return arr[+index];
  };

  const append = (element) => {
    arr[arr.length] = element;
  };

  // const store = (index, element) => {
  //   arr.splice(index, 0, element);
  // };

  const store = (index, element) => {
    arr[+index] = element;
  };

  const log = () => console.log(arr);

  return Object.freeze({
    get,
    append,
    store,
    log,
  });
};

const vec = vector();
// vec.append(1);
// vec.store(0, 10);
// vec.store(0, 0);

// 12
// const pubsub = () => {
//   const subscribers = [];

//   return {
//     subscribe(callback) {
//       this.callback = callback;
//       subscribers[subscribers.length] = this;
//     },
//     publish(input) {
//       subscribers.forEach((subscriber) => subscriber.callback(input));
//     },
//   };
// };

const pubsub = () => {
  const subscribers = [];

  return Object.freeze({
    subscribe(subscriber) {
      subscribers.push(subscriber);
    },
    publish: function (publication) {
      subscribers.forEach((subscriber) => {
        setTimeout(() => subscriber(publication), 0);
      });
    },
    log() {
      console.log(subscribers);
    },
  });
};

const my_pub_sub = pubsub();
my_pub_sub.subscribe(console.log);
my_pub_sub.publish("worked");

// SCREW with pubsub
// 1. stop publishing process --> use try catch
// my_pub_sub.subscribe();
// 2. alter methods on object instance --> freeze object
// my_pub_sub.publish = undefined;
// 3. alter the subscribers array --> use e.g. forEach isntead of a loop
//    in the loop variant the stored functin gets called as a method on the array object
//    therefore its this keyword is bound to the array and gives us access to it.
//   ForEach passes only one element at a time. There is no access to the array directly possible.
// my_pub_sub.subscribe(function () {
//   this.length = 0;
// });
// 4. send own message to the other subscribers --- not working :( ---
// --> make the call to the provided callbacks async via setTimeout to make sure they get
// executed one after the other
// my_pub_sub.subscribe(() => my_pub_sub.publish("out of order"));
