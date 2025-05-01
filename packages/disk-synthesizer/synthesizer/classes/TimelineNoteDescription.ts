import NoteDescription from './NoteDescription';
import type NoteDescriptionNote from './NoteDescription/Note';
import type NoteDescriptionTime from './NoteDescription/Time';

export default class TimelineNoteDescription extends NoteDescription {
  octavePosition: number;
  origin?: TimelineNoteDescription;
  constructor(
    options: {
      selected?: boolean;
      octavePosition?: number;
      origin?: TimelineNoteDescription;
      index?: number;
      name?: string;
      note?: string | NoteDescriptionNote;
      time?: string | NoteDescriptionTime;
      velocity?: number;
      duration?: number;
      delay?: number;
    } = {}
  ) {
    super(options);
    const { selected, octavePosition, origin } = options || {};

    this.selected = selected !== undefined ? selected : false;
    this.octavePosition = octavePosition !== undefined ? octavePosition : 0;
    this.origin = origin;
  }

  resolvedIndex() {
    return this.origin !== undefined ? this.origin.index : this.index;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      selected: this.selected,
      octavePosition: this.octavePosition,
      index: this.index
    };
  }
}
