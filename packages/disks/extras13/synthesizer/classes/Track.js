import { getDurationFromNotes, getOctaveRangeFromNotes } from '../utils';
import NoteDescription from './NoteDescription';

const DEFAULT_TYPE = 'Synth';

export default class Track {
  type;
  name;
  notes;
  baseNote;
  beatCount;
  noteCount;
  startOctave;
  octaveCount;
  constructor(options) {
    const {
      type,
      name,
      notes,

      baseNote,
      beatCount,
      noteCount
    } = options;
    this.type = type || DEFAULT_TYPE;
    this.name = name || 'Track';
    // debugger;
    this.notes = (notes || []).map(note => NoteDescription.create(note));

    this.beatCount = beatCount || 1;

    // `baseNote` und `noteCount` sind die Taktangabe (z.B. 4/4 oder 3/4)
    this.baseNote = baseNote || 4;
    this.noteCount = noteCount || '4n';

    const { min: startOctave, length: octaveCount } = getOctaveRangeFromNotes(
      this.notes
    );
    this.startOctave = startOctave || 4;
    this.octaveCount = octaveCount || 1;
  }

  addNote(note = null) {
    this.notes.push(NoteDescription.create(note));
    return this.notes.length - 1;
  }

  addNoteTo(noteIndex, note = null) {
    this.notes = [
      ...this.notes.slice(0, noteIndex + 1),
      NoteDescription.create(note),
      ...this.notes.slice(noteIndex + 1)
    ];
    return noteIndex + 1;
  }

  getNote(index) {
    return this.notes[Number(index)];
  }

  replaceNote(noteIndex, note) {
    this.notes[Number(noteIndex)] = NoteDescription.create(note);
    return noteIndex;
  }

  removeNote(noteIndex) {
    this.notes = this.notes.filter((_, i) => i !== noteIndex);
    return noteIndex - 1;
  }

  getDuration() {
    return getDurationFromNotes(this.notes);
  }
}
