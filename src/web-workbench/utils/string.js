
export function escapeHtml (text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '\n': '&nbsp;\n',
    ' ': '&nbsp;'
  };
  return text.replace(/[&<>"'\n ]/g, function (m) {
    return map[String(m)];
  });
}

export function stripslashes (str) {
  return (str + '').replace(/\\(.?)/g, function (s, n1) {
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

export function addslashes (str) {
  return (str + '').replace(/[\\"']/g, '\\$&').replace(/\\u0000/g, '\\0');
}

export function chunkString (str, length) {
  const _size = Math.ceil(str.length / length);
  const _ret = new Array(_size);
  let _offset;

  for (let _i = 0; _i < _size; _i++) {
    _offset = _i * length;
    _ret[Number(_i)] = str.substring(_offset, _offset + length);
  }
  return _ret;
}
//  '&nbsp;'
export function fillString (value, length, left, char = ' ') {
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

export function stripByteString (bytes) {
  if (bytes > 2000) {
    bytes = parseInt(bytes / 1000);
    if (bytes > 1000) {
      bytes = parseInt(bytes / 1000);
      if (bytes > 1000) {
        bytes = parseInt(bytes / 1000);
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

export function formatDate (format, timestamp) {
  const date = new Date(timestamp);
  const replaces = [
    [
      /y/g, `${date.getFullYear()}`.slice(2)
    ],
    [
      /Y/g, date.getFullYear()
    ],
    [
      /dd/g, getDayName(date.getDate(), true)
    ],
    [
      /d/g, date.getDate()
    ],
    [
      /DD/g, getDayName(date.getDate(), false)
    ],
    [
      /D/g, formatStringNumber(date.getDate())
    ],
    [
      /mm/g, getMonthName(date.getMonth(), true)
    ],
    [
      /m/g, date.getMonth() + 1
    ],
    [
      /MM/g, getMonthName(date.getMonth() + 1, false)
    ],
    [
      /M/g, formatStringNumber(date.getMonth() + 1)
    ],
    [
      /h/g, date.getHours()
    ],
    [
      /H/g, formatStringNumber(date.getHours())
    ],
    [
      /i/g, date.getMinutes()
    ],
    [
      /I/g, formatStringNumber(date.getMinutes())
    ],
    [
      /s/g, date.getSeconds()
    ],
    [
      /S/g, formatStringNumber(date.getSeconds())
    ]
  ];

  replaces.forEach((replace, i) => {
    format = format.replace(replace[0], `%${i}%`);
  });
  replaces.forEach((replace, i) => {
    format = format.replace(`%${i}%`, replace[1]);
  });

  return format;
}

const DAY_NAMES = [
  [
    'Sunday', 'Sun'
  ],
  [
    'Monday', 'Mon'
  ],
  [
    'Tuesday', 'Tue'
  ],
  [
    'Wednesday', 'Wed'
  ],
  [
    'Thursday', 'Thu'
  ],
  [
    'Friday', 'Fri'
  ],
  [
    'Saturday', 'Sat'
  ]
];

export function getDayName (day, cut) {
  return DAY_NAMES[String(day)];
}

const MONTH_NAMES = [
  [
    'Januar', 'Jan'
  ],
  [
    'February', 'Feb'
  ],
  [
    'March', 'Mar'
  ],
  [
    'April', 'Apr'
  ],
  [
    'May'
  ],
  [
    'June'
  ],
  [
    'July'
  ],
  [
    'August', 'Aug'
  ],
  [
    'September', 'Sept'
  ],
  [
    'October', 'Oct'
  ],
  [
    'November', 'Nov'
  ],
  [
    'December', 'Dec'
  ]
];

export function getMonthName (month, cut) {
  month = MONTH_NAMES[month - 1];
  if (month.length > 1) {
    if (cut) {
      return month[1];
    } else {
      return month[0];
    }
  }
  return month;
}

export function formatStringNumber (value) {
  value = String(value);
  if (value.length < 2) {
    return `0${value}`;
  }
  return value;
}

export function left (str, n) {
  if (n <= 0) {
    return '';
  } else if (n > String(str).length) {
    return str;
  } else {
    return String(str).substring(0, n);
  }
}

export function right (str, n) {
  if (n <= 0) {
    return '';
  } else if (n > String(str).length) {
    return str;
  } else {
    const iLen = String(str).length;
    return String(str).substring(iLen, iLen - n);
  }
}

export function fill (length, char = ' ') {
  return Array(parseInt(length))
    .fill(char)
    .join('');
}
