import Time from './NoteDescription/Time';
import type { TimeOptions } from './NoteDescription/Time';
import Note from './NoteDescription/Note';
import type { NoteOptions } from './NoteDescription/Note';

export interface NoteDescriptionOptions {
  index?: number;
  name?: string;
  note?: string | NoteOptions | Note;
  time?: string | TimeOptions | Time;
  velocity?: number;
  duration?: number;
  delay?: number;
}

export default class NoteDescription {
  static Time = Time;
  static Note = Note;

  note?: Note;
  time?: Time;

  index = -1;
  velocity = 0;
  delay: number;
  duration = 0;
  selected = false;

  constructor(options: string | NoteDescriptionOptions = {}) {
    if (typeof options === 'string') {
      options = { name: options };
    }
    const { index, name, note, time, velocity, duration, delay } = options;
    this.index = Number(index !== undefined ? index : -1);
    this.note = name || note ? new Note(name || note) : undefined;
    this.time = time ? new Time(time) : undefined;
    this.velocity = velocity !== undefined ? velocity : 0;
    this.duration = duration !== undefined ? duration : 0;
    this.delay = delay !== undefined ? Number(delay) : 0;
  }

  equals(description: NoteDescription) {
    return (
      this.note?.equals(description.note) &&
      this.time?.equals(description.time) &&
      this.velocity === description.velocity &&
      this.duration === description.duration
    );
  }

  get bindingCount() {
    if (this.time) {
      if (['t', 'n'].includes(this.time.character) && this.time.number >= 4) {
        return (
          {
            8: 1,
            16: 2,
            32: 3
          }[this.time.number] || 0
        );
      }
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
    return this.note?.toString() || '';
  }

  get octave() {
    return this.note?.octave || 0;
  }

  toSeconds() {
    return this.duration || this.time?.toSeconds() || 0;
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

  static create(options: string | NoteDescriptionOptions = {}) {
    return new NoteDescription(options);
  }
}
