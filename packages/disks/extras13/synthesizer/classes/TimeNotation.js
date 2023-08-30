export default class TimeNotation {
  constructor(notation) {
    const { number, character, dot } = splitNotation(notation);
    this.number = Number(number);
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

  static parse(duration) {
    return new TimeNotation(duration);
  }
}

function splitNotation(notation) {
  if (notation instanceof TimeNotation) {
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
