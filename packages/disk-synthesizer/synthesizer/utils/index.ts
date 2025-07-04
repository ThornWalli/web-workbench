import type Core from '@web-workbench/core/classes/Core';
import { CONFIG_NAMES } from '../../types';
import {
  INPUT_MODIFICATIONS,
  INPUT_OPERTATIONS,
  INSTRUMENT,
  KEYBOARD_ALIGNMENT,
  KEYBOARD_SIZE
} from '../types';
import type { TrackModel } from '../types';
import type Track from '../classes/Track';

export function renamingDialog(
  core: Core,
  message: string,
  defaultValue: string = ''
) {
  return core.executeCommand(
    `openDialog -title="${message}" -prompt -prompt-value="${defaultValue}" -apply="Save" -abort="Cancel"`
  );
}
export function confirmDialog(core: Core, message: string) {
  return core.executeCommand(`openDialog "${message}" -confirm`);
}

async function getDefaultProject() {
  const [Track, Project] = await Promise.all([
    import('../classes/Track').then(module => module.default),
    import('../classes/Project').then(module => module.default)
  ]);

  const project = new Project({
    tracks: [
      new Track({
        name: 'Test',
        type: INSTRUMENT.SYNTH,
        notes: [
          {
            note: { name: 'c', octave: 3, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0
          },
          {
            note: { name: 'd', octave: 3, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0.0625
          },
          {
            note: { name: 'e', octave: 3, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0.125
          },
          {
            note: { name: 'f', octave: 3, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0.1875
          },
          {
            note: { name: 'g', octave: 3, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0.25
          },
          {
            note: { name: 'a', octave: 3, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0.3125
          },
          {
            note: { name: 'b', octave: 3, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0.375
          },
          {
            note: { name: 'c', octave: 4, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0.4375
          },
          {
            note: { name: 'd', octave: 4, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0.5
          },
          {
            note: { name: 'e', octave: 4, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0.5625
          },
          {
            note: { name: 'f', octave: 4, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0.625
          },
          {
            note: { name: 'g', octave: 4, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0.6875
          },
          {
            note: { name: 'a', octave: 4, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0.75
          },
          {
            note: { name: 'b', octave: 4, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0.8125
          },
          {
            note: { name: 'c', octave: 5, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0.875
          },
          {
            note: { name: 'd', octave: 5, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 0.9375
          },
          {
            note: { name: 'e', octave: 5, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 1
          },
          {
            note: { name: 'f', octave: 5, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 1.0625
          },
          {
            note: { name: 'g', octave: 5, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 1.125
          },
          {
            note: { name: 'a', octave: 5, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 1.1875
          },
          {
            note: { name: 'b', octave: 5, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 1.25
          },
          {
            note: { name: 'c', octave: 6, sharp: false, doubleSharp: false },
            time: { number: 32, character: 'n', dot: false, triplet: false },
            delay: 1.3125
          }
          // { name: 'C4', time: '8n', delay: 0 },
          // { name: 'D4', time: '8n', delay: 0.25 },
          // { name: 'E4', time: '8n', delay: 0.5 },
          // { name: 'F4', time: '8n', delay: 0.75 },
          // { name: 'G4', time: '8n', delay: 1 },
          // { name: 'A4', time: '8n', delay: 1.25 }
          // { name: 'Cbb4', time: '4t.' },
          // { name: 'GB4', time: '4t.' }
          // { name: 'BB5', time: '4n' },
          // { name: 'BBB5', time: '4n' }
        ],
        beatCount: 2
      })
      // new Track({
      //   name: 'Alle Meine Enten',
      //   type: 'Synth',
      //   notes: EXAMPLE_NOTES.alleMeineEnten,
      //   beatCount: 2
      // })
      // new Track({
      //   name: 'Chocobo Theme V1',
      //   type: 'Synth',
      //   notes: EXAMPLE_NOTES.chocoboThemeV1,
      //   // bpm: 150
      //   baseNote: 8,
      //   noteCount: 8,
      //   beatCount: 4
      // })
    ]
  });
  return project;
}

export function getDefaultTrackModel(track: Track): TrackModel {
  return {
    [CONFIG_NAMES.SYNTHESIZER_TRACK]: track,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_ALIGN]: KEYBOARD_ALIGNMENT.TOP,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_SIZE]: KEYBOARD_SIZE.SMALL,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_NOTE_LABELS]: false,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_DURATION]: '2n',
    [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_OPERATION]: INPUT_OPERTATIONS.ADD,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_KEYBOARD]: true,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_DOT]: false,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_TRIPLET]: false,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_MODIFICATION]:
      INPUT_MODIFICATIONS.NATURAL,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_START_OCTAVE]: 3,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_OCTAVE_COUNT]: 2,

    // new
    [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT]: 'note',
    [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_NOTE]: ''
  };
}
export async function getDefaultModel() {
  return {
    [CONFIG_NAMES.SYNTHESIZER_PROJECT]: await getDefaultProject(),
    [CONFIG_NAMES.SYNTHESIZER_BPM]: 120

    // // old

    // [CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_NOTE_LABELS]: false,
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_INSTRUMENT]: 'Synth',
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_START_OCTAVE]: 4,
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_OCTAVE_COUNT]: 2,
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_SIZE]: 'small',
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_DURATION]: '2n',
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_BEAT_COUNT]: 4,
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_OPERATION]: INPUT_OPERTATIONS.ADD,
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_BASE_NOTE]: 4,
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_NOTE_COUNT]: '4n'
  };
}
