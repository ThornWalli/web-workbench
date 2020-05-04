
export function formatNumber (value, length, cut) {
  value = value.toString();

  if (cut || cut === undefined) {
    if (value >= 1000000) { value = value.substr(0, 3) + 'M'; } else if (value >= 10000) { value = value.substr(0, 3) + 'K'; }
  }

  for (let i = value.length; i < length; i++) { value = '0' + value; }

  return value;
}

export function spaceValue (value, length, left) {
  value = value.toString();

  for (let i = value.length; i < length; i++) {
    if (left) { value = ' ' + value; } else { value = value + ' '; }
  }

  return value;
}

export function charValue (value, length, cha, left) {
  value = value.toString();

  for (let i = value.length; i < length; i++) {
    if (left) { value = cha + value; } else { value = value + cha; }
  }

  return value;
}

export function stringCut (value, length, end) {
  if (value.length > length) { value = value.slice(0, length) + '…'; }

  return value;
}
