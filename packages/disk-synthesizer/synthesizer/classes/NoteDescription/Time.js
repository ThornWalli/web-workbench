import { Time as ToneTime, Transport as ToneTranport } from 'tone';

export default class Time {
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
