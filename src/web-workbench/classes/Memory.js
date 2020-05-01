// import { Value, StringValue, IntegerValue, FloatValue } from './Value';

const FUNCTION_VOID = Symbol('void');

export { FUNCTION_VOID };

class Entry {
  #name;
  #value;
  #global = false;
  #readonly = false;

  constructor (name, value, global, readonly) {
    this.#name = name;
    this.#value = value;
    this.#global = global || this.#global;
    this.#readonly = readonly || this.#readonly;
  }

  get name () {
    return this.#name;
  }

  get value () {
    return this.#value;
  }

  set value (value) {
    if (!this.readonly) {
      this.#value = value;
    }
  }

  get global () {
    return this.#global;
  }

  get readonly () {
    return this.#readonly;
  }
}
class SubEntry extends Entry {
  constructor (name, value, global) {
    super(name, value, global, true);
  }

  execute (args) {
    return this.value.apply(this, args);
  }
}
class DimEntry extends Entry {

}

export default class Memory {
  #dims = new Map();;
  #subs = new Map();;
  #prefixStack = [];

  /**
     * Remove all not global variables, subs and clean prefixStack.
     */
  reset () {
    this.resetPrefixStack();
    this.#dims.clear();
    this.#subs.clear();
  }

  /**
     * Remove all not global variables, subs and clean prefixStack.
     */
  resetPrefixStack () {
    this.#prefixStack = [];
  }

  get prefixStack () {
    return this.#prefixStack;
  }

  get currentPrefixStack () {
    return this.#prefixStack[this.#prefixStack.length - 1];
  }

  has (name) {
    name = name.replace(/(.*[^ ])[ ]+$/, '$1');
    name = name.replace(/[$%]$/, '');
    if (!this.#dims.get(name) || (this.#dims.get(name) && !this.#dims.get(name).global)) {
      name = this.prepareName(name);
    }
    return this.#dims.has(name);
  }

  add (name, value, readonly = false, global = false) {
    name = name.replace(/(.*[^ ])[ ]+$/, '$1');
    if (/\$$/.test(name)) {
      if (value === undefined) {
        value = '';
      }
    } else if (/\\%$/.test(name)) {
      if (value === undefined) {
        value = 0;
      }
    }
    name = name.replace(/[$%]$/, '');
    name = this.prepareName(name);
    if (!this.has(name)) {
      this.#dims.set(name, new DimEntry(name, value, readonly, global));
    }
  }

  // eslint-disable-next-line complexity
  get (name) {
    name = name.replace(/(.*[^ ])[ ]+$/, '$1');
    const last = name;
    name = name.replace(/[$%]$/, '');
    if (!this.#dims.get(name) || (this.#dims.get(name) && !this.#dims.get(name).global)) {
      name = this.prepareName(name);
    }
    let value = this.#dims.get(name);
    if (!value) {
      return null;
    }
    value = value.value;
    if (/\$$/.test(last)) {
      value = String(value); // new StringValue(value);
    } else if (/\\%$/.test(last) || /^\d+$/.test(value)) {
      value = parseInt(value); // new IntegerValue(value);
    } else if (/^[\d.]+$/.test(value)) {
      value = parseFloat(value); // new FloatValue(value);
    }
    //  else {
    //   value = new Value(value);
    // }
    return value;
  }

  // eslint-disable-next-line complexity
  set (name, value, readonly = false, global = false) {
    name = name.replace(/(.*[^ ])[ ]+$/, '$1');

    // const ValueClass = Value;
    if (typeof value !== 'object') {
      if (/[$]$/.test(name)) {
      // ValueClass = StringValue;
        if (value === undefined) {
          value = '';
        } else {
          value = String(value);
        }
      } else if (/[%]$/.test(name)) {
      // ValueClass = IntegerValue;
        if (value === undefined) {
          value = 0;
        } else {
          value = parseInt(value);
        }
      }
    }
    name = name.replace(/[$%]$/, '');
    name = this.prepareName(name);

    if (this.has(name)) {
      const entry = this.#dims.get(name);
      if (entry instanceof DimEntry) {
        if (entry) {
          entry.value = value;// Array.isArray(value) ? value : new ValueClass(value);
        }
      }
    } else {
      this.add(name, value, readonly, global);
    }
  }

  addSub (name, value) {
    name = this.prepareName(name, false);
    if (!this.has(name)) {
      this.#subs.set(name, new SubEntry(name, value));
    }
  }

  executeSub (name, args, global = false) {
    name = this.prepareName(name, false);
    this.#prefixStack.push({
      name: `${parseInt(Math.random() * 10000)}`,
      global
    });
    return this.#subs.get(name)
      .execute(args)
      .then((value) => {
        this.#dims.forEach((dim) => {
          // remove all sub dims
          if (RegExp(`[$]{3}${this.#prefixStack[this.#prefixStack.length - 1].name}$`).test(dim.name)) {
            this.#dims.delete(dim.name);
          }
        });
        this.#prefixStack.pop();
        return value;
      });
  }

  hasSub (name) {
    name = this.prepareName(name, false);
    return this.#subs.has(name);
  }

  prepareName (name, prefixed = true) {
    if (typeof name === 'string') {
      name = name.replace(/ /g, '');
    }
    if (prefixed && this.#prefixStack.length && !/[$]{3}/.test(name)) {
      name = `${name}$$$${this.#prefixStack[this.#prefixStack.length - 1].name}`;
    }
    return name;
  }

  get dims () {
    return this.#dims;
  }

  get subs () {
    return this.#subs;
  }
}
