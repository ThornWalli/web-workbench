import TimelineNoteDescription from '../classes/TimelineNoteDescription';
import { GROUP_DIRECTIONS } from '../types';
import { getNotePosition, getOctaveRangeFromNotes } from '../utils';

class NoteGroup {
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

class Beat {
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

export function prepareNotes(notes) {
  const { min: octave } = getOctaveRangeFromNotes(notes);

  return []
    .concat(notes)
    .sort((a, b) => {
      return a.delay - b.delay;
    })
    .map((note, index) => {
      return new TimelineNoteDescription({
        ...note,
        index,
        octavePosition: getNotePosition(octave, note)
      });
    });
}

export function getDurationFromGroupedNotes(groupedNotes) {
  return groupedNotes.reduce((result, [key, data]) => {
    return Math.max(
      data.reduce((result, { notes }) => {
        return Math.max(
          notes.reduce((result, note) => {
            return Math.max(note.delay + note.toSeconds(), result);
          }, 0),
          result
        );
      }, 0),
      result
    );
  }, 0);
}

export function beatsFromGroupedNotes(groupedNotes, speed = 1) {
  groupedNotes = Object.entries(groupedNotes);

  const beatDuration = speed * 2;
  const totalDuration = getDurationFromGroupedNotes(groupedNotes);

  const beatCount = Math.ceil(totalDuration / beatDuration);
  const beats = [];
  for (let beatIndex = 0; beatIndex < beatCount; beatIndex++) {
    const beat = [];

    for (let groupIndex = 0; groupIndex < groupedNotes.length; groupIndex++) {
      const [time, noteGroups] = groupedNotes[Number(groupIndex)];
      const filteredNotes = noteGroups.filter(
        ({ startSeconds, endSeconds }) => {
          return (
            startSeconds >= beatIndex * beatDuration &&
            endSeconds <= (beatIndex + 1) * beatDuration
          );
        }
      );
      if (filteredNotes.length) {
        beat.push([time, filteredNotes]);
      }
    }
    beats.push(
      new Beat({ noteGroups: Object.fromEntries(beat), index: beatIndex })
    );
  }

  return beats;
}

export function groupedNotesFromNotes(data) {
  const groupedByTime = data.reduce((result, note) => {
    const { time } = note;
    if (!result[time || 'pause']) {
      result[time || 'pause'] = [];
    }
    result[time || 'pause'].push(note);
    return result;
  }, {});

  const sorted = Object.entries(groupedByTime).map(([time, notes]) => {
    return [
      time,
      notes.sort((a, b) => {
        return a.octave - b.octave || a.delay - b.delay;
      })
    ];
  });

  const subGrouped = sorted
    .map(([time, notes]) => {
      return [time, groupedByInterest(notes)];
    })
    .sort((a, b) => {
      return a[0].localeCompare(b[0]);
    });

  return Object.fromEntries(subGrouped);
}

/**
 * Gruppiert alle Noten die zusammengehören und gibt ihnen eine Positon (octavePosition);
 */
function groupedByInterest(notes) {
  const result = [];

  while (notes.length) {
    const firstNote = notes.shift();

    let resultNotes = [];
    resultNotes = notes.reduce((result, note) => {
      if (note.delay >= firstNote.delay + firstNote.toSeconds()) {
        result.push(note);
      }
      return result;
    }, []);

    resultNotes = resultNotes.reduce((result, note) => {
      if (
        !result.length ||
        (result.length &&
          result[result.length - 1].delay <= note.delay + note.toSeconds())
      ) {
        result.push(note);
      }
      return result;
    }, []);

    resultNotes = resultNotes.reduce((result, note, index) => {
      if (
        resultNotes[0].delay - firstNote.delay <= 0.5 &&
        (!firstNote.time.triplet || (firstNote.time.triplet && index < 2))
      ) {
        result.push(note);
      }
      return result;
    }, []);

    resultNotes = resultNotes.reduce((result, note) => {
      if (
        note.delay - (firstNote.delay % 2) + note.toSeconds() <=
        firstNote.delay - (firstNote.delay % 2) + 2 - (firstNote.delay % 2)
      ) {
        result.push(note);
      }

      return result;
    }, []);

    let _align;
    let lastNote = firstNote;
    resultNotes = resultNotes.reduce((result, note) => {
      if (
        !_align ||
        _align === getAlign(note.octavePosition - lastNote.octavePosition)
      ) {
        result.push(note);
      }
      _align = getAlign(note.octavePosition - lastNote.octavePosition);

      lastNote = note;
      return result;
    }, []);

    const minRange = 1;
    let last;
    resultNotes = resultNotes.reduce((result, note) => {
      const position = (last || firstNote).octavePosition - note.octavePosition;
      if (position > -minRange && position < minRange) {
        result.push(note);
      }
      last = note;
      return result;
    }, []);

    let position = 0;
    if (resultNotes.length) {
      position = resultNotes[0].octavePosition - firstNote.octavePosition;
    }

    let align = GROUP_DIRECTIONS.ASCENDING;
    align = getAlign(position);

    notes = notes.filter(note => !resultNotes.includes(note));
    resultNotes.unshift(firstNote);
    result.push(new NoteGroup({ notes: resultNotes, align }));
  }

  return result;
}
function getAlign(position) {
  if (position < 0) {
    return GROUP_DIRECTIONS.DESCENDING;
  } else if (position > 0) {
    return GROUP_DIRECTIONS.ASCENDING;
  } else {
    return GROUP_DIRECTIONS.EQUAL;
  }
}
