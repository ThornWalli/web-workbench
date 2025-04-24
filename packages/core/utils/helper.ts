export function isStringValue(value: unknown) {
  return typeof value === 'string' && hasStringWrap(value.trim());
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
export function wrapString(value: string, tick: "'" | '"' = '"') {
  if (hasStringWrap(value)) {
    return value;
  } else {
    value = value.replace(/"/g, '\\"');
  }
  return `${tick}${value}${tick}`;
}

export function isEmptyStringWrap(value: string) {
  return (
    value.length === 2 &&
    value[0] === value[value.length - 1] &&
    hasStringWrap(value)
  );
}
export function hasStringWrap(value: string) {
  return value[0] === value[value.length - 1] && TICKS.includes(value[0]);
}
export function unwrapString<T>(value: T): string | T {
  if (typeof value === 'string') {
    const v = value.trim();
    if (hasStringWrap(v)) {
      return v.slice(1, value.length - 1);
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
  return !isNaN(value as number) && !isNaN(parseFloat(value as string));
}

export function atob(value: string) {
  return decodeURIComponent(globalThis.atob(value));
}
export function btoa(value: string) {
  return globalThis.btoa(encodeURIComponent(value));
}
