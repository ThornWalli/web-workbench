import { describe, it, expect } from 'vitest';

import NoteDescription, {
  Note as NoteDescriptionNote,
  Time as NoteDescriptionTime,
  NOTE_MODIFICATIONS
} from '@web-workbench/disks/extras13/synthesizer/classes/NoteDescription';

describe('MathParser', () => {
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
        ['GB4', { modification: NOTE_MODIFICATIONS.NATURAL }],
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
        { number: 4, character: 't', options: { triplet: true, dot: false } }
      ],
      [
        '32t',
        { number: 32, character: 't', options: { triplet: true, dot: false } }
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
        { number: 32, character: 't', options: { triplet: true, dot: true } }
      ],
      [
        '4n.',
        { number: 4, character: 'n', options: { triplet: false, dot: true } }
      ],
      [
        '32t.',
        { number: 32, character: 't', options: { triplet: true, dot: true } }
      ]
    ];

    timeNames.forEach(([timeName, { number, character, options }]) => {
      const { triplet, dot } = options;
      const time = new NoteDescriptionTime(timeName);
      expect(time.number).toBe(number);
      expect(time.character).toBe(character);
      expect(time.triplet).toBe(triplet);
      expect(time.dot).toBe(dot);
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
