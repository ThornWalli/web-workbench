import {
  left as stringLeft,
  right as stringRight,
  fill as stringFill
} from '../utils/string';
import { cleanString, isNumeric } from '../utils/helper';
import Memory from './Memory';
import CommandParser from './CommandParser';
import StringParamterParser from './StringParameterParser';

function invalidArgs(...params) {
  if (params.includes(undefined)) {
    throw new Error('invalid arguments');
  }
}

let REGEX_BRACKETS,
  REGEX_BRACKETS_START,
  REGEX_MULTIPLY,
  REGEX_ADD_SUBTRACT,
  REGEX_FUNCTION,
  REGEX_FUNCTION_START,
  REGEX_VARIABLE,
  REGEX_NUMBER;

try {
  REGEX_BRACKETS = /([^\w$%]?)\(([^\\(\\)]+)\)/;
  REGEX_BRACKETS_START = /^\((.*)\)$/;

  // eslint-disable-next-line prefer-regex-literals
  REGEX_MULTIPLY = new RegExp(
    '[^\\d$\\-\\w]?(?<a>([+-]?[\\w.]+e\\+\\d+)|([+-]?[\\w$%.]+)|(^[+-]?[\\w$%.]+)|([\\w$%.]+)|([$]{3}\\d+))[ ]*(?<operator>[\\^*%\\/]|MOD|XOR|AND|OR|<<|>>|>>>)[ ]*(?<b>([-]?[\\w.]+e\\+\\d+)|([-]?[\\w$%.]+)|(^[+-]?[\\w$%.]+)|([\\w$%.]+)|([$]{3}\\d+))'
  );

  REGEX_ADD_SUBTRACT =
    /([+-]?[\w.]+e\+\d+|[+-]?[\w$%.]+|[$]{3}\d+)[ ]*([+-])[ ]*([+-]?[\w.]+e\+\d+|[+-]?[\w$%.]+|[$]{3}\d+)/;
  REGEX_FUNCTION = /([\w]+[a-zA-Z0-9_.]+[$%]?)[ ]*\(([^\\(\\)]*)\)/;
  REGEX_FUNCTION_START = /^([\w]+[a-zA-Z0-9_.]+[$%]?)[ ]*\(([^\\(\\)]*)\)/;
  REGEX_VARIABLE = /^([\w]+[a-zA-Z0-9_.]?[$%]?)/;

  // eslint-disable-next-line security/detect-unsafe-regex
  REGEX_NUMBER = /^([+-]?[\d.]+e\+\d+|[+-]?[\d.])+($|$)/;
} catch (error) {}
export default class MathParser {
  #memory;

  constructor(memory) {
    this.createMemory(memory);
  }

  createMemory(memory) {
    this.#memory = memory || new Memory();

    this.#memory.addSub('RND', () => {
      return Promise.resolve(Math.random());
    });
    this.#memory.addSub('PI', () => {
      return Promise.resolve(Math.PI);
    });
    this.#memory.addSub('POW', (a, b) => {
      invalidArgs(a, b);
      return Promise.resolve(a ** (b || 2));
    });
    this.#memory.addSub('SQRT', (a, b) => {
      invalidArgs(a, b);
      return Promise.resolve(Math.sqrt(a, b || 2));
    });
    this.#memory.addSub('INT', a => {
      invalidArgs(a);
      return this.parse(cleanString(a)).then(a => parseInt(a));
    });
    this.#memory.addSub('SPC', a => {
      invalidArgs(a);
      return Promise.resolve(`"${stringFill(a)}"`);
    });
    // LEN(phrase$) returns the length of the string
    this.#memory.addSub('LEN', a => {
      invalidArgs(a);
      return Promise.resolve(cleanString(String(a)).length);
    });
    // ASC(s$) returns the ASCII number for the string
    this.#memory.addSub('ASC', a => {
      invalidArgs(a);
      return Promise.resolve(cleanString(a).charCodeAt(0));
    });
    // CHR(i) converts an ASCII number to string
    this.#memory.addSub('CHR$', a => {
      invalidArgs(a);
      return Promise.resolve(String.fromCharCode(a));
    });
    this.#memory.addSub('LEFT$', (a, b) => {
      invalidArgs(a, b);
      return Promise.resolve(`"${stringLeft(cleanString(a), parseInt(b))}"`);
    });
    this.#memory.addSub('RIGHT$', (a, b) => {
      invalidArgs(a, b);
      return Promise.resolve(`"${stringRight(cleanString(a), parseInt(b))}"`);
    });
    this.#memory.addSub('STRING$', (a, b) => {
      invalidArgs(a, b);
      return Promise.resolve(`"${stringFill(cleanString(a), cleanString(b))}"`);
    });
    this.#memory.addSub('TIME%', () => {
      return Promise.resolve(Date.now());
    });

    this.#memory.addSub('HEX_ENC$', a => {
      invalidArgs(a);
      a = Number(cleanString(a)).toString(16);
      return Promise.resolve(a);
    });

    this.#memory.addSub('HEX_DEC$', a => {
      invalidArgs(a);
      a = parseInt(cleanString(a), 16);
      return Promise.resolve(a);
    });
  }

  parse(input) {
    const parsing = new Parsing(this);
    return parsing.parse(input);
  }

  validInput(value) {
    return /[/*\-+^()]?/.test(value);
  }

  get memory() {
    return this.#memory;
  }
}

const TIMEOUT = 5000;
class Parsing {
  #parser;
  #parsedValues = [];
  #timeout = 0;

  constructor(parser) {
    this.#parser = parser;
  }

  get parser() {
    return this.#parser;
  }

  get parsedValues() {
    return this.#parsedValues;
  }

  async parse(input) {
    if (this.#timeout > TIMEOUT) {
      throw new Error(`Can't parse ${input}`);
    }
    this.#timeout++;

    const { result, values } = CommandParser.extractStrings(String(input));
    let data = StringParamterParser.parse(result);
    this.#parsedValues = this.#parsedValues.concat(values);
    // const data = CommandParser.extractValues(input, ' ');

    data = data.map(data => {
      if (/^MOD|XOR|AND|OR$/.test(data)) {
        return ` ${data} `;
      }
      return data;
    });

    let output = data.join('');

    // let output = data.replace(/ /g, '');
    if (isNumeric(output)) {
      output = Number(output);
    }
    const lastOutput = output;
    output = await this.action(output);

    if (output !== lastOutput && !/^".*"$/.test(output)) {
      return this.parse(output);
    }
    return this.$v(output);
  }

  // eslint-disable-next-line complexity
  async action(output) {
    // ( a + b ) = c
    // output = String(output).replace('XOR', ' XOR ');
    if (REGEX_BRACKETS_START.test(output)) {
      const [orig, a] = output.match(REGEX_BRACKETS_START);
      output = output.replace(orig, a);
    }

    if (REGEX_FUNCTION.test(output)) {
      const [match, name, args, nameSimple] = output.match(REGEX_FUNCTION);
      const subName = name || nameSimple;
      let subArgs = StringParamterParser.parse(args || '');
      const isArgs = args.includes(',') && subArgs.join('') !== args;

      if (isArgs) {
        subArgs = args.split(',');
      }

      subArgs = await Promise.all(subArgs.map(arg => this.parse(arg)));

      subArgs = isArgs ? subArgs : [await this.parse(subArgs.join(''))];
      if (this.#parser.memory.has(subName)) {
        return output.replace(
          match,
          this.#parser.memory.get(subName)[Number(subArgs[0]) - 1]
        );
        // return this.#parser.memory.get(val[1]).value[index - 1];
      } else if (this.#parser.memory.hasSub(subName)) {
        return output.replace(
          match,
          this.cacheValue(
            await this.#parser.memory.executeSub(subName, subArgs)
          )
        );
      }
    }

    if (REGEX_BRACKETS.test(output)) {
      const [orig, a, b] = output.match(REGEX_BRACKETS);
      return output.replace(orig, a + (await this.parse(b)));
    }

    // operationen sind getrennt um reihenfolge einzuhalten. Punkt vor Strich…
    if (REGEX_MULTIPLY.test(output)) {
      return this.operation(output, REGEX_MULTIPLY);
    }
    if (REGEX_ADD_SUBTRACT.test(output)) {
      return this.operation(output, REGEX_ADD_SUBTRACT);
    }

    return this.$v(output);
  }

  // eslint-disable-next-line complexity
  async operation(output, regex) {
    const matches = output.match(regex);

    let a, b, operator;
    const match = matches[0];
    if ('groups' in matches && matches.groups) {
      a = matches.groups.a;
      b = matches.groups.b;
      operator = matches.groups.operator;
    } else {
      a = matches[1];
      operator = matches[2];
      b = matches[3];
    }

    let value = output;

    let valueA = await this.parse(a);

    if (!isNumeric(valueA)) {
      valueA = cleanString(valueA);
    }

    let valueB = await this.parse(b);

    if (!isNumeric(valueB)) {
      valueB = cleanString(valueB);
    }

    switch (operator) {
      case '+':
        value = valueA + valueB;
        break;
      case '-':
        value = valueA - valueB;
        break;
      case '*':
        value = valueA * valueB;
        break;
      case '/':
        value = valueA / valueB;
        break;
      case '>':
        value = valueA > valueB;
        break;
      case '<':
        value = valueA < valueB;
        break;
      case '^':
        value = valueA ^ valueB;
        break;
      case '%':
        value = valueA % valueB;
        break;
      case 'MOD':
        value = valueA % valueB;
        break;
      case 'AND':
        value = valueA & valueB;
        break;
      case 'OR':
        value = valueA | valueB;
        break;
      case 'XOR':
        value = valueA ^ valueB;
        break;
      case '<<':
        value = valueA << valueB;
        break;
      case '>>':
        value = valueA >> valueB;
        break;
      case '>>>':
        value = valueA >>> valueB;
        break;
    }

    if (!isNumeric(value)) {
      value = `"${value}"`;
    }

    return output.replace(
      match,
      match.replace(
        RegExp(
          `[${a}]{${String(a).length}}[ ]*[${operator}]{${
            String(operator).length
          }}[ ]*[${b}]{${String(b).length}}`
        ),
        ''
      ) + this.cacheValue(value)
    );
  }

  $v(value) {
    if (CommandParser.valueUnresolved(value)) {
      value = CommandParser.resolveValue(value, this.#parsedValues);
      // if (isStringValue(value)) {
      //   return Promise.resolve(cleanString(value));
      // } else {
      return Promise.resolve(value);
      // }
    }

    // remove side spaces "   test  " -> "test"
    if (typeof value === 'string') {
      value = value.replace(/^[ ]*([^ ].*[^ ])[ ]*$/, '$1');
    }

    if (!REGEX_NUMBER.test(value)) {
      if (REGEX_FUNCTION_START.test(String(value))) {
        const [, name, args] = value.match(REGEX_FUNCTION_START);
        if (this.#parser.memory.hasSub(name)) {
          return this.#parser.memory.executeSub(
            name,
            CommandParser.resolveValues(CommandParser.extractValues(args, ','))
          );
        } else {
          throw new Error(`can't find sub "${name}" in memory`);
        }
      } else if (REGEX_VARIABLE.test(String(value))) {
        const name = value.replace(REGEX_VARIABLE, '$1');
        if (this.#parser.memory.hasSub(name)) {
          return this.#parser.memory.executeSub(name);
        } else if (this.#parser.memory.has(name)) {
          return Promise.resolve(this.#parser.memory.get(name));
        }
      }
    } else {
      return Promise.resolve(Number(value));
    }
    return Promise.resolve(value);
  }

  cacheValue(value) {
    this.#parsedValues.push(value);
    return CommandParser.resolveKey(this.#parsedValues.length - 1);
  }
}
