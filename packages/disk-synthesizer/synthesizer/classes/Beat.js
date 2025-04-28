export default class Beat {
  constructor({ noteGroups, index }) {
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

  getGroupFromNoteIndex(noteIndex) {
    return this.noteGroups.find(group => group.getNote(noteIndex));
  }

  getNoteFromNoteIndex(noteIndex) {
    return this.noteGroups
      .find(group => group.getNote(noteIndex))
      .getNote(noteIndex);
  }
  // getNoteFromNoteGroup(noteIndex) {
  //   const noteGroup = this.notes[noteIndex];
  //   return noteGroup.getNote(
  //     noteGroup.notes.findIndex(({ selected }) => selected)
  //   );
  // }
}
