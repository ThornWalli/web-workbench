import NoteDescription from './NoteDescription';

export default class TimelineNoteDescription extends NoteDescription {
  constructor(options = {}) {
    super(options);
    const { selected, octavePosition, origin } = options || {};

    this.selected = selected !== undefined ? selected : false;
    this.octavePosition = octavePosition !== undefined ? octavePosition : 0;
    this.origin = origin;
  }

  resolvedIndex() {
    return this.origin !== undefined ? this.origin.index : this.index;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      selected: this.selected,
      octavePosition: this.octavePosition,
      index: this.index
    };
  }
}
