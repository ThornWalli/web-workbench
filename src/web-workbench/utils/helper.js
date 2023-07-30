
export function isStringValue (value) {
  return /^"([^"]*)"$/.test(value);
}
export function prepareString (value) {
  if (!isStringValue(value)) {
    value = cleanString(value);
    return `"${value}"`;
  }
  return value;
}
export function removeSideSpaces (value) {
  return value.replace(/[ ]*(.+)[ ]+/);
}
export function cleanString (value) {
  if (typeof value !== 'string') {
    return value;
  }
  return value.replace(/^[ ]*"(.*)"[ ]*$/, '$1').replace(/\\"/g, '"');
}
export function isNumeric (num) {
  return !isNaN(num);
}

let abab;
if (window.atob) {
  abab = Promise.resolve({
    atob: value => window.decodeURIComponent(window.atob(value)),
    btoa: value => window.btoa(window.encodeURIComponent(value))
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
