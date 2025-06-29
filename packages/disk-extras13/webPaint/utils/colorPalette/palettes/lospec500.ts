import Palette from '@web-workbench/disk-extras13/webPaint/lib/classes/Palette';

export default new Palette({
  locked: true,
  id: 'lospec500-palette',
  name: 'LoSpec500',
  description:
    'A compact 5-color palette created by LoSpec. Perfect for a very limited, highly stylized look, ideal for small icons, simple sprites, or monochrome game concepts.',
  colors: [
    {
      id: 'lospec500-c0',
      name: 'Dark Grey',
      color: '#242424'
    },
    {
      id: 'lospec500-c1',
      name: 'Medium Grey',
      color: '#5b5b5b'
    },
    {
      id: 'lospec500-c2',
      name: 'Light Grey',
      color: '#939393'
    },
    {
      id: 'lospec500-c3',
      name: 'Lighter Grey',
      color: '#c4c4c4'
    },
    {
      id: 'lospec500-c4',
      name: 'White',
      color: '#fcfcfc'
    }
  ]
});
