
import { fillString as stringFill, left as stringLeft } from '../utils/string';

import { isStringValue, cleanString } from '../utils/helper';
import CommandParser from './CommandParser';
import Memory from './Memory';

class Parser {
  #dataStack;
  #gotoMarkMemory;
  #memory;
  #cb;
  #lines;

  /**
   * Max Count for looping, before throw Error.
   * @type {Number}
   */
  #maxLoops = 9999999999;
  #loops = 0;
  #activeSub = null;
  #outputStack = [];
  #ignoredIfs = 0;
  #ignoreStack = [];
  #currentStackIndex = -1;
  #ifStack = [];

  #loopStack = [];
  #currentLoopStackIndex = -1;

  constructor (lines, cb, memory, dataStack = null, gotoMarkMemory = null) {
    this.#lines = lines;
    this.#cb = cb;
    this.#memory = memory || new Memory();
    this.#dataStack = dataStack;
    this.#gotoMarkMemory = gotoMarkMemory;
  }

  get memory () {
    return this.#memory;
  }

  get lines () {
    return this.#lines;
  }

  parse (lines) {
    lines = lines || [].concat(this.#lines);
    const line = lines.shift().replace(/^ */, '');

    // eslint-disable-next-line complexity
    return new Promise((resolve) => {
      if (this.#activeSub && line !== 'END SUB') {
        this.#activeSub.lines.push(line);
        resolve();
        return;
      }
      if (this.#maxLoops > 0 && this.#loops > this.#maxLoops) {
        throw new Error('BASIC INTERPRETER OVERFLOW');
      }
      this.#loops++;

      if (this.#currentLoopStackIndex >= 0) {
        this.#loopStack.forEach((loop) => {
          if (this.#loopStack[this.#currentLoopStackIndex].count === 0) {
            if (loop.count === 0) {
              loop.lines.push(line);
            }
          }
        });

        if (line === 'WEND' || /NEXT /.test(line)) {
          return this.#loopStack[this.#currentLoopStackIndex].condition().then(async (result) => {
            this.#loopStack[this.#currentLoopStackIndex].tmpLines = this.#loopStack[this.#currentLoopStackIndex].tmpLines || lines;
            if (result) {
              const lines_ = this.#loopStack[this.#currentLoopStackIndex].lines;
              // this.#loopStack[this.#currentLoopStackIndex].lines = [];
              this.#loopStack[this.#currentLoopStackIndex].count++;
              if ('step' in this.#loopStack[this.#currentLoopStackIndex]) {
                await this.#loopStack[this.#currentLoopStackIndex].step();
              }
              if (lines_.length > 0) {
                return this.parse([].concat(lines_));
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
          }).then(resolve);
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    })
      // eslint-disable-next-line complexity
      .then(() => {
        if (!this.#activeSub && this.#currentStackIndex >= -1) {
          if (this.#ifStack[this.#currentStackIndex] !== undefined && this.#ignoreStack[this.#currentStackIndex] === undefined) {
            this.#ignoreStack.push(!this.#ifStack[this.#currentStackIndex]);
          }
          if (line === 'ELSE' && this.#ignoredIfs < 1) {
            this.#ignoreStack[this.#currentStackIndex] = !this.#ignoreStack[this.#currentStackIndex];
          }
        }
        if (!this.#ignoreStack[this.#currentStackIndex]) {
          return this.parseLine(line, lines);
        } else if (/^IF (\((.*)\)|(.*)) THEN$/.test(line)) {
          this.#ignoredIfs++;
        }
        return null;
      })
      .then(() => {
        if (this.#currentStackIndex > -1 && (line === 'ENDIF' || line === 'END IF')) {
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

  parseLine (line, lines) {
    // eslint-disable-next-line complexity
    return new Promise((resolve, reject) => {
      // remove start tabs and spaces
      line = (line || '').replace(/^[ \t]+/g, '');

      // remove comments
      if (/^ *[#/]+/.test(line)) {
        resolve();
        return;
      }

      // SUB STATIC

      if (/^SUB (.*) STATIC$/.test(line)) {
        const match = line.match(/^SUB (.*) STATIC$/);
        return this.commandSubStatic(match[1]).then(resolve);
      } else if (line === 'END SUB') {
        return this.commandEndSub().then(resolve);
      } else if (this.#activeSub) {
        resolve();
        return;
      }

      // IF THEN
      if (/^IF (\((.*)\)|(.*)) THEN$/.test(line)) {
        const match = line.match(/^IF (\((.*)\)|(.*)) THEN$/);
        const value = (match[3] || match[2]);
        return this.commandIfThen(value).then(resolve);
      } else if (line === 'ELSE' || line === 'ENDIF' || line === 'END IF') {
        resolve();
        return;
      }

      // WHILE
      if (/^WHILE (.*)$/.test(line)) {
        const match = line.match(/^WHILE (.*)$/);
        return this.commandWhile(match[1]).then(resolve);
      } else if (line === 'WEND') {
        resolve();
        return;
      }

      // FOR
      if (/^FOR (.*)$/.test(line)) {
        const match = line.match(/^FOR (.*)$/);
        return this.commandFor(match[1]).then(resolve);
      } else if (line.startsWith('NEXT ')) {
        resolve();
        return;
      }

      // Goto Mark
      if (/^([\w\d]+):$/.test(line)) {
        resolve();
        return;
      }
      // Goto
      if (/^GOTO +([\w\d]+)$/.test(line)) {
        const match = line.match(/^GOTO +([\w\d]+)$/);
        this.commandGoto(lines, match[1]);
      }

      // dim (shared) variable
      if (/^DIM( SHARED)? +(.*)$/.test(line)) {
        const match = line.match(/^DIM( SHARED)? +(.*)$/);
        return this.commandDimShared(match[2], !!match[1]).then(resolve);
      }

      // LET variable = value
      // eslint-disable-next-line security/detect-unsafe-regex
      if (/^LET +([\w,$%]+)(\((.*)\))? *= *(.*)$/.test(line)) {
        // eslint-disable-next-line security/detect-unsafe-regex
        const match = line.match(/^LET +([\w,$%]+)(\((.*)\))? *= *(.*)$/);
        return this.commandLet(match[1], match[4], match[3]).then(() => resolve());
      }

      // read variable
      if (/^READ +([\w, $%]+)$/.test(line)) {
        const match = line.match(/^READ +([\w, $%]+)$/);
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
        const match = line.match(/^(PAUSE|SLEEP) +(.+)/);
        const duration = match[2];
        return this.commandPause(duration).then(resolve);
      }

      if (/^CALL *(.*)/.test(line)) {
        const match = line.match(/^CALL *(.*)/);
        return this.commandCall(match[1], lines).then(resolve);
      }

      if (/^EXECUTE *(FILE|EVAL) *(.*)/.test(line)) {
        const match = line.match(/^EXECUTE *(FILE|EVAL) *(.*)/);
        return this.commandExecute(match[1], match[2]).then(resolve).catch(reject);
      }

      // print using

      if (/^PRINT +USING +(.*);(.*)$/.test(line)) {
        const match = line.match(/^PRINT +USING +(.*);(.*)$/);
        return this.commandPrintUsing(match[1], match[2]).then(resolve);
      }
      // print

      if (/^PRINT +(.*)$/.test(line)) {
        const match = line.match(/^PRINT +(.*)$/);
        return this.commandPrint(match[1]).then(resolve);
      }

      // data variable

      if (/^DATA +(.*)$/.test(line)) {
        const match = line.match(/^DATA +(.*)$/);
        return this.commandDataVar(match[1]).then(resolve);
      }

      if (this.#cb) {
        this.#cb(line, { show: true })
          .then((data) => {
            // eslint-disable-next-line promise/always-return
            if (data) {
              this.#outputStack.push(data);
            }
          })
          .then(resolve)
          .catch(reject);
      } else {
        resolve();
      }
    });
  }

  async setReadStack (name, value) {
    let parsedValue = await this.parseValue(value, true);
    if (isNumeric(parsedValue)) {
      parsedValue = parseFloat(parsedValue);
    }
    return this.#memory.set(name, parsedValue, true);
  }

  async addDataStack (value) {
    let parsedValue = await this.parseValue(value, true);
    if (isNumeric(parsedValue)) {
      parsedValue = parseFloat(parsedValue);
    }
    return this.#dataStack.push(parsedValue);
  }

  async setStack ({ name, value, index, global }) {
    let parsedValue = await this.parseValue(value, true);
    if (isNumeric(parsedValue)) {
      parsedValue = parseFloat(parsedValue);
    }
    if (index !== undefined) {
      index = await this.parseValue(index, true);
      return (this.#memory.get(name)[index - 1] = parsedValue);
    } else {
      return this.#memory.set(name, parsedValue, global);
    }
  }

  async setGotoMarkStack (name, value) {
    this.#gotoMarkMemory.set(name, await this.parseValue(value, true));
  }

  // eslint-disable-next-line complexity
  parseValue (value, silent = true) {
    if (value === undefined) {
      // Undefined
      return Promise.resolve(value);
    } else if (isStringValue(value)) {
      // String
      return Promise.resolve(value);
      // return Promise.resolve(cleanString(value));
    } else if (Array.isArray(value)) {
      // Array
      return Promise.resolve(value);
    } else if (typeof value === 'boolean' || /^ *(true|false|TRUE|FALSE) *$/.test(value)) {
      if (typeof value !== 'boolean') {
        value = value.toLowerCase() === 'true';
      }
      return Promise.resolve(value);
    } else if (/^ *@"((.|\n)*)" *$/.test(value)) {
      return Promise.resolve(value.replace(/^ *@"((.|\n)*)" *$/, '"$1"'));
    } else if (/^ *"((\\"|[^"])*)" *$/.test(value)) {
      return Promise.resolve(value.replace(/^ *"((\\"|[^"])*)" *$/, '"$1"'));
    } else if (/^ *[\d]+ *$/.test(value)) {
      return Promise.resolve(parseFloat(value));
      // eslint-disable-next-line security/detect-unsafe-regex
    } else if (/^ *([\\-]?[\d.]+(e[-+]?\d+)?) *$/.test(value)) {
      return Promise.resolve(parseFloat(value));
    } else if (value && /^[^"]?(.*)[^"]? *$/.test(value.replace(/ /g, ''))) {
      value = value.replace(/^ */g, '');
      if (this.#memory.has(value.replace(/ /g, ''))) {
        value = value.replace(/ /g, '');
        return this.parseValue(this.#memory.get(value), true);
      } else {
        return this.#cb(value, { message: !silent ? value : undefined }).then((item) => {
          return item;
        });
      }
    }
    return Promise.resolve(null);
  }

  async executeCondition (valueA, condition, valueB) {
    valueA = await this.parseValue(valueA, true);
    valueB = await this.parseValue(valueB, true);
    if (/^[=]?==$/.test(condition)) {
      return valueA === valueB;
    } else if (condition === '<>') {
      return valueA !== valueB;
    } else if (/^([<>][=]|[<>])?$/.test(condition)) {
      return compareCondition(valueA, condition, valueB);
    } else if (/^!=[=]?$/.test(condition)) {
      return valueA !== valueB;
    }
    return null;
  }

  // OPERATORS

  commandIfThen (value) {
    const condition = value.match(/([^<>]*) *(<>|<=|>=|<|>|[=!]{2,3}) *([^<>].*)/);
    if (condition) {
      return this.executeCondition(condition[1], condition[2], condition[3]).then((value) => {
        this.#ifStack.push(value);
        this.#currentStackIndex++;
        return value;
      });
    } else {
      return this.parseValue(value[1], true)
        .then((value) => {
          this.#ifStack.push('value' in value ? value.value : value);
          this.#currentStackIndex++;
          return value;
        });
    }
  }

  commandWhile (value) {
    const condition = value.match(/([^<>]*) *(<>|<=|>=|<|>|[=!]{2,3}) *([^<>].*)/);
    if (condition) {
      // eslint-disable-next-line promise/catch-or-return
      return this.executeCondition(condition[1], condition[2], condition[3]).then((value) => {
        // eslint-disable-next-line promise/always-return
        if (value) {
          this.#loopStack.push({
            count: 0,
            lines: [],
            condition: () => this.executeCondition(condition[1], condition[2], condition[3])
          });
          this.#currentLoopStackIndex++;
          return value;
        }
      });
    }
    return Promise.resolve();
  }

  async commandFor (value) {
    const condition = value.match(/(.*) *= *(.*) +TO +(.*) +STEP[ ](.*)/) || value.match(/(.*) *= *(.*) +TO +(.*)/);
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
          step = await this.parseValue(condition[4], true);
        }
        if (set) {
          this.#memory.set(condition[1], this.#memory.get(condition[1]) + step);
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
            return this.executeCondition(`(${condition[1]}  )`, value < 0 ? '>' : '<', parsedValueB);
          }
        }
      });
    }
  }

  commandSubStatic (value) {
    // eslint-disable-next-line security/detect-unsafe-regex
    const condition = value.match(/^([\w,$%]+)(\((.*)\))?$/);
    const name = condition[1];
    const args = CommandParser.resolveValues(CommandParser.extractValues(condition[3] || '', ','));
    this.#activeSub = {
      name,
      lines: [],
      args
    };
    return Promise.resolve();
  }

  commandEndSub () {
    if (this.#activeSub) {
      const lines = this.#activeSub.lines;
      const argNames = this.#activeSub.args;
      this.#memory.addSub(this.#activeSub.name, async (...args) => {
        const values = await Promise.all(argNames.map((arg, i) => {
          return this.parseValue(args[Number(i)]).then(value => ({ arg, value }));
        }));
        values.forEach(({ arg, value }) => {
          this.#memory.add(arg, value);
        });
        await this.parse([].concat(lines));
      });
      this.#activeSub = null;
    } else {
      throw new Error('has no active SUB');
    }
    return Promise.resolve();
  }

  commandGoto (lines, value) {
    lines.splice(0, lines.length);
    return this.parse(this.#lines.slice(this.#lines.indexOf(`${value}:`), this.#lines.length));
  }

  commandDimShared (value, shared) {
    const dims = CommandParser.resolveValues(CommandParser.extractValues(value, ','));

    return dims.reduce((result, dim) => {
      // eslint-disable-next-line security/detect-unsafe-regex
      dim = dim.match(/^([\w, $%]+)?(\((.*)\))?$/);
      if (!this.#memory.has(dim[1])) {
        if (dim[3]) {
          result = result.then(() => this.parseValue(dim[3], true));
        }
        result = result.then(value => this.setStack({
          name: dim[1],
          // eslint-disable-next-line promise/always-return
          value: value ? Array(value) : undefined,
          global: shared
        }));
      }
      return result;
    }, Promise.resolve());
  }

  commandLet (name, value, index) {
    if (this.#memory.has(name)) {
      // eslint-disable-next-line promise/catch-or-return
      return this.setStack({
        name,
        value,
        index
        // eslint-disable-next-line promise/always-return
      });
    } else {
      // eslint-disable-next-line prefer-promise-reject-errors
      throw new Error(`Variable ${name} not defined`);
    }
  }

  async commandPrintUsing (value, args) {
    const parsedValue = await this.parseValue(value, true);
    try {
      if (args.includes(',')) {
        throw new Error('has ,'); ;
      }
      args = [
        await this.parseValue(args, true)
      ];
    } catch (error) {
      args = (await Promise.all(
        CommandParser.resolveValues(CommandParser.extractValues(args, ',')).reduce((result, arg) => {
          result.push(this.parseValue(arg, true));
          return result;
        }, [])
      ));
    }
    const parsedArgs = args.reduce((result, val) => {
      // eslint-disable-next-line security/detect-unsafe-regex
      const match = parsedValue.match(/((#+)(\.(#+))?)/);
      val = String(val);
      if (/[\d.]+/.test(val)) {
        val = val.split(/\./);
        if (match[4] && val.length > 1) {
          val[1] = stringLeft(stringFill(String(val[1]), match[4].length, false, '0'), match[4].length);
        } else {
          val.splice(1, 1);
        }
        val[0] = stringFill(String(val[0]), match[2].length, true, ' ');
        val = val.join('.');
      }
      // eslint-disable-next-line security/detect-unsafe-regex
      return result.replace(/(#+(\.#+)?)/, cleanString(val));
    }, parsedValue);

    return this.#cb(null, {
      message: `"${cleanString(parsedArgs)}"`
    });
  }

  commandDataVar (value) {
    if (this.#dataStack.length === 0) {
      return Promise.all(value.split(',').map(data => this.addDataStack(data)));
    } else {
      throw new Error('DATA has already been declared');
    }
  }

  async commandPrint (value) {
    if (/^((".*"|[^"]*);([^;]*))$/.test(value)) {
      const args = value.match(/(.*);(.*)$/);
      // eslint-disable-next-line promise/catch-or-return
      const parsedValue = await this.parseValue(args[1], true);
      // eslint-disable-next-line promise/no-nesting
      let parsedArgs = await Promise.all(
        CommandParser.resolveValues(CommandParser.extractValues(args[2], ' ')).reduce((result, arg) => {
          result.push(this.parseValue(arg, true));
          return result;
        }, [])
      );
      parsedArgs = parsedArgs
        .map((val) => {
          return `${cleanString(parsedValue)}${cleanString(val)}`;
        })
        .join(' ');
      return this.#cb(null, {
        message: `"${parsedArgs}"`
      });
    } else {
      let parsedValue = await this.parseValue(value);
      parsedValue = await Promise.all(CommandParser.resolveValues(CommandParser.extractValues(String(parsedValue), ' ')).map((arg) => {
        return this.parseValue(arg, true);
      }));
      parsedValue = parsedValue.map(value => cleanString(value));
      parsedValue = parsedValue.join('');

      return this.#cb(null, {
        message: isNumeric(parsedValue) ? parsedValue : `"${parsedValue}"`
      });
    }
  }

  commandEnd () {
    return Promise.resolve();
  }

  /**
   * Process Pause
   * @param {*} duration Milliseconds
   */
  async commandPause (duration) {
    const parsedDuration = await this.parseValue(duration);
    return new Promise(resolve => global.setTimeout(() => {
      resolve();
    }, parsedDuration));
  }

  commandRead (value) {
    const reads = value.split(',');
    return Promise.all(reads.map((read) => {
      const val = this.#dataStack.shift();
      this.setReadStack(read, val);
    }));
  }

  /**
    * CALL SUBS
    * @param {*} value
    * @param {*} lines
    */
  commandCall (value, lines) {
    const match = value.match(/([^(]+)\(.*\)/);
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
  // eslint-disable-next-line complexity
  async commandExecute (type, value) {
    if (!this.#cb) {
      throw new Error('No callback available for readfile');
    }
    console.log('READFILE', type, value);
    let val;
    switch (type) {
      case 'FILE':
        try {
          val = await this.#cb(`READFILE ${value}`, { show: false });
        } catch (error) {
          throw new Error(error);
        }
        console.log('READFILE', val);
        if (val !== undefined) {
          try {
            return this.#cb(val.value, { show: true });
          } catch (error) {
            throw new Error(error);
          }
        } else {
          throw new Error('File Content is empty');
        }
      case 'EVAL':
        try {
          return this.parseValue(value, { show: true });
        } catch (error) {
          throw new Error(error);
        }
    }
  }
}

function compareCondition (a, condition, b) {
  const compare = condition.match(/^([<>][=]|[<>])$/)[1];
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

function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export default class BasicInterpreter {
  #memory = new Map();
  #gotoMarkMemory = new Map();
  #dataStack = [];
  #callback;

  constructor (memory, callback) {
    this.#callback = callback;
    this.#memory = memory;
  }

  get callback () {
    return this.#callback;
  }

  get memory () {
    return this.#memory;
  }

  async parse (lines, callback, optionsOverride) {
    if (lines.length === 0) {
      return;
    }
    if (lines.length > 1) {
      await this.readData(lines);
    }

    const output = [];
    const parser = new Parser(lines, async (value, options) => {
      options = Object.assign({}, options, optionsOverride);
      const result = await (callback || this.#callback)(value, options);
      if (options.show && typeof result === 'string' && result !== 'undefined') {
        output.push(result);
      }
      return result;
    }, this.#memory, this.#dataStack, this.#gotoMarkMemory);
    return parser.parse().then(() => output);
  }

  readData (lines) {
    let dataLine = lines.find((line) => {
      if (/^[ ]*DATA[ +]/.test(line)) {
        return true;
      }
    });
    if (dataLine) {
      dataLine = lines.splice(lines.indexOf(dataLine), 1);
      return this.parse(dataLine);
    }
    return Promise.resolve();
  }
}
