/* eslint-disable security/detect-unsafe-regex */
/* eslint-disable complexity */
import { fillString as stringFill } from '../../utils/string';

import { isBoolean, isNumeric, unwrapString } from '../../utils/helper';
import CommandParser from '../CommandParser';
import { DimEntry, type DimValue } from '../Memory';
import Memory from '../Memory';
import { parse } from '../../services/commandParser';
import type { ItemData } from '../FileSystem/types';

type StrictValue = string;
type Value = string | number | boolean | undefined;
type Condition = '<' | '<=' | '>' | '>=' | '==' | '!=' | '<>';
type ParsedValue =
  | string
  | number
  | boolean
  | DimValue
  | ItemData
  | object
  | undefined;

interface SubDescription {
  lines: string[];
  name: string;
  args: Value[];
}

interface LoopDescription {
  count: number;
  lines: string[];
  condition: () => Promise<boolean | null>;
  step?: (set?: boolean) => Promise<number>;
  tmpLines?: string[];
}

// export class CallbackMessage {
//   raw: ParsedValue;
//   constructor(raw: ParsedValue) {
//     this.raw = raw;
//   }
//   get value() {
//     return this.raw;
//   }
//   get text() {
//     if (this.raw instanceof Table) {
//       return this.raw.toColumnify().split(/\n/g);
//     }
//     if (typeof this.raw === 'string' && isStringValue(this.raw)) {
//       return unwrapString(this.raw);
//     }
//     return String(this.raw);
//   }
// }

export type CallbackMessage = string | string[] | object | number | boolean;
export interface CallbackOptions {
  message?: CallbackMessage;
}

export interface ParseCallbackOptions extends CallbackOptions {
  show?: boolean;
}

type Callback = (
  value: string | number | boolean | null,
  options: ParseCallbackOptions
) => Promise<ParsedValue>;

class Parser {
  debug = false;

  #dataStack: ParsedValue[];
  #gotoMarkMemory: Map<string, ParsedValue>;
  #memory: Memory;
  // #cb: CallableFunction;
  #cb: Callback;
  #lines: string[];

  /**
   * Max Count for looping, before throw Error.
   * @type {Number}
   */
  #maxLoops: number = 9999999999;
  #loops: number = 0;
  #activeSub?: SubDescription;
  #outputStack: unknown[] = [];
  #ignoredIfs: number = 0;
  #ignoreStack: boolean[] = [];
  #currentStackIndex: number = -1;
  #ifStack: (boolean | null)[] = [];

  #loopStack: (LoopDescription | false)[] = [];
  #currentLoopStackIndex: number = -1;

  constructor(
    lines: string[],
    cb: Callback,
    memory: Memory,
    dataStack: ParsedValue[],
    gotoMarkMemory: Map<string, ParsedValue>,
    debug?: boolean
  ) {
    this.#lines = lines;
    this.#cb = cb || (() => Promise.resolve(undefined));
    this.#memory = memory || new Memory();
    this.#dataStack = dataStack;
    this.#gotoMarkMemory = gotoMarkMemory;
    this.debug = debug !== undefined ? debug : this.debug;
  }

  get memory() {
    return this.#memory;
  }

  get lines() {
    return this.#lines;
  }

  parse(lines?: string[]): Promise<unknown[]> {
    lines = lines || Array<string>().concat(this.#lines);
    const line = lines.shift()?.trim();
    return new Promise(resolve => {
      if (this.#activeSub && line !== 'END SUB') {
        if (line) {
          this.#activeSub.lines.push(line);
        }
        resolve(undefined);
        return;
      }
      if (this.#maxLoops > 0 && this.#loops > this.#maxLoops) {
        throw new Error('BASIC INTERPRETER OVERFLOW');
      }
      this.#loops++;

      if (this.#currentLoopStackIndex >= 0) {
        const currentLoop = this.#loopStack[this.#currentLoopStackIndex];
        if (currentLoop) {
          this.#loopStack.forEach(loop => {
            if (currentLoop.count === 0 && loop) {
              if (line && loop.count === 0) {
                loop.lines.push(line);
              }
            }
          });

          if (line && (line === 'WEND' || /NEXT /.test(line))) {
            return currentLoop
              .condition()
              .then(async result => {
                currentLoop.tmpLines = currentLoop.tmpLines || lines;
                if (result) {
                  const lines_ = currentLoop.lines;
                  // this.#loopStack[this.#currentLoopStackIndex].lines = [];
                  currentLoop.count++;
                  if (currentLoop && typeof currentLoop.step === 'function') {
                    await currentLoop.step();
                  }
                  if (lines_.length > 0) {
                    return this.parse(Array<string>().concat(lines_));
                  } else {
                    // const lines = this.#loopStack[this.#currentLoopStackIndex].tmpLines || [];
                    this.#loopStack[this.#currentLoopStackIndex] = false;
                    this.#currentLoopStackIndex--;
                    this.#loopStack.pop();
                  }
                  return null;
                } else {
                  this.#loopStack[this.#currentLoopStackIndex] = false;
                  this.#currentLoopStackIndex--;
                  this.#loopStack.pop();
                  return null;
                }
              })
              .then(resolve);
          } else {
            resolve(undefined);
          }
        } else {
          resolve(undefined);
        }
      } else {
        resolve(undefined);
      }
    })

      .then(() => {
        if (!this.#activeSub && this.#currentStackIndex >= -1) {
          if (
            this.#ifStack[this.#currentStackIndex] !== undefined &&
            this.#ignoreStack[this.#currentStackIndex] === undefined
          ) {
            this.#ignoreStack.push(!this.#ifStack[this.#currentStackIndex]);
          }
          if (line === 'ELSE' && this.#ignoredIfs < 1) {
            this.#ignoreStack[this.#currentStackIndex] =
              !this.#ignoreStack[this.#currentStackIndex];
          }
        }
        if (!this.#ignoreStack[this.#currentStackIndex]) {
          return this.parseLine(line, lines);
        } else if (line && /^IF (\((.*)\)|(.*)) THEN$/.test(line)) {
          this.#ignoredIfs++;
        }
        return null;
      })
      .then(() => {
        if (
          this.#currentStackIndex > -1 &&
          (line === 'ENDIF' || line === 'END IF')
        ) {
          if (this.#ignoredIfs < 1) {
            this.#currentStackIndex--;
            this.#ifStack.pop();
            this.#ignoreStack.pop();
          } else {
            this.#ignoredIfs--;
          }
        }
        if (lines.length) {
          return this.parse(lines);
        } else {
          return this.#outputStack;
        }
      });
  }

  parseLine(line: string | undefined, lines: string[]) {
    return new Promise((resolve, reject) => {
      // remove start tabs and spaces
      line = (line || '').replace(/^[ \t]+/g, '');

      // remove comments
      if (/^ *[#/]+/.test(line)) {
        resolve(undefined);
        return;
      }

      // Goto
      if (/^GOTO +([\w\d]+)$/.test(line)) {
        const match = line.match(/^GOTO +([\w\d]+)$/) || [];
        this.commandGoto(lines, match[1]);
        // remove command from line
        line = '';
      }

      // SUB STATIC

      if (/^SUB (.*) STATIC$/.test(line)) {
        const match = line.match(/^SUB (.*) STATIC$/) || [];
        return this.commandSubStatic(match[1]).then(resolve);
      } else if (line === 'END SUB') {
        return this.commandEndSub().then(resolve);
      } else if (this.#activeSub) {
        resolve(undefined);
        return;
      }

      // IF THEN
      if (/^IF (\((.*)\)|(.*)) THEN$/.test(line)) {
        const match = line.match(/^IF (\((.*)\)|(.*)) THEN$/) || [];
        const value = match[3] || match[2];
        return this.commandIfThen(value).then(resolve);
      } else if (line === 'ELSE' || line === 'ENDIF' || line === 'END IF') {
        resolve(undefined);
        return;
      }

      // WHILE
      if (/^WHILE (.*)$/.test(line)) {
        const match = line.match(/^WHILE (.*)$/) || [];
        return this.commandWhile(match[1]).then(resolve);
      } else if (line === 'WEND') {
        resolve(undefined);
        return;
      }

      // FOR
      if (/^FOR (.*)$/.test(line)) {
        const match = line.match(/^FOR (.*)$/) || [];
        return this.commandFor(match[1]).then(resolve);
      } else if (line.startsWith('NEXT ')) {
        resolve(undefined);
        return;
      }

      // Goto Mark
      if (/^([\w\d]+):$/.test(line)) {
        resolve(undefined);
        return;
      }

      // dim (shared) variable
      if (/^DIM( SHARED)? +(.*)$/.test(line)) {
        const match = line.match(/^DIM( SHARED)? +(.*)$/) || [];
        return this.commandDimShared(match[2], !!match[1]).then(resolve);
      }

      // LET variable = value

      if (/^LET +([\w,$%]+)(\((.*)\))? *= *(.*)$/.test(line)) {
        const match = line.match(/^LET +([\w,$%]+)(\((.*)\))? *= *(.*)$/) || [];
        return this.commandLet(match[1], match[4], match[3]).then(() =>
          resolve(undefined)
        );
      }

      // read variable
      if (/^READ +([\w, $%]+)$/.test(line)) {
        const match = line.match(/^READ +([\w, $%]+)$/) || [];
        return this.commandRead(match[1]).then(resolve);
      }

      /**
      /**
       * BASIC script is over.
       */
      if (/^END[ ]*$/.test(line)) {
        return this.commandEnd().then(resolve);
      }

      if (/^(PAUSE|SLEEP) +(.+)/.test(line)) {
        const match = line.match(/^(PAUSE|SLEEP) +(.+)/) || [];
        const duration = match[2];
        return this.commandPause(duration).then(resolve);
      }

      if (/^CALL *(.*)/.test(line)) {
        const match = line.match(/^CALL *(.*)/) || [];
        return this.commandCall(match[1], lines).then(resolve);
      }

      if (/^EXECUTE *(FILE|EVAL) *(.*)/.test(line)) {
        const match = line.match(/^EXECUTE *(FILE|EVAL) *(.*)/) || [];
        return this.commandExecute(match[1], match[2])
          .then(resolve)
          .catch(reject);
      }

      // print using

      if (/^PRINT +USING +.*$/.test(line)) {
        const match = line.match(/^PRINT +USING +(.*)$/) || [];
        return this.commandPrintUsing(match[1]).then(resolve);
      }

      // print

      if (/^PRINT +(.*)$/.test(line)) {
        const match = line.match(/^PRINT +(.*)$/) || [];
        return this.commandPrint(match[1]).then(resolve);
      }

      // data variable

      if (/^DATA +(.*)$/.test(line)) {
        const match = line.match(/^DATA +(.*)$/) || [];
        return this.commandDataVar(match[1]).then(resolve);
      }

      this.#cb(line, { show: true })
        .then((data?: unknown) => {
          // TODO: ???
          if (data !== undefined) {
            this.#outputStack.push(data);
          }
        })
        .then(resolve)
        .catch(reject);
    });
  }

  async setReadStack(name: string, value: Value | ParsedValue) {
    let parsedValue: ParsedValue | number = await this.parseValue(value, true);
    if (typeof parsedValue === 'string' && isNumeric(parsedValue)) {
      parsedValue = parseFloat(parsedValue);
    }
    return this.#memory.set(name, parsedValue, true);
  }

  async addDataStack(value: Value) {
    let parsedValue: ParsedValue | number = await this.parseValue(value, true);
    if (typeof parsedValue === 'string' && isNumeric(parsedValue)) {
      parsedValue = parseFloat(parsedValue);
    }
    return this.#dataStack.push(parsedValue);
  }

  async setStack({
    name,
    value,
    index,
    global
  }: {
    name: string;
    value: Value | ParsedValue;
    index?: number | string;
    global?: boolean;
  }) {
    let parsedValue: ParsedValue | number = await this.parseValue(value, true);
    if (typeof parsedValue === 'string' && isNumeric(parsedValue)) {
      parsedValue = parseFloat(parsedValue);
    }
    if (index !== undefined) {
      index = Number(await this.parseValue(index, true));
      const entry = this.#memory.get(name) as
        | {
            [key: number]: Value;
          }
        | undefined;
      if (typeof entry === 'object') {
        entry[index - 1] = parsedValue as Value;
        return parsedValue;
      } else {
        throw new Error(`Index ${index} out of range`);
      }
    } else {
      return this.#memory.set(name, parsedValue, global);
    }
  }

  async setGotoMarkStack(name: string, value: Value) {
    this.#gotoMarkMemory.set(name, await this.parseValue(value, true));
  }

  async parseValue(
    value: string | number | boolean | DimValue | undefined,
    silent = true,
    skip = false
  ): Promise<ParsedValue> {
    if (value === undefined) {
      // Undefined
      return value;
      // } else if (isStringValue(value)) {
      //   // String
      //   return value;
      // return Promise.resolve(unwrapString(value));
    } else if (Array.isArray(value)) {
      // Array
      return value;
    } else if (typeof value === 'boolean') {
      return value;
    } else if (typeof value === 'number') {
      return Number(value);
    } else if (typeof value === 'string') {
      if (/^ *(true|false|TRUE|FALSE) *$/.test(value)) {
        return value.toLowerCase() === 'true';
      } else if (
        /^[\d]+$/.test(value.trim()) ||
        /^ *([\\-]?[\d.]+(e[-+]?\d+)?) *$/.test(value.trim())
      ) {
        return parseFloat(value);
      } else if (/^ *@"((.|\n)*)" *$/.test(value.trim())) {
        return value.replace(/^ *@"((.|\n)*)" *$/, '"$1"');
      } else if (/^"((\\"|[^"])+)"$/.test(value.trim())) {
        return value.trim().replace(/^"((\\"|[^"])+)"$/, '"$1"');
      } else if (/^[^"]?(.+)[^"]? *$/.test(value.replace(/ /g, ''))) {
        value = value.replace(/^ */g, '');
        if (this.#memory.has(value.replace(/ /g, ''))) {
          value = value.replace(/ /g, '');
          return this.parseValue(this.#memory.get(value), true);
        } else if (skip) {
          throw new Error(
            `Value processing continues: ${value.slice(0, 20)}…'`
          );
        } else {
          return this.#cb(value, { message: !silent ? value : undefined });
        }
      }
    }

    return undefined;
  }

  async executeCondition(
    valueA: StrictValue,
    condition: Condition | string,
    valueB: StrictValue
  ) {
    const parsedValueA = await this.parseValue(valueA, true);
    const parsedValueB = await this.parseValue(valueB, true);
    if (/^[=]?==$/.test(condition)) {
      return parsedValueA === parsedValueB;
    } else if (condition === '<>') {
      return parsedValueA !== parsedValueB;
    } else if (/^([<>][=]|[<>])?$/.test(condition)) {
      return compareCondition(parsedValueA, condition, parsedValueB);
    } else if (/^!=[=]?$/.test(condition)) {
      return parsedValueA !== parsedValueB;
    }
    return false;
  }

  // OPERATORS

  commandIfThen(value: StrictValue) {
    const condition = value.match(
      /([^<>]*) *(<>|<=|>=|<|>|[=!]{2,3}) *([^<>].*)/
    );
    if (condition) {
      return this.executeCondition(
        condition[1],
        condition[2] as Condition,
        condition[3]
      ).then(value => {
        this.#ifStack.push(value);
        this.#currentStackIndex++;
        return value;
      });
    } else {
      return this.parseValue(value[1], true).then(value => {
        let v = value;
        if (value instanceof DimEntry) {
          v = value.value;
        }
        this.#ifStack.push(!!v);
        this.#currentStackIndex++;
        return v;
      });
    }
  }

  commandWhile(value: StrictValue) {
    const condition = value.match(
      /([^<>]*) *(<>|<=|>=|<|>|[=!]{2,3}) *([^<>].*)/
    );
    if (condition) {
      return this.executeCondition(
        condition[1],
        condition[2],
        condition[3]
      ).then(value => {
        if (value) {
          this.#loopStack.push({
            count: 0,
            lines: [],
            condition: () =>
              this.executeCondition(condition[1], condition[2], condition[3])
          });
          this.#currentLoopStackIndex++;
          return value;
        }
      });
    }
    return Promise.resolve(undefined);
  }

  async commandFor(value: StrictValue) {
    const condition =
      value.match(/(.*) *= *(.*) +TO +(.*) +STEP[ ](.*)/) ||
      value.match(/(.*) *= *(.*) +TO +(.*)/);
    if (condition) {
      const parsedValueA = await this.parseValue(condition[2], true);
      // preparse TO value
      const parsedValueB = await this.parseValue(condition[3], true); // to
      this.#memory.set(condition[1], parsedValueA);
      this.#currentLoopStackIndex++;
      // to--;
      const step = async (set = true) => {
        let step = 1;
        if (condition[4]) {
          step = (await this.parseValue(condition[4], true)) as number;
        }
        if (set) {
          this.#memory.set(
            condition[1],
            Number(this.#memory.get(condition[1])) + step
          );
        }
        return step;
      };
      return this.#loopStack.push({
        step,
        count: 0,
        lines: [],
        condition: async () => {
          const value = await step(false);
          if (value === 0) {
            return false;
          } else {
            return this.executeCondition(
              `(${condition[1]}  )`,
              value < 0 ? '>' : '<',
              String(parsedValueB)
            );
          }
        }
      });
    }
  }

  commandSubStatic(value: StrictValue) {
    const condition = value.match(/^([\w,$%]+)(\((.*)\))?$/) || [];
    const name = condition[1];
    const args = CommandParser.resolveValues(
      CommandParser.extractValues(condition[3] || '', ',')
    );
    this.#activeSub = {
      name,
      lines: [],
      args
    };
    return Promise.resolve(undefined);
  }

  commandEndSub() {
    if (this.#activeSub) {
      const lines = this.#activeSub.lines;
      const argNames = this.#activeSub.args;
      this.#memory.addSub(this.#activeSub.name, async (...args) => {
        const values = await Promise.all(
          argNames.map((arg, i) => {
            return this.parseValue(args[Number(i)] as Value).then(value => ({
              arg,
              value
            }));
          })
        );
        values.forEach(({ arg, value }) => {
          if (arg) {
            this.#memory.add(String(arg), value);
          }
        });
        await this.parse(Array<string>().concat(lines));
      });
      this.#activeSub = undefined;
    } else {
      throw new Error('has no active SUB');
    }
    return Promise.resolve(undefined);
  }

  commandGoto(lines: string[], value: StrictValue) {
    lines.splice(0, lines.length);
    return this.parse(
      this.#lines.slice(this.#lines.indexOf(`${value}:`), this.#lines.length)
    );
  }

  commandDimShared(value: StrictValue, shared: boolean) {
    const dims = CommandParser.resolveValues(
      CommandParser.extractValues(value, ',')
    );

    return dims.reduce<Promise<Value | ParsedValue>>((result, dim) => {
      const splittedDim =
        String(dim || '').match(/^([\w, $%]+)?(\((.*)\))?$/) || [];
      if (!this.#memory.has(splittedDim[1])) {
        if (splittedDim[3]) {
          result = result.then(() => this.parseValue(splittedDim[3], true));
        }
        result = result.then(value => {
          this.setStack({
            name: splittedDim[1],
            value: value ? Array(value) : undefined,
            global: shared
          });

          return value;
        });
      }
      return result;
    }, Promise.resolve(undefined));
  }

  commandLet(name: string, value: StrictValue, index?: number | string) {
    if (this.#memory.has(name)) {
      return this.setStack({
        name,
        value,
        index
      });
    } else {
      throw new Error(`Variable ${name} not defined`);
    }
  }
  async commandPrintUsing(value: StrictValue) {
    const args = parse(value, {
      mergeArgs: true,
      mergeArgsBy: /^[+,]$/
    }).rawArgs;
    // console.debug('test', JSON.stringify(test, null, 2));
    const args_ = parse(args[2], {
      mergeArgs: true
    })
      .rawArgs.filter(arg => arg !== ',')
      .map(arg => this.parseValue(arg));
    // const resolvedArgs = [await this.parseValue(args[2], true)];
    const resolvedArgs = await Promise.all(args_);

    let result = unwrapString(args[0]);
    while (result.includes('#')) {
      const value = resolvedArgs.shift();

      const match = result.match(/(#+\.#+)|(#+)/);

      if (match && /(#+\.#+)/.test(match[0])) {
        const [patternA, patternB] = match[0].split('.');

        const [a, b] = String(value).split('.');
        const test =
          stringFill(
            String(a || '').slice(0, patternA.length),
            patternA.length,
            true,
            ' '
          ) +
          '.' +
          stringFill(
            String(b || '').slice(0, patternB.length),
            patternB.length,
            false,
            '0'
          );

        result = result.replace(/(#+\.#+)/, unwrapString(String(test)));
      } else {
        result = result.replace(/(#+|#+\.#+)/, unwrapString(String(value)));
      }
    }

    return this.#cb(null, {
      message: `"${unwrapString(result)}"`
    });
  }

  commandDataVar(value: StrictValue) {
    if (this.#dataStack.length === 0) {
      return Promise.all(value.split(',').map(data => this.addDataStack(data)));
    } else {
      throw new Error('DATA has already been declared');
    }
  }

  async commandPrint(value: StrictValue) {
    if (/^((".*"|[^"]*);([^;]*))$/.test(value)) {
      const args = value.match(/(.*);(.*)$/) || [];

      const parsedValue = await this.parseValue(args[1], true);

      const { rawArgs } = parse(String(args[2]), { mergeArgs: true });
      let parsedValues: string[] | ParsedValue[] = await Promise.all(
        rawArgs.map(arg => {
          return this.parseValue(arg, true);
        })
      );

      parsedValues = parsedValues.map(value => unwrapString(value));

      const message = parsedValues
        .map(value => `${unwrapString(parsedValue)}${value}`)
        .join(' ');
      return this.#cb(null, {
        message:
          isBoolean(message) || isNumeric(message) ? message : `"${message}"`
      });
    } else {
      let parsedValue: ParsedValue = await this.parseValue(value);
      const { rawArgs } = parse(String(parsedValue), { mergeArgs: true });

      let parsedValues: string[] | ParsedValue[] = await Promise.all(
        rawArgs.map(arg => {
          return this.parseValue(arg, true);
        })
      );

      parsedValues = parsedValues.map(value => unwrapString(value));
      if (parsedValues.length > 1) {
        parsedValue = parsedValues.join('');
      } else {
        parsedValue = parsedValues[0];
      }

      return this.#cb(null, {
        message:
          isBoolean(parsedValue) || isNumeric(parsedValue)
            ? parsedValue
            : `"${parsedValue}"`
      });
    }
  }

  commandEnd() {
    return Promise.resolve(undefined);
  }

  /**
   * Process Pause
   * @param {*} duration Milliseconds
   */
  async commandPause(duration: string | number) {
    const parsedDuration = Number(await this.parseValue(duration));
    return new Promise(resolve =>
      window.setTimeout(() => {
        resolve(undefined);
      }, parsedDuration)
    );
  }

  commandRead(value: StrictValue) {
    const reads = value.split(',');
    return Promise.all(
      reads.map(read => {
        const val = this.#dataStack.shift();
        this.setReadStack(read, val);
        return Promise.resolve(undefined);
      })
    );
  }

  /**
   * CALL SUBS
   * @param {*} value
   * @param {*} lines
   */
  commandCall(value: StrictValue, lines: string[]) {
    const match = value.match(/([^(]+)\(.*\)/) || [];
    const subName = match[1];
    if (this.#memory.hasSub(subName)) {
      return this.parseLine(value, lines);
    } else {
      throw new Error(`SUB ${subName} NOT FOUND`);
    }
  }

  /**
   * Execute File or Eval
   * @param {*} type
   * @param {*} value
   */

  async commandExecute(type: string, value: Value) {
    if (!this.#cb) {
      throw new Error('No callback available for readfile');
    }
    let data;
    switch (type) {
      case 'FILE':
        data = await this.#cb(`readfile ${value}`, { show: false });
        if (data && typeof data === 'object' && 'content' in data) {
          return this.#cb(data.content as string, { show: true });
        } else {
          throw new Error('File Content is empty');
        }
      case 'EVAL':
        return this.parseValue(value, false);
    }
  }
}

function compareCondition(
  a: Value | ParsedValue,
  condition: Condition | string,
  b: Value | ParsedValue
) {
  a = String(a);
  b = String(b);
  const compare = (condition.match(/^([<>][=]|[<>])$/) || [])[1];
  switch (compare) {
    case '<':
      return parseFloat(a) < parseFloat(b);
    case '>':
      return parseFloat(a) > parseFloat(b);
    case '<=':
      return parseFloat(a) <= parseFloat(b);
    case '>=':
      return parseFloat(a) >= parseFloat(b);
    default:
      return null;
  }
}

export default class BasicInterpreter {
  #memory: Memory;
  #callback?: CallableFunction;
  #gotoMarkMemory = new Map();
  #dataStack = [];

  constructor(memory: Memory, callback?: CallableFunction) {
    this.#callback = callback;
    this.#memory = memory;
  }

  get callback() {
    return this.#callback;
  }

  get memory() {
    return this.#memory;
  }

  async parse(
    lines: string[],
    callback?: CallableFunction,
    optionsOverride?: ParseCallbackOptions
  ) {
    if (lines.length === 0) {
      return;
    }
    if (lines.length > 1) {
      await this.readData(lines);
    }

    const output: (string | number)[] = [];
    const parser = new Parser(
      lines,
      async (value: unknown, options: ParseCallbackOptions) => {
        options = { ...options, ...optionsOverride };
        const result = await (callback || this.#callback || (() => undefined))(
          value,
          options
        );

        // IF (){}

        if (
          options.show &&
          // typeof result === 'string' &&
          result !== undefined
        ) {
          output.push(result);
        }
        return result;
      },
      this.#memory,
      this.#dataStack,
      this.#gotoMarkMemory
    );
    return parser.parse().then(() => output);
  }

  readData(lines: string[]) {
    const dataLine = lines.find(line => /^[ ]*DATA[ +]/.test(line));
    if (dataLine) {
      const dataLines = lines.splice(lines.indexOf(dataLine), 1);
      return this.parse(dataLines);
    }
    return Promise.resolve(undefined);
  }
}
