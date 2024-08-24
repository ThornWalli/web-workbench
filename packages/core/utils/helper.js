export function isStringValue(value) {
  return /^"([^"]*)"$/.test(value);
}
export function prepareString(value) {
  if (!isStringValue(value)) {
    value = cleanString(value);
    return `"${value}"`;
  }
  return value;
}
export function removeSideSpaces(value) {
  return value.replace(/[ ]*(.+)[ ]+/);
}
export function cleanString(value) {
  if (typeof value !== 'string') {
    return value;
  }
  return value.replace(/^[ ]*"(.*)"[ ]*$/, '$1').replace(/\\"/g, '"');
}
export function isNumeric(num) {
  return !isNaN(num);
}

export function atob(value) {
  return decodeURIComponent(globalThis.atob(value));
}
export function btoa(value) {
  return globalThis.btoa(encodeURIComponent(value));
}
