export function escapeHtml(value: string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '\n': '&nbsp;\n',
    ' ': '&nbsp;'
  };
  return value.replace(/[&<>"'\n ]/g, value => {
    return map[value as keyof typeof map];
  });
}

export function stripslashes(value: string) {
  return (value + '').replace(/\\(.?)/g, function (s, n1) {
    switch (n1) {
      case '\\':
        return '\\';
      case '0':
        return '\u0000';
      case '':
        return '';
      default:
        return n1;
    }
  });
}

export function addslashes(value: string) {
  return (value + '').replace(/[\\"']/g, '\\$&').replace(/\\u0000/g, '\\0');
}

export function chunkString(value: string, length: number) {
  const _size = Math.ceil(value.length / length);
  const _ret = new Array(_size);
  let _offset;

  for (let _i = 0; _i < _size; _i++) {
    _offset = _i * length;
    _ret[Number(_i)] = value.substring(_offset, _offset + length);
  }
  return _ret;
}
//  '&nbsp;'
export function fillString(
  value: string,
  length: number,
  left: boolean,
  char = ' '
) {
  if (value.length < length) {
    for (let i = value.length; i <= length - 1; i++) {
      if (left) {
        value = char + value;
      } else {
        value = value + char;
      }
    }
  }
  return value;
}

export function stripByteString(bytes: number) {
  if (bytes > 2000) {
    bytes = Math.round(bytes / 1000);
    if (bytes > 1000) {
      bytes = Math.round(bytes / 1000);
      if (bytes > 1000) {
        bytes = Math.round(bytes / 1000);
        return `${bytes}g`;
      } else {
        return `${bytes}m`;
      }
    } else {
      return `${bytes}k`;
    }
  } else {
    return `${bytes}b`;
  }
}

export function formatDate(format: string, timestamp: number) {
  const date = new Date(timestamp);
  const replaces: [RegExp, string | number][] = [
    [/y/g, `${date.getFullYear()}`.slice(2)],
    [/Y/g, String(date.getFullYear())],
    [/dd/g, getDayName(date.getDay(), true)],
    [/d/g, date.getDate()],
    [/DD/g, getDayName(date.getDay(), false)],
    [/D/g, formatStringNumber(date.getDate())],
    [/mm/g, getMonthName(date.getMonth(), true)],
    [/m/g, date.getMonth() + 1],
    [/MM/g, getMonthName(date.getMonth() + 1, false)],
    [/M/g, formatStringNumber(date.getMonth() + 1)],
    [/h/g, date.getHours()],
    [/H/g, formatStringNumber(date.getHours())],
    [/i/g, date.getMinutes()],
    [/I/g, formatStringNumber(date.getMinutes())],
    [/s/g, date.getSeconds()],
    [/S/g, formatStringNumber(date.getSeconds())]
  ];

  replaces.forEach(([need], i) => {
    format = format.replace(need, `%${i}%`);
  });
  replaces.forEach(([, value], i) => {
    format = format.replace(`%${i}%`, String(value));
  });

  return format;
}

const dayNames = [
  ['Sunday', 'Sun'],
  ['Monday', 'Mon'],
  ['Tuesday', 'Tue'],
  ['Wednesday', 'Wed'],
  ['Thursday', 'Thu'],
  ['Friday', 'Fri'],
  ['Saturday', 'Sat']
];

export function getDayName(day: number, short = false) {
  const names = dayNames[Number(day)];
  if (short) {
    return names[1] || names[0];
  }
  return names[0];
}

const monthNames = [
  ['Januar', 'Jan'],
  ['February', 'Feb'],
  ['March', 'Mar'],
  ['April', 'Apr'],
  ['May'],
  ['June'],
  ['July'],
  ['August', 'Aug'],
  ['September', 'Sept'],
  ['October', 'Oct'],
  ['November', 'Nov'],
  ['December', 'Dec']
];

export function getMonthName(month: number, short = false) {
  const names = monthNames[Number(month)];
  if (short) {
    return names[1] || names[0];
  }
  return names[0];
}

export function formatStringNumber(value: string | number) {
  value = String(value);
  if (value.length < 2) {
    return `0${value}`;
  }
  return value;
}

export function left(value: string, n: number) {
  if (n <= 0) {
    return '';
  } else if (n > String(value).length) {
    return value;
  } else {
    return String(value).substring(0, n);
  }
}

export function right(value: string, n: number) {
  if (n <= 0) {
    return '';
  } else if (n > String(value).length) {
    return value;
  } else {
    const iLen = String(value).length;
    return String(value).substring(iLen, iLen - n);
  }
}

export function fill(length: number, char = ' ') {
  return Array(Math.round(length)).fill(char).join('');
}
