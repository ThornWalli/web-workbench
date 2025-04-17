export function isStringValue(value: string) {
  return /^"([^"]*)"$/.test(value);
}
export function prepareString(value: string) {
  if (!isStringValue(value)) {
    value = cleanString(value);
    return `"${value}"`;
  }
  return value;
}
export function removeSideSpaces(value: string) {
  return value.replace(/[ ]*(.+)[ ]+/, '');
}
export function cleanString(value: string | number) {
  if (typeof value !== 'string') {
    return String(value);
  }
  return value.replace(/^[ ]*"(.*)"[ ]*$/, '$1').replace(/\\"/g, '"');
}
export function isNumeric(num: number) {
  return !isNaN(num);
}

export function atob(value: string) {
  return decodeURIComponent(globalThis.atob(value));
}
export function btoa(value: string) {
  return globalThis.btoa(encodeURIComponent(value));
}
