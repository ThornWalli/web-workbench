import { Time, Sequence } from 'tone';
import * as Tone from 'tone';
import TimelineNoteDescription from '../classes/TimelineNoteDescription';
import { GROUP_DIRECTION } from '../types';
import type NoteDescription from '../classes/NoteDescription';

import type { Note } from 'webmidi';
import type { NoteDescriptionOptions } from '../classes/NoteDescription';
import type { Seconds } from 'tone/build/esm/core/type/Units';

export interface GroupDescription {
  startOctave: number;
  max?: number;
  time?: string;
  count: number;
  notes: NoteDescription[];
  direction?: GROUP_DIRECTION;
}
export interface BeatDescription {
  groupedNotes: GroupDescription[];
  selected?: NoteDescription;
}

export function getBaseNotes() {
  return Object.fromEntries([2, 4, 8, 12, 16].map(v => [String(v), v]));
}

export function getNotes(short = false, tripletValues = false) {
  if (short) {
    return Object.fromEntries(
      Object.entries({
        // '2m': '2',
        '1m': '1',
        '2n': '1/2',
        '4n': '1/4',
        '8n': '1/8',
        '16n': '1/16',
        '32n': '1/32'
        // '64n': '1/64'
      }).map(([key, value]) => {
        return [key + (tripletValues ? '.' : ''), value];
      })
    );
  }

  return {
    // '2m': 'Double Whole Note',
    '1m': 'Whole Note',
    '2n': 'Half Note',
    '4n': 'Quarter Note',
    '8n': 'Eighth Note',
    '16n': 'Sixteenth Note',
    '32n': 'Thirty-second Note'
    // '64n': 'Sixty-fourth Note'
  };
}

export function playSequence(synth: Tone.Synth, notes: Note[]) {
  const sequence = new Sequence({
    subdivision: '8n',
    loop: false,
    events: notes,
    callback: (time, note: Note) => {
      synth.triggerAttackRelease(note.name, note.duration, time);
    }
  });
  return sequence;
}

export function getDecibelFromValue(normalizeValue: number) {
  return Math.max(Math.min((-1 + normalizeValue / 0.5) * 30, 30), -30);
}

export const BASE_NOTE_HEIGHT = 9;

// eslint-disable-next-line complexity
export function getGroupedNotes(notes: NoteDescription[]) {
  // debugger;
  const groups = [];
  let lastNote: NoteDescription | undefined = undefined;
  let group: GroupDescription | undefined = undefined;
  // const lastDirection = NOTE_DIRECTIONS.DEFAULT;
  for (let i = 0; i < notes.length; i++) {
    const noteDescription = notes[Number(i)];
    // debugger;
    let direction = GROUP_DIRECTION.DEFAULT;
    if (
      noteDescription?.time &&
      lastNote?.time &&
      noteDescription.time.equals(lastNote.time) &&
      noteDescription.octave !== undefined &&
      lastNote.octave !== undefined
    ) {
      if (
        lastNote &&
        getNoteScaleIndex(lastNote.name) + maxNoteIndex * lastNote.octave >
          getNoteScaleIndex(noteDescription.name) +
            maxNoteIndex * noteDescription.octave
      ) {
        direction = GROUP_DIRECTION.DESCENDING;
      } else if (
        getNoteScaleIndex(lastNote.name) + maxNoteIndex * lastNote.octave <
        getNoteScaleIndex(noteDescription.name) +
          maxNoteIndex * noteDescription.octave
      ) {
        direction = GROUP_DIRECTION.ASCENDING;
      } else {
        direction = GROUP_DIRECTION.EQUAL;
      }
    }

    if (
      noteDescription.octave &&
      (!group ||
        (group.startOctave &&
          lastNote &&
          Math.abs(noteDescription.octave - group.startOctave) >= 2) ||
        (group.direction || direction) !== direction ||
        // (group.max > 0 && group?.notes?.length >= group.max) ||
        (noteDescription.name && !lastNote?.name) ||
        (noteDescription.time &&
          !noteDescription.time.equals(lastNote?.time)) ||
        group.count >= 1)
    ) {
      let max = noteDescription.time && noteDescription.time.number / 2;
      if (noteDescription.time?.triplet) {
        max = -1;
      }
      group = {
        startOctave: noteDescription.octave,
        max,
        time: noteDescription.time?.toString(),
        count: 0,
        notes: []
      };
      groups.push(group);
    } else if (group) {
      group.direction = direction;
    }
    lastNote = noteDescription;
    if (group) {
      group.count += getNoteValue(noteDescription) || 0;
      group.notes.push(new TimelineNoteDescription(noteDescription));
    }
  }
  return groups;
}

export function getBeatsFromGroupedNotes(groupedNotes: GroupDescription[]) {
  groupedNotes = Array.from(groupedNotes);
  let beat: BeatDescription | undefined = undefined;

  let count = 0;

  const beats = groupedNotes.reduce<BeatDescription[]>(
    (result, groupedNote) => {
      if (count + groupedNote.count > 1) {
        beat = undefined;
      }
      if (!beat) {
        beat = { groupedNotes: [] };
        result.push(beat);
        count = 0;
      }
      beat.groupedNotes.push(groupedNote);
      count += groupedNote.count;

      return result;
    },
    []
  );
  return beats.map(beat => {
    return {
      ...beat,
      selected: beat.groupedNotes.find(({ notes }) =>
        notes.find(({ selected }) => selected)
      )
    };
  });
}

export function getNotePosition(startOctave: number, note: NoteDescription) {
  let name = note.name;
  if (!name) {
    return -2.5 / 2;
  } else {
    const matches = name.match(/(.+)(\d+)/) || [];
    name = matches[1];
    const index = Number(matches[2]);

    let noteName = name;

    if (name.length) {
      noteName = name[0];
    }

    const nextIndex = index - startOctave;

    const position = {
      c: 3,
      d: 2.5,
      e: 2,
      f: 1.5,
      g: 1,
      a: 0.5,
      b: 0
    }[noteName.toLowerCase()];

    if (position === undefined) {
      throw new Error(`Unknown note name: ${noteName}`);
    }

    return position * -1 + nextIndex + 2.5 * nextIndex;
  }
}

const noteToScaleIndex = {
  cbbb: -3,
  cbb: -2,
  cb: -1,
  c: 0,
  'c#': 1,
  cx: 2,
  'c##': 2,
  'c###': 3,
  'cx#': 3,
  'c#x': 3,
  dbbb: -1,
  dbb: 0,
  db: 1,
  d: 2,
  'd#': 3,
  dx: 4,
  'd##': 4,
  'd###': 5,
  'dx#': 5,
  'd#x': 5,
  ebbb: 1,
  ebb: 2,
  eb: 3,
  e: 4,
  'e#': 5,
  ex: 6,
  'e##': 6,
  'e###': 7,
  'ex#': 7,
  'e#x': 7,
  fbbb: 2,
  fbb: 3,
  fb: 4,
  f: 5,
  'f#': 6,
  fx: 7,
  'f##': 7,
  'f###': 8,
  'fx#': 8,
  'f#x': 8,
  gbbb: 4,
  gbb: 5,
  gb: 6,
  g: 7,
  'g#': 8,
  gx: 9,
  'g##': 9,
  'g###': 10,
  'gx#': 10,
  'g#x': 10,
  abbb: 6,
  abb: 7,
  ab: 8,
  a: 9,
  'a#': 10,
  ax: 11,
  'a##': 11,
  'a###': 12,
  'ax#': 12,
  'a#x': 12,
  bbbb: 8,
  bbb: 9,
  bb: 10,
  b: 11,
  'b#': 12,
  bx: 13,
  'b##': 13,
  'b###': 14,
  'bx#': 14,
  'b#x': 14
};

export const minNoteIndex = Object.values(noteToScaleIndex).reduce(
  (result, v) => (result = Math.min(result, v)),
  Infinity
);
export const maxNoteIndex = Object.values(noteToScaleIndex).reduce(
  (result, v) => (result = Math.max(result, v)),
  -Infinity
);

export function getNoteScaleIndex(note: string) {
  if (!note) {
    return 0;
  }
  const [, char] = note.match(/^([A-Za-z]+[#x]?)(\d)+$/) || [];
  return noteToScaleIndex[char.toLowerCase() as keyof typeof noteToScaleIndex];
}
export function getNoteScaleValue(note: string) {
  if (!note) {
    return 0;
  }
  const [, char, number] = note.match(/^([A-Za-z]+[#x]?)(\d)+$/) || [];
  return (
    noteToScaleIndex[char.toLowerCase() as keyof typeof noteToScaleIndex] *
    Number(number)
  );
}

export function getNoteValue(noteDescription: NoteDescription) {
  if (typeof noteDescription.duration === 'number') {
    return noteDescription.duration / 2;
  }
  try {
    if (['n', 't'].includes(noteDescription.time?.character || '')) {
      return 1 / Number(noteDescription.time?.number);
    } else {
      return Number(noteDescription.time?.number);
    }
  } catch (error) {
    console.error(error);
    debugger;
  }
}
export function getPreparedNotes(notes: NoteDescription[]) {
  return notes.reduce<{
    totalTime: Tone.TimeClass;
    notes: NoteDescriptionOptions[];
  }>(
    (result, note) => {
      const delay = note.delay;
      const time = note.getTime();
      const name = note.getName();
      const velocity = note.velocity;
      result.totalTime = Time(
        result.totalTime + Time(delay || time).toString()
      );

      result.notes.push({
        time: String(delay),
        name,
        velocity
      });
      return result;
    },
    {
      totalTime: Time('0'),
      notes: []
    }
  ).notes;
}
export function getOctaveRangeFromNotes(notes: NoteDescription[]) {
  const { min, max } = notes
    .filter(note => note.octave)
    .reduce(
      (result, note) => {
        if (note.octave !== undefined) {
          result.min = Math.min(note.octave, result.min);
          result.max = Math.max(note.octave, result.max);
        }
        return result;
      },
      { min: Infinity, max: -Infinity }
    );
  return { max, min, length: Math.max(Math.ceil(max - min), 1) };
}

export function fillWithPauses(
  notes: {
    name: string;
    time: number;
    duration: number;
    velocity: number;
  }[]
) {
  debugger;
  let lastTime = 0;
  const newNotes: {
    name?: string;
    duration: string | number;
    velocity?: number;
  }[] = [];
  for (let i = 0; i < notes.length; i++) {
    const note = notes[Number(i)];
    const time = note.time || 0;

    // const offset = time - lastTime;
    // if (offset) {
    //   const notation = new Tone.Time(offset, 's').toNotation();
    //   if (notation !== '0') {
    //     newNotes.push({
    //       duration: new Tone.Time(offset, 's').toNotation()
    //     });
    //   }
    // }

    const offset = time - lastTime;
    if (offset) {
      newNotes.push({
        duration: offset
      });
    }

    lastTime = time;

    if (note.duration) {
      newNotes.push({
        velocity: note.velocity,
        name: note.name,
        duration: Tone.Time(note.duration).toNotation()
        // time
      });
    }
  }
  return newNotes;
}
export function getDurationFromNotes(notes: NoteDescription[]) {
  return notes.reduce((duration, note) => {
    duration += note.toSeconds();
    return duration;
  }, 0);
}
const chords = {
  // Chord

  'A#': ['A', 'C#', 'E'],
  'B#': ['B', 'D#', 'F#'],
  'C#': ['C', 'E', 'G'],
  'D#': ['D', 'F#', 'A'],
  'E#': ['E', 'G#', 'B'],
  'F#': ['F', 'A', 'C'],
  'G#': ['G', 'B', 'D'],

  'Ab#': ['Ab', 'C', 'Eb'],
  'Bb#': ['Bb', 'D', 'F'],
  'Cb#': ['Cb', 'Eb', 'Gb'],
  'Db#': ['Db', 'F', 'Ab'],
  'Eb#': ['Eb', 'G', 'Bb'],
  // 'Fb#': ['Fb', 'Ab', 'Cb']

  // 2 Chord

  'A#2': ['A', 'C#', 'E', 'B'],
  'B#2': ['B', 'D#', 'F#', 'C#'],
  'C#2': ['C', 'E', 'G', 'D'],
  'D#2': ['D', 'F#', 'A', 'E'],
  'F#2': ['F', 'A', 'C', 'D'],
  'G#2': ['G', 'B', 'D', 'A'],

  'Ab#2': ['Ab', 'C', 'Eb', 'Bb'],
  'Bb#2': ['Bb', 'D', 'F', 'C'],
  'Cb#2': ['Cb', 'Eb', 'Gb', 'Db'],
  'Db#2': ['Db', 'F', 'Ab', 'Eb'],
  'Eb#2': ['Eb', 'G', 'Bb', 'F']

  // 'Fb#2': ['Fb', 'Ab', 'Cb', 'Gb']
};
export function resolveChord(name: string): string[] {
  if (/^([A-Za-z]+[#xb]{,2})(\d)+$/.test(name)) {
    const [, char, count] = name.match(/^([A-Za-z]+[#xb]{,2})(\d)+$/) || [];
    return Array.from(
      new Set(
        chords[char as keyof typeof chords]?.map(resolveChord).flat() || [name]
      )
    ).map(v => `${v}${count || ''}`);
  }
  return [name];
}

export const getOcatveNotes = (start: number, length: number, time = '8n') => {
  const notes = [];

  for (let i = start; i < start + length; i++) {
    notes.push(
      { name: `C${i}`, time },
      { name: `D${i}`, time },
      { name: `E${i}`, time },
      { name: `F${i}`, time },
      { name: `G${i}`, time },
      { name: `A${i}`, time },
      { name: `B${i}`, time }
    );
  }
  return notes;
};

export function getNoteTimes({
  triplet = false,
  dotted = false,
  natural = true
} = {}) {
  return [1, 2, 4, 8, 16, 32]
    .map(v => {
      return [
        natural ? `${v}n` : undefined,
        triplet ? `${v}t` : undefined,
        dotted ? `${v}n.` : undefined
      ].filter(Boolean);
    })
    .flat()
    .map<[string, Seconds]>(v => {
      v = v as string;
      return [v, Time(v).toSeconds()];
    });
}
