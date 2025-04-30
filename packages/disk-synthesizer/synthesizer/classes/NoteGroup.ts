import type TimelineNoteDescription from './TimelineNoteDescription';

export default class NoteGroup {
  notes: TimelineNoteDescription[];
  align: string;

  constructor({
    align,
    notes
  }: {
    align: string;
    notes: TimelineNoteDescription[];
  }) {
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

  getNote(index: number) {
    return this.notes[Number(index)];
  }
}
