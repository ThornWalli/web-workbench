export default class Notation {
  constructor(notation) {
    const { number, character, dot } = splitNotation(notation);
    this.number = Number(number);
    this.character = character;
    this.dot = dot || false;
    this.triplet = false;
  }

  toString() {
    return `${this.number}${this.character}${this.dot ? '.' : ''}`;
  }

  static parse(duration) {
    return new Notation(duration);
  }
}

function splitNotation(notation) {
  if (typeof notation === 'number') {
    return notation;
  }
  try {
    const [, number, character, dot] = notation.match(/^(\d+)([a-z])(\.?)$/i);
    return {
      number,
      character,
      dot: !!dot
    };
  } catch (error) {
    debugger;
    return null;
  }
}
