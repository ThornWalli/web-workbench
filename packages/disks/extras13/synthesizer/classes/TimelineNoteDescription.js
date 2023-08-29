import NoteDescription from './NoteDescription';

export default class TimelineNoteDescription extends NoteDescription {
  index = -1;
  constructor(options = {}) {
    super(options);
    const { selected, position, index, origin } = options || {};

    this.selected = selected !== undefined ? selected : false;
    this.position = position !== undefined ? position : 0;
    this.index = index !== undefined ? index : -1;
    this.origin = origin;
  }

  resolvedIndex() {
    return this.origin !== undefined ? this.origin.index : this.index;
  }
}
