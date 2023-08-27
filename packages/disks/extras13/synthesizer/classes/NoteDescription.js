import { Time } from 'tone';
import Notation from './Notation';

export default class NoteDescription {
  // eslint-disable-next-line complexity
  constructor({
    name,
    duration,
    velocity,
    time,
    dot,
    triplet,
    selected,
    position
  }) {
    if (typeof duration === 'string' || duration === undefined) {
      const durationNotation = Notation.parse(duration || time);

      durationNotation.triplet =
        triplet !== undefined ? triplet : durationNotation.triplet;
      durationNotation.dot = dot !== undefined ? dot : durationNotation.dot;

      this.duration = durationNotation.toString();
    } else {
      this.duration = Number(duration);
    }

    this.name = name || '';
    this.doubleSharp = this.name.includes('x');
    this.sharp = !this.doubleSharp && this.name.includes('#');
    this.velocity = velocity || undefined;
    this.time = time || 0;
    this.dot = dot || false;
    this.triplet = triplet || false;
    this.selected = selected !== undefined ? selected : false;
    this.position = position !== undefined ? position : undefined;
  }

  get bindingCount() {
    if (
      ['t', 'n'].includes(this.notation.character) &&
      this.notation.number >= 4
    ) {
      return (
        {
          4: 1,
          8: 2,
          16: 3,
          32: 4
        }[this.notation.number] || 0
      );
    }
    return 0;
  }

  get notation() {
    return Notation.parse(this.time);
  }

  get timeNotation() {
    return Notation.parse(this.time);
  }

  get octave() {
    return this.name ? Number(this.name.match(/\d+/)[0]) : 0;
  }

  isPaused() {
    return !this.name;
  }

  toSeconds() {
    return new Time(this.duration).toSeconds();
  }

  static create(...args) {
    return new NoteDescription(...args);
  }
}
