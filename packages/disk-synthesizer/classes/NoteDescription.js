import { Time as ToneTime, Transport as ToneTranport } from 'tone';
import { NOTE_MODIFICATIONS } from '../types';

export class Note {
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

export class Time {
  number;
  character;
  dot;
  triplet;

  constructor(options = {}) {
    // e.g. 4n, 8t, 16n., 32n.
    if (typeof options === 'string') {
      options = Time.parse(options);
    }
    const { number, character, dot, triplet } = options;
    this.number = Number(number);
    this.dot = dot || false;
    this.triplet = triplet || character === 't';
    this.character = String(character).replace('t', 'n');
  }

  get preparedCharacter() {
    return this.triplet ? 't' : this.character;
  }

  equals(time) {
    return this.valueOf() === time?.valueOf();
  }

  toSeconds() {
    return toSeconds(this.toString());
  }

  toString() {
    return `${this.number}${this.triplet ? 't' : this.character}${
      this.dot ? '.' : ''
    }`;
  }

  static parse(notation) {
    if (notation instanceof Time) {
      return notation;
    }
    if (typeof notation === 'number') {
      return notation;
    }
    try {
      const [, number, character, dot] = notation.match(/^(\d+)([a-z])(\.?)$/i);
      return {
        number,
        character,
        dot: !!dot,
        triplet: character === 't'
      };
    } catch (error) {
      console.error(error);
      debugger;
      return null;
    }
  }

  valueOf() {
    return this.toString();
  }

  toJSON() {
    return {
      number: this.number,
      character: this.character,
      dot: this.dot,
      triplet: this.triplet
    };
  }

  static create(...args) {
    return new Time(...args);
  }
}

export default class NoteDescription {
  static Time = Time;
  static Note = Note;

  index = -1;
  velocity;
  delay;
  duration;
  constructor(options) {
    if (typeof options === 'string') {
      options = { name: options };
    }
    const { index, name, note, time, velocity, duration, delay } = options;
    this.index = Number(index !== undefined ? index : -1);
    this.note = (name || note) && new Note(name || note);
    this.time = time && new Time(time);
    this.velocity = velocity || undefined;
    this.duration = duration || undefined;
    this.delay = delay !== undefined ? Number(delay) : undefined;
  }

  equals(description) {
    return (
      this.note.equals(description.note) &&
      this.time.equals(description.time) &&
      this.velocity === description.velocity &&
      this.duration === description.duration
    );
  }

  get bindingCount() {
    if (['t', 'n'].includes(this.time.character) && this.time.number >= 4) {
      return (
        {
          8: 1,
          16: 2,
          32: 3
        }[this.time.number] || 0
      );
    }
    return 0;
  }

  getName() {
    return this.note?.toString();
  }

  getTime() {
    return this.time?.toString();
  }

  get isPause() {
    return !this.note?.name;
  }

  get name() {
    return this.note?.toString();
  }

  get octave() {
    return this.note?.octave;
  }

  toSeconds() {
    return this.duration || this.time.toSeconds();
  }

  toJSON() {
    return {
      note: this.note?.toJSON(),
      time: this.time?.toJSON(),
      velocity: this.velocity,
      duration: this.duration,
      delay: this.delay
    };
  }

  static create(...args) {
    return new NoteDescription(...args);
  }
}

function toSeconds(name) {
  try {
    return new ToneTime(name).toSeconds();
  } catch (error) {
    console.error(error);
    return (
      ({
        '1m': 2,
        '2m': 4,
        '2n': 1,
        '4n': 0.5,
        '8n': 0.25,
        '16n': 0.125,
        '32n': 0.0625
      }[String(name)] *
        ToneTranport?.bpm?.value) /
      120
    );
  }
}
