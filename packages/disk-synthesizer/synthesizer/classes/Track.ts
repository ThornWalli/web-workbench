import { isRangeOverlap } from 'range-overlap';
import { getDurationFromNotes, getOctaveRangeFromNotes } from '../utils/note';
import {
  beatsFromGroupedNotes,
  groupedNotesFromNotes
} from '../utils/noteTransform';
import NoteDescription from './NoteDescription';
import type { NoteDescriptionOptions } from './NoteDescription';
import Notation from './TimeNotation';
import TimelineNoteDescription from './TimelineNoteDescription';
import { INSTRUMENT } from '../types';
export interface TrackOptions {
  id?: string;
  type?: INSTRUMENT;
  name?: string;
  notes?: Partial<NoteDescriptionOptions>[];
  baseNote?: number;
  beatCount?: number;
  noteCount?: number;
  speed?: number;
}

const BEAT_DURATION = 2;
export default class Track {
  id;
  type: INSTRUMENT;
  name;
  notes: NoteDescription[];
  baseNote: number;
  beatCount: number;
  noteCount: number;

  speed = 1;
  selectedIndex = -1;
  currentDuration = 0;

  constructor(options: TrackOptions = {}) {
    const { id, type, name, notes, baseNote, beatCount, noteCount, speed } =
      options;
    this.id = id || crypto.randomUUID();
    this.type = type || INSTRUMENT.SYNTH;
    this.name = name || 'Track';

    this.notes = (notes || []).map(note => new NoteDescription(note));
    this.refreshNotes();

    this.beatCount = Number(beatCount || 1);

    // `baseNote` und `noteCount` sind die Taktangabe (z.B. 4/4 oder 3/4)
    this.baseNote = Number(baseNote || 4);
    this.noteCount = Number(noteCount || 4);
    this.speed = Number(speed || 1);
  }

  setSelectedIndex(index: number) {
    this.selectedIndex = index;
  }
  setCurrentDuration(duration: number) {
    this.currentDuration = duration;
  }

  getOctaveRange() {
    const { min: start, length: count } = getOctaveRangeFromNotes(this.notes);
    return { start, count };
  }

  reset() {
    this.selectedIndex = -1;
    this.notes = [];
  }

  addNote(note: string | NoteDescription) {
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

  addNoteTo(noteIndex: number, note: NoteDescription) {
    this.notes = [
      ...this.notes.slice(0, noteIndex + 1),
      new NoteDescription(note),
      ...this.notes.slice(noteIndex + 1)
    ];
    this.refreshNotes();
    return note;
  }

  getNote(index: number) {
    return this.notes[Number(index)];
  }

  replaceNote(noteIndex: number, note: string | NoteDescription) {
    this.notes[Number(noteIndex)] = new NoteDescription(note);
    this.refreshNotes();
    return this.notes[Number(noteIndex)];
  }

  removeNote(noteIndex: number) {
    this.notes = this.notes.filter((_, index) => noteIndex !== index);
    this.refreshNotes();
  }

  refreshNotes() {
    this.notes = [...this.notes]
      .sort((a, b) => {
        return a.delay - b.delay;
      })
      .map((note, index) => {
        note.index = index;
        return note;
      });
  }

  removeNotesByDurationRange(start: number, duration: number) {
    this.getNotesByDurationRange(start, duration).forEach(({ index }) =>
      this.removeNote(index)
    );
  }

  removeNotesFromBeat(beatIndex: number) {
    const start = beatIndex * BEAT_DURATION;
    const duration = BEAT_DURATION;
    this.removeNotesByDurationRange(start, duration);
  }

  getDuration() {
    return getDurationFromNotes(this.notes);
  }

  getNotesByDurationRange(start: number, duration: number) {
    return this.notes.filter(note => {
      return isRangeOverlap(
        start,
        start + duration,
        note.delay,
        note.delay + note.toSeconds()
      );
    });
  }

  getVisibleBeatsByDuration(
    duration?: number,
    notes: NoteDescription[] = this.notes
  ) {
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

    const timelineNoteDescriptions = notes.filter(
      note => note instanceof TimelineNoteDescription
    );

    if (timelineNoteDescriptions.length !== notes.length) {
      debugger;

      throw new Error('TimelineNoteDesciptions and notes not equal.');
    }

    const groupedNotes = groupedNotesFromNotes(timelineNoteDescriptions);

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
