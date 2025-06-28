/**
 * @deprecated Use `precisionNumber` instead.
 */
export function cleanFloat(value: number): number {
  return Math.round(value * 100) / 100;
}

export function precisionNumber(value: number, precision = 2): number {
  const v = Math.pow(10, precision);
  return Math.round(value * v) / v;
}
