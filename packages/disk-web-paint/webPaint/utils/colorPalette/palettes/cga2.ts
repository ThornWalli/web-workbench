import Palette from '@web-workbench/disk-web-paint/webPaint/lib/classes/Palette';

export default new Palette({
  locked: true,
  id: 'cga-palette',
  name: 'CGA Palette (Mode 4 High Intensity)',
  description:
    'A historical 16-color palette inspired by the IBM CGA graphics standard. Known for its bright, sometimes unsaturated colors and distinctive retro computer look. Challenging but very characteristic.',
  colors: [
    {
      id: 'cga-c0',
      name: 'Black',
      color: '#000000'
    },
    {
      id: 'cga-c1',
      name: 'Dark Blue',
      color: '#0000aa'
    },
    {
      id: 'cga-c2',
      name: 'Dark Green',
      color: '#00aa00'
    },
    {
      id: 'cga-c3',
      name: 'Dark Cyan',
      color: '#00aaaa'
    },
    {
      id: 'cga-c4',
      name: 'Dark Red',
      color: '#aa0000'
    },
    {
      id: 'cga-c5',
      name: 'Dark Magenta',
      color: '#aa00aa'
    },
    {
      id: 'cga-c6',
      name: 'Brown',
      color: '#aa5500'
    },
    {
      id: 'cga-c7',
      name: 'Light Gray',
      color: '#aaaaaa'
    },
    {
      id: 'cga-c8',
      name: 'Dark Gray',
      color: '#555555'
    },
    {
      id: 'cga-c9',
      name: 'Blue',
      color: '#5555ff'
    },
    {
      id: 'cga-c10',
      name: 'Green',
      color: '#55ff55'
    },
    {
      id: 'cga-c11',
      name: 'Cyan',
      color: '#55ffff'
    },
    {
      id: 'cga-c12',
      name: 'Red',
      color: '#ff5555'
    },
    {
      id: 'cga-c13',
      name: 'Magenta',
      color: '#ff55ff'
    },
    {
      id: 'cga-c14',
      name: 'Yellow',
      color: '#ffff55'
    },
    {
      id: 'cga-c15',
      name: 'White',
      color: '#ffffff'
    }
  ]
});
