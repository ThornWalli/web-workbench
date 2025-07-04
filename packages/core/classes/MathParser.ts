/* eslint-disable complexity */
/* eslint-disable security/detect-unsafe-regex */
import {
  left as stringLeft,
  right as stringRight,
  fill as stringFill
} from '../utils/string';
import {
  unwrapString,
  isNumeric,
  isBoolean,
  wrapString
} from '../utils/helper';
import Memory from './Memory';
import type { DimValue, EntryValue } from './Memory';
import CommandParser from './CommandParser';
import { parse } from '../services/commandParser';

function invalidArgs(...params: unknown[]) {
  if (params.includes(undefined)) {
    throw new Error('invalid arguments');
  }
}

enum EXPRESSION {
  BRACKETS = 'brackets',
  BRACKETS_START = 'brackets_start',
  MULTIPLY = 'multiply',
  ADD_SUBTRACT = 'add_subtract',
  FUNCTION = 'function',
  FUNCTION_START = 'function_start',
  VARIABLE = 'variable',
  NUMBER = 'number'
}

const expressions: { [key in EXPRESSION]?: RegExp } = {};

try {
  expressions[EXPRESSION.BRACKETS] = /([^\w$%]?)\(([^\\(\\)]+)\)/;
  expressions[EXPRESSION.BRACKETS_START] = /^\((.*)\)$/;
  expressions[EXPRESSION.MULTIPLY] = new RegExp(
    '[^\\d$\\-\\w]?(?<a>([+-]?[\\w.]+e\\+\\d+)|([+-]?[\\w$%.]+)|(^[+-]?[\\w$%.]+)|([\\w$%.]+)|([$]{3}\\d+))[ ]*(?<operator>[\\^*%\\/]|MOD|XOR|AND|OR|<<|>>|>>>)[ ]*(?<b>([-]?[\\w.]+e\\+\\d+)|([-]?[\\w$%.]+)|(^[+-]?[\\w$%.]+)|([\\w$%.]+)|([$]{3}\\d+))'
  );
  expressions[EXPRESSION.ADD_SUBTRACT] =
    /([+-]?[\w.]+e\+\d+|[+-]?[\w$%.]+|[$]{3}\d+)[ ]*([+-])[ ]*([+-]?[\w.]+e\+\d+|[+-]?[\w$%.]+|[$]{3}\d+)/;
  expressions[EXPRESSION.FUNCTION] =
    /([\w]+[a-zA-Z0-9_.]+[$%]?)[ ]*\(([^\\(\\)]*)\)/;
  expressions[EXPRESSION.FUNCTION_START] =
    /^([\w]+[a-zA-Z0-9_.]+[$%]?)[ ]*\(([^\\(\\)]*)\)/;
  expressions[EXPRESSION.VARIABLE] = /^([\w]+[a-zA-Z0-9_.]?[$%]?)/;

  expressions[EXPRESSION.NUMBER] = /^([+-]?[\d.]+e\+\d+|[+-]?[\d.])+($|$)/;
} catch (error) {
  console.error(error);
}
export default class MathParser {
  debug = false;
  memory: Memory;

  constructor(memory: Memory, debug?: boolean) {
    this.memory = this.createMemory(memory);
    this.debug = debug !== undefined ? debug : this.debug;
  }

  createMemory(existMemory: Memory) {
    const memory = existMemory || new Memory();

    memory.addSub('RND', () => {
      return Promise.resolve(Math.random());
    });
    memory.addSub('PI', () => {
      return Promise.resolve(Math.PI);
    });
    memory.addSub('POW', (a: number, b: number) => {
      invalidArgs(a, b);
      if (typeof a === 'string') {
        throw new Error('Parameter is not a number');
      }
      if (typeof b === 'string') {
        throw new Error('Parameter is not B number');
      }
      return Promise.resolve(a ** (b || 2));
    });
    memory.addSub('SQRT', (a: number) => {
      invalidArgs(a);
      if (typeof a === 'string') {
        throw new Error('Parameter is not a number');
      }
      return Promise.resolve(Math.sqrt(a));
    });
    memory.addSub('INT', async (a: number) => {
      invalidArgs(a);
      return await parseInt(unwrapString(String(a)));
    });
    memory.addSub('SPC', (a: number) => {
      invalidArgs(a);
      if (typeof a === 'string') {
        throw new Error('Parameter is not a number');
      }
      return Promise.resolve(`"${stringFill(a, ' ')}"`);
    });
    // LEN(phrase$) returns the length of the string
    memory.addSub('LEN', (a: string) => {
      invalidArgs(a);
      return Promise.resolve(unwrapString(String(a)).length);
    });
    // ASC(s$) returns the ASCII number for the string
    memory.addSub('ASC', (a: number) => {
      invalidArgs(a);
      return Promise.resolve(String(unwrapString(a)).charCodeAt(0));
    });
    // CHR(i) converts an ASCII number to string
    memory.addSub('CHR$', (a: number) => {
      invalidArgs(a);
      if (typeof a === 'string') {
        throw new Error('Parameter is not a number');
      }
      return Promise.resolve(wrapString(String.fromCharCode(a)));
    });
    memory.addSub('LEFT$', (a: string, b: number) => {
      invalidArgs(a, b);

      if (typeof b === 'string') {
        throw new Error('Parameter is not B number');
      }
      return Promise.resolve(`"${stringLeft(unwrapString(a), b)}"`);
    });
    memory.addSub('RIGHT$', (a: string | number, b: number) => {
      invalidArgs(a, b);
      if (typeof b === 'string') {
        throw new Error('Parameter is not B number');
      }
      return Promise.resolve(
        wrapString(stringRight(String(unwrapString(a)), b))
      );
    });
    memory.addSub('STRING$', (a: number, b: string | number) => {
      invalidArgs(a, b);
      if (typeof a === 'string') {
        throw new Error('Parameter is not a number');
      }
      return Promise.resolve(
        wrapString(stringFill(a, String(unwrapString(b))))
      );
    });
    memory.addSub('TIME%', () => {
      return Promise.resolve(Date.now());
    });

    memory.addSub('HEX_ENC$', (a: string | number) => {
      invalidArgs(a);
      return Promise.resolve(wrapString(Number(unwrapString(a)).toString(16)));
    });

    memory.addSub('HEX_DEC$', (a: string | number) => {
      invalidArgs(a);
      a = parseInt(String(unwrapString(a)), 16);
      return Promise.resolve(a);
    });

    return memory;
  }

  async parse(input: string | number) {
    const parsing = new Parsing(this);
    const result = await parsing.parse(input);
    if (this.debug) {
      console.debug('Result:', typeof result, result);
    }
    return result;
  }

  validInput(value: string) {
    return value && /[/*\-+^()]?/.test(value);
  }
}

const TIMEOUT = 5000;
class Parsing {
  private debug = false;
  private parser;
  private parsedValues: (string | number | boolean | undefined)[] = [];
  private timeout = 0;

  constructor(parser: MathParser, { debug }: { debug?: boolean } = {}) {
    this.parser = parser;
    this.debug = debug !== undefined ? debug : this.debug;
  }

  async parse(
    input: string | number
  ): Promise<string | number | boolean | undefined> {
    if (this.debug) {
      console.debug('PARSE '.padEnd(20, '-'));
    }
    if (this.timeout > TIMEOUT) {
      throw new Error(`Can't parse ${input}`);
    }
    this.timeout++;

    const { result, values } = CommandParser.extractStrings(String(input));

    let data = parse(result).rawArgs;

    this.parsedValues = this.parsedValues.concat(values);

    data = data.map(data => {
      if (/^MOD|XOR|AND|OR$/.test(data)) {
        return ` ${data} `;
      }
      return data;
    });

    let output: string | number | boolean = data.join('');

    if (isNumeric(output)) {
      output = Number(output);
    } else if (isBoolean(output)) {
      output = Boolean(output);
    }
    const lastOutput = output;
    const actionOutput = await this.action(output);
    if (this.debug) {
      console.debug(`action:`, typeof actionOutput, actionOutput);
    }
    if (actionOutput !== undefined) {
      let result;
      if (
        typeof actionOutput === 'string' &&
        actionOutput !== lastOutput &&
        !/^".*"$/.test(String(actionOutput))
      ) {
        result = await this.parse(actionOutput);
        if (this.debug) {
          console.debug('parse:', typeof result, result);
        }
        return result;
      }
      result = await this.resolveValue(
        actionOutput as string | number | boolean | CallableFunction
      );

      if (this.debug) {
        console.debug('$v:', typeof result, result);
      }

      return result as string | number | boolean | undefined;
    }
  }
  async action(output: string | number | boolean) {
    // ( a + b ) = c
    // output = String(output).replace('XOR', ' XOR ');
    if (typeof output === 'string') {
      if (expressions[EXPRESSION.BRACKETS_START]?.test(output)) {
        const expressionMatch = output.match(
          expressions[EXPRESSION.BRACKETS_START]
        );
        if (expressionMatch) {
          const [orig, a] = expressionMatch;
          output = output.replace(orig, a);
        } else {
          throw new Error('Invalid expression');
        }
      }

      if (expressions[EXPRESSION.FUNCTION]?.test(output)) {
        const expressionMatch = output.match(expressions[EXPRESSION.FUNCTION]);

        if (expressionMatch) {
          const [match, name, args, nameSimple] = expressionMatch;

          const subName = name || nameSimple;
          let subArgs = parse(args || '', { separator: ',' }).rawArgs;
          const isArgs = args.includes(',') && subArgs.join('') !== args;

          if (isArgs) {
            subArgs = args.split(',');
          }

          let parsedSubArgs = await Promise.all(
            subArgs.map(arg => this.parse(arg))
          );

          parsedSubArgs = isArgs
            ? parsedSubArgs
            : [await this.parse(parsedSubArgs.join(''))];

          if (this.parser.memory.has(subName)) {
            return output.replace(
              match,
              (
                this.parser.memory.get(subName) as {
                  [key: number]: string;
                }
              )?.[Number(parsedSubArgs[0]) - 1]
            );
          } else if (this.parser.memory.hasSub(subName)) {
            return output.replace(
              match,
              this.cacheValue(
                await this.parser.memory.executeSub<
                  string | number | boolean | undefined,
                  string | number | boolean | undefined,
                  EntryValue<unknown[], string | number | boolean | undefined>
                >(subName, parsedSubArgs)
              )
            );
          }
        }
      }

      if (expressions[EXPRESSION.BRACKETS]?.test(output)) {
        const expressionMatch = output.match(expressions[EXPRESSION.BRACKETS]);
        if (expressionMatch) {
          const [orig, a, b] = expressionMatch;
          return output.replace(orig, a + (await this.parse(b)));
        } else {
          throw new Error('Invalid expression');
        }
      }

      // operationen sind getrennt um reihenfolge einzuhalten. Punkt vor Strich…
      if (expressions[EXPRESSION.MULTIPLY]?.test(output)) {
        return this.operation(output, expressions[EXPRESSION.MULTIPLY]);
      }
      if (expressions[EXPRESSION.ADD_SUBTRACT]?.test(output)) {
        return this.operation(output, expressions[EXPRESSION.ADD_SUBTRACT]);
      }
    }

    return this.resolveValue(output);
  }

  async operation(output: string, regex: RegExp) {
    const matches = output.match(regex);

    if (matches) {
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

      let value: string | number | boolean = output;

      let valueA = await this.parse(a);

      if (!isNumeric(valueA)) {
        valueA = unwrapString(valueA as string);
      }

      let valueB = await this.parse(b);

      if (!isNumeric(valueB)) {
        valueB = unwrapString(valueB as string);
      }

      if (this.debug) {
        console.debug({
          valueA,
          valueB
        });
      }

      valueA = valueA as number | string;
      valueB = valueB as number | string;

      switch (operator) {
        case '+':
          value = (valueA as string) + (valueB as string);
          break;
        case '-':
          value = (valueA as number) - (valueB as number);
          break;
        case '*':
          value = (valueA as number) * (valueB as number);
          break;
        case '/':
          value = (valueA as number) / (valueB as number);
          break;
        case '>':
          value = valueA > valueB;
          break;
        case '<':
          value = valueA < valueB;
          break;
        case '^':
          value = (valueA as number) ^ (valueB as number);
          break;
        case '%':
          value = (valueA as number) % (valueB as number);
          break;
        case 'MOD':
          value = (valueA as number) % (valueB as number);
          break;
        case 'AND':
          value = (valueA as number) & (valueB as number);
          break;
        case 'OR':
          value = (valueA as number) | (valueB as number);
          break;
        case 'XOR':
          value = (valueA as number) ^ (valueB as number);
          break;
        case '<<':
          value = (valueA as number) << (valueB as number);
          break;
        case '>>':
          value = (valueA as number) >> (valueB as number);
          break;
        case '>>>':
          value = (valueA as number) >>> (valueB as number);
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
        ) + this.cacheValue(value as string)
      );
    } else {
      throw new Error('Invalid expression');
    }
  }

  async resolveValue(
    value: string | number | boolean | CallableFunction
  ): Promise<
    string | number | boolean | CallableFunction | DimValue | undefined
  > {
    if (typeof value !== 'function' && CommandParser.valueUnresolved(value)) {
      const resolvedValue = CommandParser.resolveValue(
        value,
        this.parsedValues
      );
      return resolvedValue;
    }

    // remove side spaces "   test  " -> "test"
    if (typeof value === 'string') {
      value = value.replace(/^[ ]*([^ ].*[^ ])[ ]*$/, '$1');

      if (!expressions[EXPRESSION.NUMBER]?.test(value)) {
        if (expressions[EXPRESSION.FUNCTION_START]?.test(String(value))) {
          const matches = value.match(expressions[EXPRESSION.FUNCTION_START]);
          if (matches) {
            const [, name, args] = matches;

            if (this.parser.memory.hasSub(name)) {
              return this.parser.memory.executeSub(
                name,
                CommandParser.resolveValues(
                  CommandParser.extractValues(args, ',')
                )
              );
            } else {
              throw new Error(`can't find sub "${name}" in memory`);
            }
          } else {
            throw new Error('Invalid expression');
          }
        } else if (expressions[EXPRESSION.VARIABLE]?.test(String(value))) {
          const name = value.replace(expressions[EXPRESSION.VARIABLE], '$1');
          if (this.parser.memory.hasSub(name)) {
            return this.parser.memory.executeSub(name);
          } else if (this.parser.memory.has(name)) {
            return this.parser.memory.get(name);
          }
        }
      } else if (isNumeric(value)) {
        return Number(value);
      }
    }
    return value;
  }

  cacheValue(value: string | number | boolean | undefined) {
    this.parsedValues.push(value);
    return CommandParser.resolveKey(this.parsedValues.length - 1);
  }
}
