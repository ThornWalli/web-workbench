import { v4 as uuidv4 } from 'uuid';
import { isRangeOverlap } from 'range-overlap';
import { getDurationFromNotes, getOctaveRangeFromNotes } from '../utils';
import {
  beatsFromGroupedNotes,
  groupedNotesFromNotes
} from '../utils/noteTransform';
import NoteDescription from './NoteDescription';
import Notation from './TimeNotation';
const DEFAULT_TYPE = 'Synth';

const BEAT_DURATION = 2;
export default class Track {
  id;
  type;
  name;
  notes;
  baseNote;
  beatCount;
  noteCount;
  octaveCount;

  speed = 1;
  selectedIndex = -1;
  currentDuration = 0;

  constructor(options = {}) {
    const { id, type, name, notes, baseNote, beatCount, noteCount, speed } =
      options;
    this.id = id || uuidv4();
    this.type = type || DEFAULT_TYPE;
    this.name = name || 'Track';

    this.notes = (notes || []).map(note => new NoteDescription(note));
    this.refreshNotes();

    this.beatCount = Number(beatCount || 1);

    // `baseNote` und `noteCount` sind die Taktangabe (z.B. 4/4 oder 3/4)
    this.baseNote = Number(baseNote || 4);
    this.noteCount = Number(noteCount || 4);
    this.speed = Number(speed || 1);
  }

  setSelectedIndex(index) {
    this.selectedIndex = Number(index);
  }
  setCurrentDuration(duration) {
    this.currentDuration = Number(duration);
  }

  getOctaveRange() {
    const { min: start, length: count } = getOctaveRangeFromNotes(this.notes);
    return { start, count };
  }

  reset() {
    this.selectedIndex = -1;
    this.notes = [];
  }

  addNote(note = null) {
    note = new NoteDescription(note);
    if (
      !this.notes.find(note_ => {
        return (
          note_.getName() === note.getName() &&
          isRangeOverlap(
            note_.delay,
            note_.toSeconds(),
            note.delay,
            note.delay + note.toSeconds()
          )
        );
      })
    ) {
      this.notes.push(note);
      this.refreshNotes();
      return note;
    }
  }

  addNoteTo(noteIndex, note = null) {
    this.notes = [
      ...this.notes.slice(0, noteIndex + 1),
      new NoteDescription(note),
      ...this.notes.slice(noteIndex + 1)
    ];
    this.refreshNotes();
    return note;
  }

  getNote(index) {
    return this.notes[Number(index)];
  }

  replaceNote(noteIndex, note) {
    this.notes[Number(noteIndex)] = new NoteDescription(note);
    this.refreshNotes();
    return this.notes[Number(noteIndex)];
  }

  removeNote(noteIndex) {
    this.notes = this.notes.filter((_, i) => ![].concat(noteIndex).includes(i));
    this.refreshNotes();
  }

  refreshNotes() {
    this.notes = []
      .concat(this.notes)
      .sort((a, b) => {
        return a.delay - b.delay;
      })
      .map((note, index) => {
        note.index = index;
        return note;
      });
  }

  removeNotesByDurationRange(start, duration) {
    this.removeNote(
      this.getNotesByDurationRange(start, duration).map(({ index }) => index)
    );
  }

  removeNotesFromBeat(beatIndex) {
    const start = beatIndex * BEAT_DURATION;
    const duration = BEAT_DURATION;
    this.removeNotesByDurationRange(start, duration);
  }

  getDuration() {
    return getDurationFromNotes(this.notes);
  }

  getNotesByDurationRange(start, duration) {
    return this.notes.filter(note => {
      return isRangeOverlap(
        start,
        start + duration,
        note.delay,
        note.delay + note.toSeconds()
      );
    });
  }

  getVisibleBeatsByDuration(duration, notes = this.notes) {
    duration = duration !== undefined ? duration : this.currentDuration;
    const index = this.getBeatIndex(duration);
    notes = notes.filter(
      note =>
        note.delay >= index * BEAT_DURATION &&
        note.delay + note.toSeconds() <
          index * BEAT_DURATION + this.beatCount * BEAT_DURATION
    );

    const beats = this.getBeats(
      {
        selectedIndex: this.selectedIndex,
        speed: this.speed
      },
      notes
    );
    console.log('slice', notes.length);
    return beats.slice(index, index + this.beatCount);
  }

  getVisibleBeats() {
    const beats = this.getBeats({
      selectedIndex: this.selectedIndex,
      speed: this.speed
    });

    let index = beats.find(beat => beat.selected)?.index || 0;
    index = Math.floor(index / this.beatCount) * this.beatCount;

    return beats.slice(index, index + this.beatCount);
  }

  getNotationFromNoteCount() {
    return new Notation(`${this.noteCount}n`);
  }

  getBeats(options = {}, notes = this.notes) {
    const { selectedIndex, speed } = {
      selectedIndex: -1,
      speed: 1,
      ...options
    };
    if (
      selectedIndex > -1 &&
      notes.find(({ index }) => selectedIndex === index)
    ) {
      // console.log(
      //   'selectedIndex',
      //   notes.filter(({ index }) => selectedIndex.includes(index)),
      //   performance.now()
      // );
      notes
        .filter(({ index }) => selectedIndex === index)
        .forEach(note => {
          return (note.selected = true);
        });
    }
    const groupedNotes = groupedNotesFromNotes(notes);

    return beatsFromGroupedNotes(groupedNotes, speed);
  }

  getBeatIndex(duration = this.currentDuration) {
    return (
      (duration / (BEAT_DURATION * this.beatCount) -
        (duration % (BEAT_DURATION * this.beatCount)) /
          (BEAT_DURATION * this.beatCount)) *
      this.beatCount
    );
  }

  getCurrentNote() {
    return this.getNote(this.selectedIndex);
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
