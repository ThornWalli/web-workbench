import { NOTE_MODIFICATIONS } from '../../types';

export interface NoteOptions {
  name?: string;
  octave?: number;
  modification?: NOTE_MODIFICATIONS;
  flat?: boolean;
  doubleFlat?: boolean;
  sharp?: boolean;
  doubleSharp?: boolean;
}

export interface ParsedNoteOptions extends NoteOptions {
  name: string;
  octave: number;
  flat: boolean;
  doubleFlat: boolean;
  sharp: boolean;
  doubleSharp: boolean;
}

export default class Note {
  name: string;
  octave?: number = 4;
  modification = NOTE_MODIFICATIONS.NATURAL;

  constructor(options: string | NoteOptions = {}, overrides: NoteOptions = {}) {
    if (typeof options === 'string') {
      options = Note.parse(options);
    }

    const { name, octave, modification, flat, doubleFlat, sharp, doubleSharp } =
      {
        ...options,
        ...overrides
      };
    this.name = (name || '').toLowerCase();
    this.octave = (octave && Number(octave)) || undefined;

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

  equals(note?: Note) {
    return this.toString() === note?.toString();
  }

  get isPause() {
    return !this.name;
  }

  static isNatural(value: string) {
    return (
      !this.isFlat(value) &&
      !this.isSharp(value) &&
      !this.isDoubleSharp(value) &&
      !this.isDoubleFlat(value)
    );
  }

  static isFlat(value: string) {
    return /[b]/.test(value);
  }

  static isDoubleFlat(value: string) {
    return /(bb)/.test(value);
  }

  static isSharp(value: string) {
    return /#/.test(value);
  }

  static isDoubleSharp(value: string) {
    return /x|##/.test(value);
  }

  static parse(notation: string): ParsedNoteOptions {
    const [, name, modifier, octave] =
      // eslint-disable-next-line security/detect-unsafe-regex
      notation?.toLowerCase().match(/([a-g]{1})([bx#]{0,2})(\d+)?/i) || [];
    const doubleFlat = Note.isDoubleFlat(modifier) || false;
    const flat = (!doubleFlat && Note.isFlat(modifier)) || false;
    const doubleSharp = Note.isDoubleSharp(modifier) || false;
    const sharp =
      (!Note.isDoubleSharp(modifier) && Note.isSharp(modifier)) || false;
    return {
      name: name?.toLowerCase(),
      octave: Number(octave),
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

  toJSON() {
    return {
      name: this.name,
      octave: this.octave,
      sharp: this.sharp,
      doubleSharp: this.doubleSharp
    };
  }

  static create(options: string | NoteOptions = {}, overrides?: NoteOptions) {
    return new Note(options, overrides);
  }
}
