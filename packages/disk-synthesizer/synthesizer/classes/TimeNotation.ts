export default class TimeNotation {
  number: number;
  baseCharacter: string;
  dot: boolean;
  triplet: boolean;
  constructor(notation: TimeNotation | string) {
    const { number, character, dot } = splitNotation(notation);
    this.number = number;
    this.baseCharacter = character;
    this.dot = dot || false;
    this.triplet = character === 't';
  }

  get character() {
    return this.triplet ? 't' : this.baseCharacter;
  }

  toString() {
    return `${this.number}${this.character}${this.dot ? '.' : ''}`;
  }

  static parse(duration: string | TimeNotation) {
    return new TimeNotation(duration);
  }
}

function splitNotation(notation: TimeNotation | string):
  | TimeNotation
  | {
      number: number;
      character: string;
      dot: boolean;
      triplet: boolean;
    } {
  if (notation instanceof TimeNotation) {
    return notation;
  }
  if (typeof notation === 'number') {
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
    console.error(error);
    debugger;
    throw error;
  }
}
