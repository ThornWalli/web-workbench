export const getRandom = (max, min = 0) => {
  return Math.floor(min + Math.random() * (max - min + 1));
};

export const normalizePercentage = (value, max) => {
  if (max) {
    value = value / max;
  }
  value = Math.round(value * 100);
  if (isNaN(value)) {
    return 0;
  }
  return value;
};
