export const getRandom = (max: number, min: number = 0) => {
  return Math.floor(min + Math.random() * (max - min + 1));
};

export const normalizePercentage = (value: number, max?: number) => {
  if (max) {
    value = value / max;
  }
  value = Math.round(value * 100);
  if (isNaN(value)) {
    return 0;
  }
  return value;
};
