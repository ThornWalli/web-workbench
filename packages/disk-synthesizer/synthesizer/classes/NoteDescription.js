import Time from './NoteDescription/Time';
import Note from './NoteDescription/Note';

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
