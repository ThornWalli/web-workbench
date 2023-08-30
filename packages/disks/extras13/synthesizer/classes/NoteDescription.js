import { Time } from 'tone';
import Notation from './TimeNotation';

export default class NoteDescription {
  // eslint-disable-next-line complexity
  constructor({ name, duration, velocity, time, dot, triplet }) {
    if (typeof duration === 'string') {
      const durationNotation = Notation.parse(duration);

      durationNotation.triplet =
        triplet !== undefined ? triplet : durationNotation.triplet;
      durationNotation.dot = dot !== undefined ? dot : durationNotation.dot;

      this.duration = durationNotation.toString();
    } else {
      this.duration = (duration && Number(duration)) || undefined;
    }

    this.name = name || '';
    this.doubleSharp = this.name.includes('x');
    this.sharp = !this.doubleSharp && this.name.includes('#');
    this.velocity = velocity || undefined;
    this.time = time;
    this.dot = dot || false;
    this.triplet = triplet || false;
  }

  get bindingCount() {
    if (
      ['t', 'n'].includes(this.notation.character) &&
      this.notation.number >= 4
    ) {
      return (
        {
          8: 1,
          16: 2,
          32: 3
        }[this.notation.number] || 0
      );
    }
    return 0;
  }

  get notation() {
    if (this.time) {
      const notation = Notation.parse(this.time);
      notation.dot = this.dot;
      notation.triplet = this.triplet;
      return notation;
    }
    return null;
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
    return new Time(this.duration || this.time).toSeconds();
  }

  static create(...args) {
    return new NoteDescription(...args);
  }
}
