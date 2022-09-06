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
const square = twice(mul);

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

const ele = modifiedElement(["a", "b", "c"]);
console.log(ele(), ele(), ele(), ele());
