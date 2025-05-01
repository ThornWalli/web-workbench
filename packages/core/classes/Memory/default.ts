// import { Value, StringValue, IntegerValue, FloatValue } from './Value';

const FUNCTION_VOID = Symbol('void');

export { FUNCTION_VOID };

export type DimValue = string | number | boolean | object | undefined;
type AsyncFunction<Args extends unknown[], Return> = (
  ...args: Args
) => Promise<Return>;

export type EntryValue<Args extends unknown[] = unknown[], Return = unknown> =
  | string
  | number
  | AsyncFunction<Args, Return>;

// type EntryValue<Return> =
//   | string
//   | number
//   | ((...args: unknown[]) => Promise<unknown>)
//   | AsyncFunction<Args, Return>;
interface IEntry {
  name: string;
}
class Entry<TValue = EntryValue> implements IEntry {
  name;
  #value: TValue;
  global = false;
  private readonly = false;

  constructor(name: string, value: TValue, global: boolean, readonly: boolean) {
    this.name = name;
    this.#value = value;
    this.global = global || this.global;
    this.readonly = readonly || this.readonly;
  }
  [key: number]: unknown;

  get value() {
    return this.#value;
  }

  set value(value) {
    if (!this.readonly) {
      this.#value = value;
    }
  }
}
class SubEntry<EntryValue> extends Entry<EntryValue> {
  constructor(name: string, value: EntryValue, global: boolean = false) {
    super(name, value, global, true);
  }

  async execute(...args: unknown[]) {
    if (typeof this.value === 'function') {
      return this.value(...args);
    }
  }
}

export class DimEntry extends Entry<DimValue> {}

interface PrefixStack {
  name: string;
  global: boolean;
}

export default class Memory {
  #dims: Map<string, DimEntry> = new Map();
  #subs: Map<string, IEntry> = new Map();
  #prefixStack: PrefixStack[] = [];

  /**
   * Remove all not global variables, subs and clean prefixStack.
   */
  reset() {
    this.resetPrefixStack();
    this.#dims.clear();
    this.#subs.clear();
  }

  /**
   * Remove all not global variables, subs and clean prefixStack.
   */
  resetPrefixStack() {
    this.#prefixStack = [];
  }

  get prefixStack() {
    return this.#prefixStack;
  }

  get currentPrefixStack() {
    return this.#prefixStack[this.#prefixStack.length - 1];
  }

  has(name: string) {
    name = name.replace(/(.*[^ ])[ ]+$/, '$1');
    name = name.replace(/[$%]$/, '');
    if (
      !this.#dims.get(name) ||
      (this.#dims.get(name) && !this.#dims.get(name)?.global)
    ) {
      name = this.prepareName(name);
    }
    return this.#dims.has(name);
  }

  add(name: string, value: DimValue, readonly = false, global = false) {
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

  get(name: string) {
    name = name.replace(/(.*[^ ])[ ]+$/, '$1');
    const last = name;
    name = name.replace(/[$%]$/, '');
    if (
      !this.#dims.get(name) ||
      (this.#dims.get(name) && !this.#dims.get(name)?.global)
    ) {
      name = this.prepareName(name);
    }

    const dimEntry = this.#dims.get(name);
    if (dimEntry) {
      let innerValue = dimEntry.value;
      if (innerValue && typeof innerValue === 'string') {
        if (/\$$/.test(last)) {
          innerValue = String(innerValue);
        } else if (/\\%$/.test(last) || /^\d+$/.test(innerValue)) {
          innerValue = parseInt(innerValue);
        } else if (/^[\d.]+$/.test(innerValue)) {
          innerValue = parseFloat(innerValue);
        }
      }
      return innerValue;
    }
  }

  set(name: string, value: DimValue, readonly = false, global = false) {
    name = name.replace(/(.*[^ ])[ ]+$/, '$1');

    if (typeof value === 'string') {
      if (/[$]$/.test(name)) {
        if (value === undefined) {
          value = '';
        } else {
          value = String(value);
        }
      } else if (/[%]$/.test(name)) {
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
          entry.value = value;
        }
      }
    } else {
      this.add(name, value, readonly, global);
    }
  }

  addSub<Args extends unknown[], Result>(
    name: string,
    value: EntryValue<Args, Result>
  ) {
    name = this.prepareName(name, false);
    if (!this.has(name)) {
      this.#subs.set(name, new SubEntry<EntryValue<Args, Result>>(name, value));
    }
  }

  async executeSub<R, Args, EntryValue>(
    name: string,
    args: Args[] = [],
    global = false
  ) {
    args = args || [];
    name = this.prepareName(name, false);
    this.#prefixStack.push({
      name: `${Math.round(Math.random() * 10000)}`,
      global
    });
    const sub = this.#subs.get(name) as SubEntry<EntryValue>;
    return sub?.execute(...args).then(value => {
      this.#dims.forEach(dim => {
        // remove all sub dims
        if (
          RegExp(
            `[$]{3}${this.#prefixStack[this.#prefixStack.length - 1].name}$`
          ).test(dim.name)
        ) {
          this.#dims.delete(dim.name);
        }
      });
      this.#prefixStack.pop();
      return value as R;
    });
  }

  hasSub(name: string) {
    name = this.prepareName(name, false);
    return this.#subs.has(name);
  }

  prepareName(name: string, prefixed = true) {
    if (typeof name === 'string') {
      name = name.replace(/ /g, '');
    }
    if (prefixed && this.#prefixStack.length && !/[$]{3}/.test(name)) {
      name = `${name}$$$${
        this.#prefixStack[this.#prefixStack.length - 1].name
      }`;
    }
    return name;
  }

  get dims() {
    return this.#dims;
  }

  get subs() {
    return this.#subs;
  }
}
