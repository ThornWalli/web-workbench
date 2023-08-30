import { Time as ToneTime } from 'tone';

export class Note {
  name;
  octave = 4;
  sharp = false;
  doubleSharp = false;

  constructor(options = {}) {
    if (typeof options === 'string') {
      options = Note.parse(options);
    }
    const { name, octave, sharp, doubleSharp } = options;
    this.name = name || '';
    this.octave = (octave && Number(octave)) || null;
    this.sharp = sharp || false;
    this.doubleSharp = doubleSharp || false;
  }

  equals(note) {
    return this.valueOf() === note?.valueOf();
  }

  get isPause() {
    return !this.name;
  }

  static isSharp(value) {
    return /#/.test(value);
  }

  static isDoubleSharp(value) {
    return /[xX]/.test(value);
  }

  static parse(notation) {
    const [, name, sharpType, octave] =
      notation?.toUpperCase().match(/([cdefgabCDEFGAB]+)([xX#]?)(\d+)?/i) || [];
    const doubleSharp = Note.isDoubleSharp(sharpType) || false;
    const sharp = (!this.doubleSharp && Note.isSharp(sharpType)) || false;
    return {
      name: name?.toUpperCase(),
      octave,
      doubleSharp,
      sharp
    };
  }

  toString() {
    return `${this.name}${this.sharp ? '#' : this.doubleSharp ? 'X' : ''}${
      this.octave || ''
    }`;
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
    const { number, character, dot } = options;
    this.number = Number(number);
    this.character = character;
    this.dot = dot || false;
    this.triplet = character === 't';
  }

  equals(time) {
    return this.valueOf() === time?.valueOf();
  }

  toSeconds() {
    return new ToneTime(this.toString()).toSeconds();
  }

  toString() {
    return `${this.number}${this.character}${this.dot ? '.' : ''}`;
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

  velocity;
  duration;
  constructor(options) {
    const { name, note, time, velocity, duration } = options;
    this.note = (name || note) && new Note(name || note);
    this.time = time && new Time(time);
    this.velocity = velocity || undefined;
    this.duration = duration || undefined;
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
      note: this.note.toJSON(),
      time: this.time.toJSON(),
      velocity: this.velocity,
      duration: this.duration
    };
  }

  static create(...args) {
    return new NoteDescription(...args);
  }
}
