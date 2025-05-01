import { getTransport, Time as ToneTime } from 'tone';

export interface TimeOptions {
  number?: number;
  character?: string;
  dot?: boolean;
  triplet?: boolean;
}

export interface ParsedTimeOptions extends TimeOptions {
  number: number;
  character: string;
  dot: boolean;
  triplet: boolean;
}

export default class Time {
  number;
  character;
  dot;
  triplet;

  constructor(options: string | TimeOptions = {}) {
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

  equals(time?: Time) {
    return this.toString() === time?.toString();
  }

  toSeconds() {
    return toSeconds(this.toString());
  }

  toString() {
    return `${this.number}${this.triplet ? 't' : this.character}${
      this.dot ? '.' : ''
    }`;
  }

  static parse(notation: string | Time): ParsedTimeOptions {
    if (notation instanceof Time) {
      return notation;
    }
    try {
      const [, number, character, dot] =
        notation.match(/^(\d+)([a-z])(\.?)$/i) || [];
      return {
        number: Number(number),
        character,
        dot: !!dot,
        triplet: character === 't'
      };
    } catch (error) {
      debugger;
      throw error;
    }
  }

  // valueOf() {
  //   return this.toString();
  // }

  toJSON() {
    return {
      number: this.number,
      character: this.character,
      dot: this.dot,
      triplet: this.triplet
    };
  }

  static create(options: string | TimeOptions | ParsedTimeOptions) {
    return new Time(options);
  }
}

function toSeconds(name: string) {
  try {
    const toneTime = ToneTime(name);
    return toneTime.toSeconds();
  } catch (error) {
    console.error(error);
    const v =
      {
        '1m': 2,
        '2m': 4,
        '2n': 1,
        '4n': 0.5,
        '8n': 0.25,
        '16n': 0.125,
        '32n': 0.0625
      }[name] || 0;
    return (v * getTransport()?.bpm?.value) / 120;
  }
}
