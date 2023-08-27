import {
  getBeatsFromGroupedNotes,
  getGroupedNotes,
  getNotePosition
} from '../utils';
import NoteDescription from './NoteDescription';

export default class NoteSheet {
  startOctave;
  noteIndex;
  track;

  constructor(track, options) {
    if (track) {
      this.track = track;
    } else {
      throw new Error('NoteDiagram requires an track');
    }
    const { noteIndex } = options || {};
    this.noteIndex = noteIndex === undefined ? -1 : noteIndex;
  }

  toData() {
    return {
      baseNote: this.track.baseNote,
      noteCount: this.track.noteCount,
      beatCount: this.track.beatCount,
      beats: this.getVisibleBeats(),
      startOctave: this.track.startOctave,
      octaveCount: this.track.octaveCount
    };
  }

  getVisibleBeats() {
    const beats = this.getBeats();
    const index =
      Math.floor(this.getBeatIndex() / this.track.beatCount) *
      this.track.beatCount;
    return beats.slice(index, index + this.track.beatCount);
  }

  getBeats() {
    const notes = this.track.notes.map((note, index) =>
      NoteDescription.create({
        ...note,
        index,
        selected: index === this.noteIndex,
        position: getNotePosition(this.track.startOctave, note)
      })
    );
    const groupedNotes = getGroupedNotes(this.track.startOctave, notes);
    return getBeatsFromGroupedNotes(groupedNotes);
  }

  getBeatIndex() {
    const beats = this.getBeats();
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
}
