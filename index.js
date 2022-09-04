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
