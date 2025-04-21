/**
 * @deprecated
 */
export default class StringParameterParser {
  static REGEX_CHAR_WORD_NON_DIGIT = /^[^\d\W$%]|[.].$/;
  static REGEX_NUMERIC = /^[\d+\-*\\/.<>]$/;

  static DEBUG = false;

  // eslint-disable-next-line complexity
  static parse(message, values = [], timeoutCount = 0) {
    let result = message;
    const flags = getFlags();
    let done = false;
    let i = 0;

    while (message.length >= i) {
      const lastChar = message[Number(i - 1)];
      const nextChar = message[Number(i + 1)];
      const char = message[Number(i)];

      if (char === '(' && flags.clamp !== false) {
        flags.clamp++;
      }
      if (
        /(^[$]{6}\d+\$)/.test(message.slice(i, message.length)) &&
        !locked(flags)
      ) {
        const [value] = message
          .slice(i, message.length)
          .match(/(^[$]{6}\d+\$)/);
        i += value.length - 1;
      } else if (
        /(^[$]{3}\d+)/.test(message.slice(i, message.length)) &&
        !locked(flags)
      ) {
        const [value] = message.slice(i, message.length).match(/(^[$]{3}\d+)/);
        flags.startRecord = i;
        i += value.length;
        flags.stopRecord = i;
      } else if (
        char === '-' &&
        (nextChar === '-' ||
          StringParameterParser.REGEX_CHAR_WORD_NON_DIGIT.test(nextChar)) &&
        !locked(flags)
      ) {
        // start paramter
        flags.parameter = true;
        flags.startRecord = i;
      } else if (char === '(' && !locked(flags)) {
        // start clamp
        flags.clamp = 0;
        flags.startRecord = i;
      } else if (
        StringParameterParser.REGEX_NUMERIC.test(char) &&
        !locked(flags)
      ) {
        /// [^$]/.test(lastChar) &&
        // start number
        flags.numeric = true;
        flags.startRecord = i;
      } else if (
        StringParameterParser.REGEX_CHAR_WORD_NON_DIGIT.test(char) &&
        !locked(flags)
      ) {
        // start char
        flags.char = true;
        flags.startRecord = i;
      } else if (char === '"' && !locked(flags)) {
        // start double quote
        flags.doubleQuote = true;
        flags.startRecord = i;
      } else if (char === "'" && !locked(flags)) {
        // start single quote
        flags.singleQuote = true;
        flags.startRecord = i;
      } else if (flags.startRecord !== false) {
        if (flags.parameter) {
          if (
            char === '=' ||
            !StringParameterParser.REGEX_CHAR_WORD_NON_DIGIT.test(nextChar)
          ) {
            if (char === '=') {
              flags.parameter = false;
              flags.char = false;
              flags.startOverride = flags.startRecord;
            } else if (
              nextChar !== '=' &&
              !StringParameterParser.REGEX_CHAR_WORD_NON_DIGIT.test(nextChar) &&
              nextChar !== '-'
            ) {
              flags.stopRecord = i + 1;
            }
          }
        } else if (flags.clamp !== false) {
          // stop numeric
          if (char === ')') {
            if (flags.clamp === 0) {
              flags.stopRecord = i + 1;
            } else {
              flags.clamp--;
            }
          }
        } else if (flags.numeric) {
          // stop numeric
          if (
            StringParameterParser.REGEX_NUMERIC.test(lastChar) &&
            !StringParameterParser.REGEX_NUMERIC.test(char)
          ) {
            flags.stopRecord = i;
          }
        } else if (flags.char) {
          // stop char
          if (
            StringParameterParser.REGEX_CHAR_WORD_NON_DIGIT.test(lastChar) &&
            !(
              StringParameterParser.REGEX_CHAR_WORD_NON_DIGIT.test(char) &&
              !/[$%]/.test(char)
            )
          ) {
            if (/[ ]*\(/.test(message.slice(i, message.length))) {
              flags.char = false;
              flags.clamp = 0;
            } else {
              flags.stopRecord = i + 1;
            }
          }
        } else if (flags.doubleQuote) {
          // stop double quote
          if (lastChar !== '\\' && char === '"') {
            flags.stopRecord = i + 1;
          }
        } else if (flags.singleQuote) {
          // stop single quote
          if (lastChar !== '\\' && char === "'") {
            flags.stopRecord = i + 1;
          }
        }
      }

      if (!flags.stopRecord && i + 1 > message.length) {
        flags.stopRecord = i + 1;
        done = true;
      }

      if (
        flags.stopRecord &&
        flags.startRecord === false &&
        i + 1 !== message.length
      ) {
        done = true;
      } else if (flags.stopRecord) {
        let start = flags.startRecord;
        if (flags.startOverride !== undefined) {
          start = flags.startOverride;
        }

        result =
          result.slice(0, start) +
          saveValue(values, result.slice(start, flags.stopRecord)) +
          result.slice(flags.stopRecord, result.length);
        if (StringParameterParser.DEBUG) {
          console.log('result', result);
        }
        if (!done) {
          this.parse(result, values, timeoutCount);
          done = true;
        }
      }
      if (done) {
        break;
      }
      i++;
    }
    if (values.length > 0) {
      return values.filter(value => value.length > 0);
    } else {
      return [message];
    }
  }
}

function resolveKey(index) {
  return `$$$$$$${index}$`;
}

function saveValue(values, value) {
  values.push(value);
  return resolveKey(values.length - 1);
}

function locked(flags) {
  return (
    flags.singleQuote ||
    flags.doubleQuote ||
    flags.clamp !== false ||
    flags.char ||
    flags.numeric ||
    flags.parameter
  );
}

function getFlags() {
  return {
    dollarCount: 0,
    startRecord: false,
    stopRecord: false,
    char: false,
    numeric: false,
    singleQuote: false,
    doubleQuote: false,
    clamp: false,
    parameter: false
  };
}
