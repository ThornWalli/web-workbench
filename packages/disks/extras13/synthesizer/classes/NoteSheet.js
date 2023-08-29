import { getGroupedNotes, getNotePosition } from '../utils';
import NoteDescription from './NoteDescription';

export default class NoteSheet {
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
      beats: this.getVisibleBeats()
    };
  }

  getVisibleBeats() {
    const beats = this.getBeats();
    const index =
      Math.floor(this.getBeatIndex(beats) / this.track.beatCount) *
      this.track.beatCount;
    return beats.slice(index, index + this.track.beatCount);
  }

  getBeats() {
    const notation = this.track.noteCount;

    const max = (this.track.baseNote / notation.number) * 2;
    const startOctave = this.track.getOctaveRange().start;

    let count = 0;
    const notes = this.track.notes.map((note, index) => {
      note.index = index;
      note.position = getNotePosition(startOctave, note);
      note.selected = this.noteIndex === index;
      return note;
    });

    let beats = [];
    let beat = [];

    // debugger;

    for (let i = 0; i < notes.length; i++) {
      let note = notes[Number(i)];

      // || beat.length >= this.track.baseNote
      if (count + note.toSeconds() > max) {
        if (!note.name && note.toSeconds() > max - count) {
          const diff = max - count;

          beat.push(new NoteDescription({ ...note, duration: diff }));
          note = new NoteDescription({
            ...note,
            duration: note.toSeconds() - diff
          });

          beats.push(beat);
          const seconds = Math.floor(note.toSeconds() - diff / 2);
          const durations = [
            ...Array(seconds).fill(2),
            note.toSeconds() - diff - seconds * 2
          ];

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
}
