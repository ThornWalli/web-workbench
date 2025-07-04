import Palette from '@web-workbench/disk-web-paint/webPaint/lib/classes/Palette';

export default new Palette({
  locked: true,
  id: 'gameboy-palette',
  name: 'Game Boy (Original)',
  description:
    'The iconic 4-color palette of the classic Game Boy. Perfect for an authentic retro monochrome look with greenish tones.',
  colors: [
    {
      id: 'gb-c0',
      name: 'Darkest Green',
      color: '#0f380f'
    },
    {
      id: 'gb-c1',
      name: 'Dark Green',
      color: '#306230'
    },
    {
      id: 'gb-c2',
      name: 'Light Green',
      color: '#8bed81'
    },
    {
      id: 'gb-c3',
      name: 'Pale Green',
      color: '#9bbc0f'
    }
  ]
});
