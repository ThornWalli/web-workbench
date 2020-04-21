
export function isStringValue (value) {
  return /^"(.*)"$/.test(value);
}
export function prepareString (value) {
  if (!isStringValue(value)) {
    value = cleanString(value);
    return `"${value}"`;
  }
  return value;
}
export function cleanString (value) {
  if (typeof value !== 'string') {
    return value;
  }
  return value.replace(/^[ ]*"(.*)"[ ]*$/, '$1');
}
export function isNumeric (num) {
  return !isNaN(num);
}

let abab;
if (global.atob) {
  abab = Promise.resolve({
    atob: (value) => {
      debugger;
      global.decodeURIComponent(global.atob(value));
    },
    btoa: value => global.btoa(global.encodeURIComponent(value))
  });
} else {
  (function () { abab = import('abab'); })();
}

export async function atob (value) {
  const { atob } = await abab;
  return atob(value);
}
export async function btoa (value) {
  const { btoa } = await abab;
  return btoa(value);
}
