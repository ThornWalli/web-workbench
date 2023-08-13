import { Sequence } from 'tone';

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
      '32n': '1/32',
      '64n': '1/64'
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
      synth.triggerAttackRelease(note.note, note.duration, time)
  });
  return sequence;
}

export function getDecibelFromValue(normalizeValue) {
  return Math.max(Math.min((-1 + normalizeValue / 0.5) * 30, 30), -30);
}

export function getGroupedNotes(startOctave, notes) {
  const groups = [];
  let lastNote = null;
  let group = [];
  for (let i = 0; i < notes.length; i++) {
    const note = notes[Number(i)];
    if (
      (note.note && !lastNote?.note) ||
      // (!note.note && lastNote?.note) ||
      note.time !== lastNote?.time ||
      group.count >= 1
    ) {
      group = { time: note.time, count: 0, notes: [] };
      groups.push(group);
    }

    lastNote = note;
    group.count += getNoteValue(note);
    group.notes.push({ ...note, position: getNotePosition(startOctave, note) });
  }
  console.log(groups);
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

export function getNotePosition(startOctave, { note }) {
  if (!note) {
    return 0;
  } else {
    const [, name, index] = note.match(/(.+)(\d+)/);

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

export function getNoteValue(note) {
  const matches = note.time.match(/(\d+)([a-z]+).*/);
  if (matches[2] === 'n') {
    return 1 / Number(matches[1]);
  } else {
    return Number(matches[1]);
  }
}
