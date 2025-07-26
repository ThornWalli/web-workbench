import type Item from '@web-workbench/core/classes/FileSystem/Item';
import type { CONFIG_NAMES } from '../types';
import type Track from './classes/Track';
import type Project from './classes/Project';
import type Window from '@web-workbench/core/classes/Window';

export interface Model {
  [CONFIG_NAMES.SYNTHESIZER_PROJECT]: Project;
  [CONFIG_NAMES.SYNTHESIZER_BPM]: number;
  fsItem?: Item;
  actions?: {
    removeTrack: (track: Track) => Promise<void>;
    clearTracks: () => Promise<void>;
    closeTracks: () => void;
    close: () => void;
    focus: () => void;
    newProject: () => Promise<void>;
    openProject: () => Promise<void>;
    saveProject: () => Promise<Item | undefined>;
    importProject: (file: File) => Promise<void>;
    exportProject: () => Promise<void>;
    newTrack: () => Promise<void>;
    editTrack: (
      track: Track,
      modelOverides?: Partial<TrackModel>
    ) => Promise<{
      window: Window;
      close: Promise<Track>;
      ready: Promise<Window>;
    }>;
    openDebugNotes: () => Promise<Window>;
    openDebugMidi: () => Promise<Window>;
    openDebugTimeline: () => Promise<Window>;
    openInfo: () => Promise<Window>;
  };
}
export interface TrackModel {
  [CONFIG_NAMES.SYNTHESIZER_TRACK]: Track;
  [CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_ALIGN]: KEYBOARD_ALIGNMENT;
  [CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_SIZE]: KEYBOARD_SIZE;
  [CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_NOTE_LABELS]: boolean;
  [CONFIG_NAMES.SYNTHESIZER_TRACK_DURATION]: string;
  [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_OPERATION]: INPUT_OPERTATIONS;
  [CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_KEYBOARD]: boolean;
  [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_DOT]: boolean;
  [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_TRIPLET]: boolean;
  [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_MODIFICATION]: INPUT_MODIFICATIONS;
  [CONFIG_NAMES.SYNTHESIZER_TRACK_START_OCTAVE]: number;
  [CONFIG_NAMES.SYNTHESIZER_TRACK_OCTAVE_COUNT]: number;

  // new
  [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT]: string;
  [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_NOTE]: '' | `${NOTE_COUNT}`;
}

export enum NOTE_MODIFICATIONS {
  NATURAL = 'natural',
  SHARP = 'sharp',
  DOUBLE_SHARP = 'doubleSharp',
  FLAT = 'flat',
  DOUBLE_FLAT = 'doubleFlat'
}

export enum INPUT_MODIFICATIONS {
  NATURAL = 'natural',
  SHARP = 'sharp',
  DOUBLE_SHARP = 'doubleSharp',
  FLAT = 'flat',
  DOUBLE_FLAT = 'doubleFlat'
}

export enum INPUT_OPERTATIONS {
  ADD = 'add',
  REPLACE = 'replace'
}

export enum KEYBOARD_SIZE {
  LARGE = 'large',
  MEDIUM = 'medium',
  SMALL = 'small'
}

export enum KEYBOARD_ALIGNMENT {
  TOP = 'top',
  BOTTOM = 'bottom'
}

export enum GROUP_DIRECTION {
  DEFAULT = 'default',
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
  EQUAL = 'equal'
}

export interface NoteTestDefinition {
  test?: RegExp;
  name: string;
  selectors: {
    selector: string;
    draw: CallableFunction;
    offset?: number[];
  }[];
}

export interface NoteConfigDefinition {
  time: RegExp[];
  offset?: number[];
  selectors: {
    selector: string;
    draw: CallableFunction;
    color?: string;
    autoHeight?: boolean;
  }[];
}

// export enum INSTRUMENT {
//   AMSynth = 'AMSynth',
//   DuoSynth = 'DuoSynth',
//   FMSynth = 'FMSynth',
//   MembraneSynth = 'MembraneSynth',
//   MetalSynth = 'MetalSynth',
//   MonoSynth = 'MonoSynth',
//   PluckSynth = 'PluckSynth',
//   PolySynth = 'PolySynth',
//   Synth = 'Synth'
// }

// export enum INSTRUMENT_VALUE_LABEL {
//   AMSynth = 'AM',
//   DuoSynth = 'Duo',
//   FMSynth = 'FM',
//   MembraneSynth = 'Membrane',
//   MetalSynth = 'Metal',
//   MonoSynth = 'Mono',
//   PluckSynth = 'Pluck',
//   PolySynth = 'Poly',
//   Synth = 'Synth'
// }

export type VALID_INSTRUMENTS =
  | 'AMSynth'
  | 'DuoSynth'
  | 'FMSynth'
  | 'MembraneSynth'
  | 'MetalSynth'
  | 'MonoSynth'
  | 'PluckSynth'
  | 'PolySynth'
  | 'Synth';

export enum INSTRUMENT {
  AM = 'AMSynth',
  DUO = 'DuoSynth',
  FM = 'FMSynth',
  MEMBRANE = 'MembraneSynth',
  METAL = 'MetalSynth',
  MONO = 'MonoSynth',
  PLUCK = 'PluckSynth',
  POLY = 'PolySynth',
  SYNTH = 'Synth'
}

export enum NOTE_COUNT {
  '2n' = 2,
  '4n' = 4,
  '8n' = 8,
  '16n' = 16,
  '32n' = 32,
  '64n' = 64
}

export interface Colors {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  highlight: string;
}

export const KEYBOARD_SIZE_LABEL = Object.freeze({
  [KEYBOARD_SIZE.SMALL]: 'Small',
  [KEYBOARD_SIZE.MEDIUM]: 'Medium',
  [KEYBOARD_SIZE.LARGE]: 'Large'
});

export const KEYBOARD_ALIGNMENT_LABEL = Object.freeze({
  [KEYBOARD_ALIGNMENT.TOP]: 'Top',
  [KEYBOARD_ALIGNMENT.BOTTOM]: 'Bottom'
});
