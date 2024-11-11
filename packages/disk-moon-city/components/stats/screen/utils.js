export const normalizePercentage = (value, max) => {
  value = Math.round((value / max) * 100);
  if (isNaN(value)) {
    return 0;
  }
  return value;
};
