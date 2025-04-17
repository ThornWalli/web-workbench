function approximate(
  value: number,
  formula: CallableFunction,
  min: number,
  max: number,
  density: number
) {
  if (value === 0 || value === 1) {
    return value;
  }

  const mid = (max - min) / 2 + min;
  const test = formula(mid);

  if (Math.abs(test - value) < density) {
    return mid;
  } else if (test > value) {
    return approximate(value, formula, min, mid, density);
  } else {
    return approximate(value, formula, mid, max, density);
  }
}

function createMemoizedFormula(formula: CallableFunction, scale: number) {
  const list = new Array(scale + 1).fill(undefined);
  return (output: number) => {
    const index = Math.round(output * scale);
    let res = list[Number(index)];
    if (res === undefined) {
      res = formula(index / scale);
      list[Number(index)] = res;
    }
    return res;
  };
}

export function reverse(formula = linear, min = 0, max = 1, density = 0.00001) {
  const fn = (value: number) => approximate(value, formula, min, max, density);
  return createMemoizedFormula(fn, Math.round(1 / density));
}

export function linear(t: number) {
  return t;
}

export function easeInQuad(t: number) {
  return t * t;
}

export function easeOutQuad(t: number) {
  return t * (2 - t);
}

export function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function easeInCubic(t: number) {
  return t * t * t;
}

export function easeOutCubic(t: number) {
  return --t * t * t + 1;
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

export function easeInQuart(t: number) {
  return t * t * t * t;
}

export function easeOutQuart(t: number) {
  return 1 - --t * t * t * t;
}

export function easeInOutQuart(t: number) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
}

export function easeInQuint(t: number) {
  return t * t * t * t * t;
}

export function easeOutQuint(t: number) {
  return 1 + --t * t * t * t * t;
}

export function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}
