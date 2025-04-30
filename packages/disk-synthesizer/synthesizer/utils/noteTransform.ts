import TimelineNoteDescription from '../classes/TimelineNoteDescription';
import { GROUP_DIRECTION } from '../types';
import { getNotePosition, getOctaveRangeFromNotes } from './note';
import Beat from '../classes/Beat';
import NoteGroup from '../classes/NoteGroup';
import type NoteDescription from '../classes/NoteDescription';

export function prepareNotes(notes: NoteDescription[]) {
  const { min: octave } = getOctaveRangeFromNotes(notes);

  return Array<NoteDescription>()
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

type GroupedNoteObject = { [key: string]: NoteGroup[] };
type GroupedNoteList = [value: string, data: NoteGroup[]];

export function getDurationFromGroupedNotes(groupedNotes: GroupedNoteList[]) {
  return groupedNotes.reduce((result, [, data]) => {
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

export function beatsFromGroupedNotes(
  groupedNotes: GroupedNoteObject,
  speed = 1
) {
  const groupedNotes_: GroupedNoteList[] = Object.entries(groupedNotes);

  const beatDuration = speed * 2;
  const totalDuration = getDurationFromGroupedNotes(groupedNotes_);

  const beatCount = Math.ceil(totalDuration / beatDuration);
  const beats = [];
  for (let beatIndex = 0; beatIndex < beatCount; beatIndex++) {
    const beat = [];

    for (let groupIndex = 0; groupIndex < groupedNotes_.length; groupIndex++) {
      const [time, noteGroups] = groupedNotes_[Number(groupIndex)];
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

export function groupedNotesFromNotes(data: TimelineNoteDescription[]) {
  const groupedByTime = data.reduce<{
    [key: string]: TimelineNoteDescription[];
  }>((result, note) => {
    const { time } = note;
    const solvedTime = time?.toString();
    if (!result[solvedTime || 'pause']) {
      result[solvedTime || 'pause'] = [];
    }
    result[solvedTime || 'pause'].push(note);
    return result;
  }, {});

  const sorted = Object.entries(groupedByTime).map<
    [string, TimelineNoteDescription[]]
  >(([time, notes]) => {
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
      return a.toString()[0].localeCompare(b.toString()[0]);
    });

  return Object.fromEntries(subGrouped);
}

/**
 * Gruppiert alle Noten die zusammengehören und gibt ihnen eine Positon (octavePosition);
 */
function groupedByInterest(notes: TimelineNoteDescription[]) {
  const result = [];

  while (notes.length) {
    const firstNote = notes.shift() as TimelineNoteDescription;

    let resultNotes: TimelineNoteDescription[] = [];
    resultNotes = notes.reduce<TimelineNoteDescription[]>((result, note) => {
      if (note.delay >= firstNote.delay + firstNote.toSeconds()) {
        result.push(note);
      }
      return result;
    }, []);

    resultNotes = resultNotes.reduce<TimelineNoteDescription[]>(
      (result, note) => {
        if (
          !result.length ||
          (result.length &&
            result[result.length - 1].delay <= note.delay + note.toSeconds())
        ) {
          result.push(note);
        }
        return result;
      },
      []
    );

    resultNotes = resultNotes.reduce<TimelineNoteDescription[]>(
      (result, note, index) => {
        if (
          resultNotes[0].delay - firstNote.delay <= 0.5 &&
          (!firstNote.time?.triplet || (firstNote.time.triplet && index < 2))
        ) {
          result.push(note);
        }
        return result;
      },
      []
    );

    resultNotes = resultNotes.reduce<TimelineNoteDescription[]>(
      (result, note) => {
        if (
          note.delay - (firstNote.delay % 2) + note.toSeconds() <=
          firstNote.delay - (firstNote.delay % 2) + 2 - (firstNote.delay % 2)
        ) {
          result.push(note);
        }

        return result;
      },
      []
    );

    let _align: boolean | string = false;
    let lastNote = firstNote;
    resultNotes = resultNotes.reduce<TimelineNoteDescription[]>(
      (result, note) => {
        if (
          !_align ||
          _align === getAlign(note.octavePosition - lastNote.octavePosition)
        ) {
          result.push(note);
        }
        _align = getAlign(note.octavePosition - lastNote.octavePosition);

        lastNote = note;
        return result;
      },
      []
    );

    const minRange = 1;
    let last: TimelineNoteDescription | undefined;
    resultNotes = resultNotes.reduce<TimelineNoteDescription[]>(
      (result, note) => {
        const position =
          (last || firstNote).octavePosition - note.octavePosition;
        if (position > -minRange && position < minRange) {
          result.push(note);
        }
        last = note;
        return result;
      },
      []
    );

    let position = 0;
    if (resultNotes.length) {
      position = resultNotes[0].octavePosition - firstNote.octavePosition;
    }

    let align = GROUP_DIRECTION.ASCENDING;
    align = getAlign(position);

    notes = notes.filter(note => !resultNotes.includes(note));
    resultNotes.unshift(firstNote);
    result.push(new NoteGroup({ notes: resultNotes, align }));
  }

  return result;
}
function getAlign(position: number) {
  if (position < 0) {
    return GROUP_DIRECTION.DESCENDING;
  } else if (position > 0) {
    return GROUP_DIRECTION.ASCENDING;
  } else {
    return GROUP_DIRECTION.EQUAL;
  }
}
