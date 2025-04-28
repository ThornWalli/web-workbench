export default class NoteGroup {
  constructor({ align, notes }) {
    this.notes = notes;
    this.align = align;
  }

  get startSeconds() {
    return this.notes[0].delay;
  }

  get endSeconds() {
    const note = this.notes[this.notes.length - 1];
    return note.delay + note.toSeconds();
  }

  get selected() {
    return this.notes.some(({ selected }) => selected);
  }

  getNote(index) {
    return this.notes[Number(index)];
  }
}
