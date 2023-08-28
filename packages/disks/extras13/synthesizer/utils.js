import { Time, Sequence } from 'tone';
import * as Tone from 'tone';
import NoteDescription from './classes/NoteDescription';
export const INPUT_OPERTATIONS = {
  ADD: 'add',
  REPLACE: 'replace'
};

export function getInstruments() {
  return {
    AMSynth: 'AM',
    DuoSynth: 'Duo',
    FMSynth: 'FM',
    MembraneSynth: 'Membrane',
    MetalSynth: 'Metal',
    MonoSynth: 'Mono',
    PluckSynth: 'Pluck',
    PolySynth: 'Poly',
    Synth: 'Synth'
  };
}

export function getNotes(short = false) {
  if (short) {
    return {
      '2m': '2',
      '1m': '1',
      '2n': '1/2',
      '4n': '1/4',
      '8n': '1/8',
      '16n': '1/16',
      '32n': '1/32'
      // '64n': '1/64'
    };
  }

  return {
    '2m': 'Double Whole Note',
    '1m': 'Whole Note',
    '2n': 'Half Note',
    '4n': 'Quarter Note',
    '8n': 'Eighth Note',
    '16n': 'Sixteenth Note',
    '32n': 'Thirty-second Note',
    '64n': 'Sixty-fourth Note'
  };
}

export function getKeyboardSizes() {
  return {
    large: 'Large',
    medium: 'Medium',
    small: 'Small'
  };
}

export function playSequence(synth, notes) {
  const sequence = new Sequence({
    subdivision: '8n',
    loop: false,
    events: notes,
    callback: (time, note) =>
      synth.triggerAttackRelease(note.name, note.duration, time)
  });
  return sequence;
}

export function getDecibelFromValue(normalizeValue) {
  return Math.max(Math.min((-1 + normalizeValue / 0.5) * 30, 30), -30);
}

export const BASE_NOTE_HEIGHT = 9;
export const GROUP_DIRECTIONS = Object.freeze({
  DEFAULT: 'default',
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
  EQUAL: 'equal'
});

// eslint-disable-next-line complexity
export function getGroupedNotes(notes) {
  // debugger;
  const groups = [];
  let lastNote = null;
  let group = [];
  // const lastDirection = NOTE_DIRECTIONS.DEFAULT;
  for (let i = 0; i < notes.length; i++) {
    const note = notes[Number(i)];
    // debugger;
    let direction = GROUP_DIRECTIONS.DEFAULT;
    if (note.time === lastNote?.time) {
      if (
        getNoteScaleIndex(lastNote.name) + maxNoteIndex * lastNote.octave >
        getNoteScaleIndex(note.name) + maxNoteIndex * note.octave
      ) {
        direction = GROUP_DIRECTIONS.DESCENDING;
      } else if (
        getNoteScaleIndex(lastNote.name) + maxNoteIndex * lastNote.octave <
        getNoteScaleIndex(note.name) + maxNoteIndex * note.octave
      ) {
        direction = GROUP_DIRECTIONS.ASCENDING;
      } else {
        direction = GROUP_DIRECTIONS.EQUAL;
      }
    }

    if (
      (lastNote && Math.abs(note.octave - group.startOctave) >= 2) ||
      (group.direction || direction) !== direction ||
      group?.notes?.length >= group.max ||
      (note.name && !lastNote?.name) ||
      note.time !== lastNote?.time ||
      group.count >= 1
    ) {
      group = {
        startOctave: note.octave,
        max: note.notation.number / 4,
        time: note.time,
        count: 0,
        notes: []
      };
      groups.push(group);
    } else {
      group.direction = direction;
    }
    lastNote = note;
    group.count += getNoteValue(note);

    group.notes.push(NoteDescription.create(note));
  }
  return groups;
}

export function getBeatsFromGroupedNotes(groupedNotes) {
  groupedNotes = Array.from(groupedNotes);
  let beat;
  let count = 0;

  const beats = groupedNotes.reduce((result, groupedNote) => {
    if (count + groupedNote.count > 1) {
      beat = null;
    }
    if (!beat) {
      beat = { groupedNotes: [] };
      result.push(beat);
      count = 0;
    }
    beat.groupedNotes.push(groupedNote);
    count += groupedNote.count;

    return result;
  }, []);
  return beats.map(beat => {
    return {
      ...beat,
      selected: beat.groupedNotes.find(({ notes }) =>
        notes.find(({ selected }) => selected)
      )
    };
  });
}

export function getNotePosition(startOctave, { name }) {
  if (!name) {
    return -2.5 / 2;
  } else {
    const matches = name.match(/(.+)(\d+)/);
    name = matches[1];
    const index = Number(matches[2]);

    let noteName = name;

    if (name.length) {
      noteName = name[0];
    }

    const nextIndex = index - startOctave;

    return (
      {
        c: 3,
        d: 2.5,
        e: 2,
        f: 1.5,
        g: 1,
        a: 0.5,
        b: 0
      }[String(noteName.toLowerCase())] *
        -1 +
      nextIndex +
      2.5 * nextIndex
    );
  }
}

// const test = {
//   c: 0,
//   d: 1,
//   e: 2,
//   f: 3,
//   g: 4,
//   a: 5,
//   b: 6
// };

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

export function getNoteScaleIndex(note) {
  if (!note) {
    return 0;
  }
  const [, char] = note.match(/^([A-Za-z]+[#x]?)(\d)+$/) || [];
  return noteToScaleIndex[char.toLowerCase()];
}
export function getNoteScaleValue(note) {
  if (!note) {
    return 0;
  }
  const [, char, number] = note.match(/^([A-Za-z]+[#x]?)(\d)+$/) || [];
  return noteToScaleIndex[char.toLowerCase()] * Number(number);
}

export function getNoteValue(note) {
  if (typeof note.duration === 'number') {
    return note.duration / 2;
  }
  try {
    const matches = note.time.match(/(\d+)([a-z]+).*/);
    if (['n', 't'].includes(matches[2])) {
      return 1 / Number(matches[1]);
    } else {
      return Number(matches[1]);
    }
  } catch (error) {
    debugger;
  }
}
export function getPreparedNotes(notes) {
  return notes.reduce(
    (result, { name, duration, velocity, time }) => {
      const seconds = result.totalTime.toSeconds();
      result.totalTime = new Time(
        result.totalTime + new Time(duration || time)
      );

      result.notes.push({
        time: duration || seconds,
        name,
        velocity
      });
      return result;
    },
    {
      totalTime: new Time('0'),
      notes: []
    }
  ).notes;
}
export function getOctaveRangeFromNotes(notes) {
  console.log(notes.map(note => [note.name, note.octave]));
  const { min, max } = notes
    .filter(note => note.octave)
    .reduce(
      (result, note) => {
        result.min = Math.min(note.octave, result.min);
        result.max = Math.max(note.octave, result.max);
        return result;
      },
      { min: Infinity, max: -Infinity }
    );
  console.log(
    'getOctaveRangeFromNotes',
    { min, max },
    Math.max(Math.ceil(max - min), 1)
  );
  return { max, min, length: Math.max(Math.ceil(max - min), 1) };
}
export function getOctaveRangeFromBeats(beats) {
  return getOctaveRangeFromNotes(
    beats
      .map(({ groupedNotes }) => groupedNotes)
      .flat()
      .map(({ notes }) => notes)
      .flat()
  );
}
export function fillWithPauses(notes) {
  let lastTime = 0;
  const newNotes = [];
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

    note.duration &&
      newNotes.push({
        velocity: note.velocity,
        name: note.name,
        duration: new Tone.Time(note.duration).toNotation()
        // time
      });
  }
  return newNotes;
}
export function getDurationFromNotes(notes) {
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
export function resolveChord(name) {
  const [, char, count] = name.match(/^([A-Za-z]+[#x]?)(\d)+$/) || [];
  return Array.from(
    new Set(chords[String(char)]?.map(resolveChord).flat() || [name])
  ).map(v => `${v}${count || ''}`);
}

export const getOcatveNotes = (start, length, time = '8n') => {
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
