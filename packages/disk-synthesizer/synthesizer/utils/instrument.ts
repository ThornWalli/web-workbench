import * as Tone from 'tone';
import { INSTRUMENT } from '../types';

const instruments = {
  [INSTRUMENT.AM]: Tone.AMSynth,
  [INSTRUMENT.DUO]: Tone.DuoSynth,
  [INSTRUMENT.FM]: Tone.FMSynth,
  [INSTRUMENT.MEMBRANE]: Tone.MembraneSynth,
  [INSTRUMENT.METAL]: Tone.MetalSynth,
  [INSTRUMENT.MONO]: Tone.MonoSynth,
  [INSTRUMENT.PLUCK]: Tone.PluckSynth,
  [INSTRUMENT.POLY]: Tone.PolySynth,
  [INSTRUMENT.SYNTH]: Tone.Synth
};

export function getInstrument<T = Tone.Synth>(
  name: INSTRUMENT = INSTRUMENT.SYNTH
) {
  return instruments[name] as unknown as new () => T;
}
