import { Sequence } from 'tone';

export function getInstruments () {
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

export function getTimes () {
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

export function getKeyboardSizes () {
  return {
    large: 'Large',
    medium: 'Medium',
    small: 'Small'
  };
}

export function playSequence (synth, notes) {
  const sequence = new Sequence({
    subdivision: '8n',
    loop: false,
    events: notes,
    callback: (time, note) => synth.triggerAttackRelease(note.note, note.duration, time)
  });
  return sequence;
}

export function getDecibelFromValue (normalizeValue) {
  return Math.max(Math.min((-1 + normalizeValue / 0.5) * 30, 30), -30);
}
