import { NOTE_MODIFICATIONS } from '../../types';

export default class Note {
  name;
  octave = 4;
  modification = NOTE_MODIFICATIONS.NATURAL;
  // natural = true;
  // flat = false;
  // doubleFlat = false;
  // sharp = false;
  // doubleSharp = false;
  constructor(options = {}, overrides = {}) {
    if (typeof options === 'string') {
      options = Note.parse(options);
    }

    const { name, octave, modification, flat, doubleFlat, sharp, doubleSharp } =
      {
        ...options,
        ...overrides
      };
    this.name = (name || '').toLowerCase();
    this.octave = (octave && Number(octave)) || null;

    if (flat) {
      this.modification = NOTE_MODIFICATIONS.FLAT;
    } else if (doubleFlat) {
      this.modification = NOTE_MODIFICATIONS.DOUBLE_FLAT;
    } else if (sharp) {
      this.modification = NOTE_MODIFICATIONS.SHARP;
    } else if (doubleSharp) {
      this.modification = NOTE_MODIFICATIONS.DOUBLE_SHARP;
    } else if (modification) {
      this.modification = modification;
    } else {
      this.modification = NOTE_MODIFICATIONS.NATURAL;
    }
  }

  get natural() {
    return this.modification === NOTE_MODIFICATIONS.NATURAL;
  }

  get flat() {
    return this.modification === NOTE_MODIFICATIONS.FLAT;
  }

  get doubleFlat() {
    return this.modification === NOTE_MODIFICATIONS.DOUBLE_FLAT;
  }

  get sharp() {
    return this.modification === NOTE_MODIFICATIONS.SHARP;
  }

  get doubleSharp() {
    return this.modification === NOTE_MODIFICATIONS.DOUBLE_SHARP;
  }

  equals(note) {
    return this.valueOf() === note?.valueOf();
  }

  get isPause() {
    return !this.name;
  }

  static isNatural(value) {
    return (
      !this.isFlat(value) &&
      !this.isSharp(value) &&
      !this.isDoubleSharp(value) &&
      !this.isDoubleFlat(value)
    );
  }

  static isFlat(value) {
    return /[b]/.test(value);
  }

  static isDoubleFlat(value) {
    return /(bb)/.test(value);
  }

  static isSharp(value) {
    return /#/.test(value);
  }

  static isDoubleSharp(value) {
    return /x|##/.test(value);
  }

  static parse(notation) {
    const [, name, modifier, octave] =
      // eslint-disable-next-line security/detect-unsafe-regex
      notation?.toLowerCase().match(/([a-g]{1})([bx#]{0,2})(\d+)?/i) || [];
    const doubleFlat = Note.isDoubleFlat(modifier) || false;
    const flat = (!doubleFlat && Note.isFlat(modifier)) || false;
    const doubleSharp = Note.isDoubleSharp(modifier) || false;
    const sharp = (!this.doubleSharp && Note.isSharp(modifier)) || false;
    return {
      name: name?.toLowerCase(),
      octave,
      flat,
      doubleFlat,
      sharp,
      doubleSharp
    };
  }

  toString() {
    let test = '';

    if (this.flat) {
      test = 'b';
    } else if (this.doubleFlat) {
      test = 'bb';
    }

    if (this.sharp) {
      test += '#';
    } else if (this.doubleSharp) {
      test += 'x';
    }

    return `${this.name}${test}${this.octave || ''}`;
  }

  valueOf() {
    return this.toString();
  }

  toJSON() {
    return {
      name: this.name,
      octave: this.octave,
      sharp: this.sharp,
      doubleSharp: this.doubleSharp
    };
  }

  static create(...args) {
    return new Note(...args);
  }
}
