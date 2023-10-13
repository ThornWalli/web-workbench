import { describe, it, expect } from 'vitest';

import NoteDescription, {
  Note as NoteDescriptionNote,
  Time as NoteDescriptionTime
} from '@web-workbench/disks/extras13/synthesizer/classes/NoteDescription';

import { NOTE_MODIFICATIONS } from '@web-workbench/disks/extras13/synthesizer/types';
import {
  groupedNotesFromNotes,
  beatsFromGroupedNotes,
  prepareNotes
} from '@web-workbench/disks/extras13/synthesizer/utils/noteTtransform';

describe('Synthesizer', () => {
  it('Note', () => {
    const noteNames = [
      [
        'C4',
        {
          name: 'c',
          modification: NOTE_MODIFICATIONS.NATURAL,
          ocatve: 4
        }
      ],
      [
        'CB4',
        {
          name: 'c',
          modification: NOTE_MODIFICATIONS.FLAT,
          ocatve: 4
        }
      ], // flat
      [
        'CBB4',
        {
          name: 'c',
          modification: NOTE_MODIFICATIONS.DOUBLE_FLAT,
          ocatve: 4
        }
      ], // double flat
      [
        'C#4',
        {
          name: 'c',
          modification: NOTE_MODIFICATIONS.SHARP,
          ocatve: 4
        }
      ], // sharp
      [
        'CX4',
        {
          name: 'c',
          modification: NOTE_MODIFICATIONS.DOUBLE_SHARP,
          ocatve: 4
        }
      ], // double sharp
      [
        'GB4',
        {
          name: 'g',
          modification: NOTE_MODIFICATIONS.FLAT,
          ocatve: 4
        }
      ] // custom
    ];

    noteNames.forEach(([noteName, { name, modification, ocatve }]) => {
      const note = new NoteDescriptionNote(...[].concat(noteName));
      expect(note.name).toBe(name);
      expect(note.modification).toBe(modification);
      expect(note.octave).toBe(ocatve);
      expect(note.toString()).toBe(noteName.toString().toLowerCase());
    });
  });

  it('Time', () => {
    const timeNames = [
      [
        '1m',
        { number: 1, character: 'm', options: { triplet: false, dot: false } }
      ],
      [
        '4n',
        { number: 4, character: 'n', options: { triplet: false, dot: false } }
      ],
      [
        '32n',
        { number: 32, character: 'n', options: { triplet: false, dot: false } }
      ],
      [
        '4t',
        { number: 4, character: 'n', options: { triplet: true, dot: false } }
      ],
      [
        '32t',
        { number: 32, character: 'n', options: { triplet: true, dot: false } }
      ],
      [
        '1m.',
        { number: 1, character: 'm', options: { triplet: false, dot: true } }
      ],
      [
        '4n.',
        { number: 4, character: 'n', options: { triplet: false, dot: true } }
      ],
      [
        '32t.',
        { number: 32, character: 'n', options: { triplet: true, dot: true } }
      ],
      [
        '4n.',
        { number: 4, character: 'n', options: { triplet: false, dot: true } }
      ],
      [
        '32t.',
        { number: 32, character: 'n', options: { triplet: true, dot: true } }
      ]
    ];

    timeNames.forEach(([timeName, { number, character, options }]) => {
      const { triplet, dot } = options;
      const time = new NoteDescriptionTime(timeName);
      expect(time.number).toBe(number);
      expect(time.character).toBe(character);
      expect(time.triplet).toBe(triplet);
      expect(time.dot).toBe(dot);
      expect(time.toString()).toBe(timeName);
    });

    expect(
      new NoteDescriptionTime(new NoteDescriptionTime('16n')).toString()
    ).toBe('16n');
    expect(
      new NoteDescriptionTime(new NoteDescriptionTime('16n.')).toString()
    ).toBe('16n.');
    expect(
      new NoteDescriptionTime(new NoteDescriptionTime('16t.')).toString()
    ).toBe('16t.');
  });
  it('NoteDescription', () => {
    const noteDescriptions = [
      [
        { note: 'C4', time: '4n' },
        {
          note: new NoteDescriptionNote('C4'),
          time: new NoteDescriptionTime({ number: 4, character: 'n' })
        }
      ],
      [
        { note: 'CX4', time: '16t.' },
        {
          note: new NoteDescriptionNote({
            name: 'c',
            octave: 4,
            modification: NOTE_MODIFICATIONS.DOUBLE_SHARP
          }),
          time: new NoteDescriptionTime({
            number: 16,
            character: 't',
            triplet: true,
            dot: true
          })
        }
      ]
    ];

    noteDescriptions.forEach(([data, equals]) => {
      const noteDescription = new NoteDescription(data);
      expect(noteDescription.note.equals(equals.note)).toBe(true);
      expect(noteDescription.time.equals(equals.time)).toBe(true);
    });
  });
});

describe('Synthesizer Notes New', () => {
  const notes = [
    { name: 'C4', time: '4n', delay: 0 },
    { name: 'D4', time: '4n', delay: 0.5 },
    { name: 'C4', time: '4n', delay: 1 },
    { name: 'D4', time: '4n', delay: 1.5 },
    { name: 'D4', time: '4n', delay: 2 },
    { name: 'C4', time: '4n', delay: 2 },
    { name: 'C4', time: '1m', delay: 8 }

    // { name: 'C4', time: '8n', delay: 0 },
    // { name: 'D4', time: '8n', delay: 0 },

    // { name: 'C4', time: '8n', delay: 0.25 },
    // { name: 'D4', time: '8n', delay: 0.25 },
    // { name: 'D4', time: '8n', delay: 0.25 },
    // { name: 'C4', time: '16n', delay: 0.5 },
    // { name: 'F4', time: '16n', delay: 0.5 },
    // { name: 'F4', time: '16n', delay: 2.5 }
    // { time: null, delay: 0, duration: 2 }
  ];

  const groupedNotesReuslt = [
    {
      noteGroups: {
        '4n': [
          {
            notes: [
              {
                note: {
                  name: 'c',
                  octave: 4,
                  sharp: false,
                  doubleSharp: false
                },
                time: { number: 4, character: 'n', dot: false, triplet: false },
                delay: 0,
                selected: false,
                groupPosition: -3,
                index: 0
              },
              {
                note: {
                  name: 'd',
                  octave: 4,
                  sharp: false,
                  doubleSharp: false
                },
                time: { number: 4, character: 'n', dot: false, triplet: false },
                delay: 0.5,
                selected: false,
                groupPosition: -2.5,
                index: 1
              }
            ],
            align: 'ascending'
          },
          {
            notes: [
              {
                note: {
                  name: 'c',
                  octave: 4,
                  sharp: false,
                  doubleSharp: false
                },
                time: { number: 4, character: 'n', dot: false, triplet: false },
                delay: 1,
                selected: false,
                groupPosition: -3,
                index: 2
              },
              {
                note: {
                  name: 'd',
                  octave: 4,
                  sharp: false,
                  doubleSharp: false
                },
                time: { number: 4, character: 'n', dot: false, triplet: false },
                delay: 1.5,
                selected: false,
                groupPosition: -2.5,
                index: 3
              }
            ],
            align: 'ascending'
          }
        ]
      },
      index: 0
    },
    {
      noteGroups: {
        '4n': [
          {
            notes: [
              {
                note: {
                  name: 'd',
                  octave: 4,
                  sharp: false,
                  doubleSharp: false
                },
                time: { number: 4, character: 'n', dot: false, triplet: false },
                delay: 2,
                selected: false,
                groupPosition: -2.5,
                index: 4
              }
            ],
            align: 'equal'
          },
          {
            notes: [
              {
                note: {
                  name: 'c',
                  octave: 4,
                  sharp: false,
                  doubleSharp: false
                },
                time: { number: 4, character: 'n', dot: false, triplet: false },
                delay: 2,
                selected: false,
                groupPosition: -3,
                index: 5
              }
            ],
            align: 'equal'
          }
        ]
      },
      index: 1
    },
    { noteGroups: {}, index: 2 },
    { noteGroups: {}, index: 3 },
    {
      noteGroups: {
        '1m': [
          {
            notes: [
              {
                note: {
                  name: 'c',
                  octave: 4,
                  sharp: false,
                  doubleSharp: false
                },
                time: { number: 1, character: 'm', dot: false, triplet: false },
                delay: 8,
                selected: false,
                groupPosition: -3,
                index: 6
              }
            ],
            align: 'equal'
          }
        ]
      },
      index: 4
    }
  ];
  it('Transform', () => {
    const preparedNotes = prepareNotes(notes);
    const groupedNotes = groupedNotesFromNotes(preparedNotes);
    // expect(JSON.stringify(groupedNotes)).toBe(
    //   JSON.stringify(groupedNotesReuslt)
    // );
    console.log(JSON.stringify(groupedNotes, null, 2));
    expect(JSON.stringify(beatsFromGroupedNotes(groupedNotes))).toBe(
      JSON.stringify(groupedNotesReuslt)
    );
  });
});
