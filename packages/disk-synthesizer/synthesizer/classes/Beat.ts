import type NoteGroup from './NoteGroup';

export default class Beat {
  noteGroups: {
    [key: string]: NoteGroup[];
  };
  index: number;
  constructor({
    noteGroups,
    index
  }: {
    noteGroups: {
      [key: string]: NoteGroup[];
    };
    index: number;
  }) {
    this.noteGroups = noteGroups;
    this.index = index;
  }

  get empty() {
    return !Object.values(this.noteGroups).length;
  }

  get selected() {
    return Object.values(this.noteGroups).some(noteGroups => {
      return noteGroups.some(noteGroup =>
        noteGroup.notes.some(noteGroup => noteGroup.selected)
      );
    });
  }
}
