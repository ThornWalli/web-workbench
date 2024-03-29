import { v4 as uuidv4 } from 'uuid';
import {
  getDurationFromNotes,
  getOctaveRangeFromNotes,
  getGroupedNotes,
  getNotePosition
} from '../utils';
import NoteDescription from './NoteDescription';
import Notation from './Notation';
const DEFAULT_TYPE = 'Synth';

export default class Track {
  id;
  type;
  name;
  notes;
  baseNote;
  beatCount;
  noteCount;
  octaveCount;

  selectedIndex = -1;

  constructor(options = {}) {
    const {
      id,
      type,
      name,
      notes,
      baseNote,
      beatCount,
      noteCount,
      selectedIndex
    } = options;
    this.id = id || uuidv4();
    this.type = type || DEFAULT_TYPE;
    this.name = name || 'Track';
    // debugger;
    this.notes = (notes || []).map(note => new NoteDescription(note));

    this.beatCount = Number(beatCount || 1);

    // `baseNote` und `noteCount` sind die Taktangabe (z.B. 4/4 oder 3/4)
    this.baseNote = Number(baseNote || 4);
    this.noteCount = Number(noteCount || 4);
    this.selectedIndex = selectedIndex === undefined ? -1 : selectedIndex;
  }

  getOctaveRange() {
    const { min: start, length: count } = getOctaveRangeFromNotes(this.notes);
    return { start, count };
  }

  addNote(note = null) {
    this.notes.push(new NoteDescription(note));
    const nextIndex = this.notes.length - 1;
    this.selectedIndex = nextIndex;
    return nextIndex;
  }

  addNoteTo(noteIndex, note = null) {
    this.notes = [
      ...this.notes.slice(0, noteIndex + 1),
      new NoteDescription(note),
      ...this.notes.slice(noteIndex + 1)
    ];
    const nextIndex = noteIndex + 1;
    this.selectedIndex = nextIndex;
    return nextIndex;
  }

  getNote(index) {
    return this.notes[Number(index)];
  }

  replaceNote(noteIndex, note) {
    this.notes[Number(noteIndex)] = new NoteDescription(note);
    return noteIndex;
  }

  removeNote(noteIndex) {
    this.notes = this.notes.filter((_, i) => i !== noteIndex);
    const nextIndex = noteIndex - 1;
    this.selectedIndex = nextIndex;
    return nextIndex;
  }

  getDuration() {
    return getDurationFromNotes(this.notes);
  }

  getVisibleBeats() {
    const beats = this.getBeats({ selectedIndex: this.selectedIndex });
    const index =
      Math.floor(this.getBeatIndex(beats) / this.beatCount) * this.beatCount;
    return beats.slice(index, index + this.beatCount);
  }

  getNotationFromNoteCount() {
    return new Notation(`${this.noteCount}n`);
  }

  getBeats(options = {}) {
    const { selectedIndex } = { selectedIndex: -1, ...options };

    const notation = this.getNotationFromNoteCount();

    const max = (this.baseNote / notation.number) * 2;
    const startOctave = this.getOctaveRange().start;

    let count = 0;
    let notes = this.notes.map(
      (note, index) =>
        new NoteDescription({
          ...note,
          index,
          position: getNotePosition(startOctave, note),
          selected: selectedIndex === index
        })
    );

    // flat pause notes

    notes = flatNotes(notes);

    let beats = [];
    let beat = [];

    for (let i = 0; i < notes.length; i++) {
      let note = notes[Number(i)];
      if (count + note.toSeconds() > max) {
        // splitting pause only with durations; ignore pause with time
        let diff = count + note.toSeconds() - max;

        if (!note.name && !note.time && diff > 0) {
          if (max - count > 0) {
            diff -= max - count;
            beat.push(new NoteDescription({ ...note, duration: max - count }));
          }
          beats.push(beat);

          const restSeconds = diff % 2;
          const beatCount = (diff - restSeconds) / 2;

          const durations = [...Array(beatCount).fill(2), restSeconds].filter(
            v => v > 0
          );

          durations
            .slice(0, durations.length - 1)
            .forEach(duration =>
              beats.push([new NoteDescription({ ...note, duration })])
            );
          note = new NoteDescription({
            ...note,
            duration: durations[durations.length - 1]
          });
        } else {
          beats.push(beat);
          if (count - max >= max) {
            beats.push([]);
          }
        }
        beat = [];
        count = 0;
      }
      count += note.toSeconds();
      beat.push(note);
    }
    beats.push(beat);

    beats = beats.map(notes => {
      return {
        groupedNotes: getGroupedNotes(notes),
        selected: !!notes.find(({ selected }) => selected)
      };
    });

    return beats;
  }

  getBeatIndex(beats) {
    beats = beats || this.getBeats();
    return Math.max(
      beats.indexOf(
        beats.find(({ groupedNotes }) =>
          groupedNotes.find(({ notes }) =>
            notes.find(({ selected }) => selected)
          )
        )
      ),
      0
    );
  }

  selectPrevNote() {
    this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
  }

  selectNextNote() {
    this.selectedIndex = Math.min(
      this.selectedIndex + 1,
      this.notes.length - 1
    );
  }
}

function flatNotes(notes) {
  const flatNotes = [];
  let notePause = [];
  for (let i = 0; i < notes.length; i++) {
    const note = notes[Number(i)];
    if (!note.name && !note.time && note.duration) {
      notePause.push(note);
    } else {
      if (notePause.length) {
        flatNotes.push(
          new NoteDescription({
            duration: notePause.reduce(
              (result, { duration }) => result + duration,
              0
            )
          })
        );
      }
      flatNotes.push(note);
      notePause = [];
    }
  }
  if (notePause.length) {
    flatNotes.push(
      new NoteDescription({
        duration: notePause.reduce(
          (result, { duration }) => result + duration,
          0
        )
      })
    );
  }
  return flatNotes;
}
