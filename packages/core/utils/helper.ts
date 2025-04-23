export function isStringValue(value: unknown) {
  return typeof value === 'string' && /^"([^"]*)"$/.test(value);
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

const TICKS = ['"', "'"];
export function unwrapString<T>(value: T) {
  if (typeof value === 'string') {
    const v = value.trim();
    if (TICKS.includes(value[0]) && TICKS.includes(value[value.length - 1])) {
      return v.slice(1, value.length - 1).replace(/\\"/g, '"');
    }
  }
  return value;
}

export function cleanString(value: string | number) {
  if (typeof value !== 'string') {
    return String(value);
  }
  return value.replace(/^[ ]*"(.*)"[ ]*$/, '$1').replace(/\\"/g, '"');
}
// export function isNumeric(value: unknown) {
//   return typeof value === 'number' || /^\d+$/.test(String(value));
// }

export function isBoolean(value: unknown) {
  return typeof value === 'boolean' || value === 'true' || value === 'false';
}

export function isNumeric(value: unknown) {
  return !isNaN(Number(value));
}

export function atob(value: string) {
  return decodeURIComponent(globalThis.atob(value));
}
export function btoa(value: string) {
  return globalThis.btoa(encodeURIComponent(value));
}
