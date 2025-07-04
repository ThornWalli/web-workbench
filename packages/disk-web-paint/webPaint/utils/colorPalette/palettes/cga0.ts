import Palette from '@web-workbench/disk-web-paint/webPaint/lib/classes/Palette';

export default new Palette({
  locked: true,
  name: 'CGA 0 (High Intensity)',
  description:
    'The most well-known 4-color palette of the IBM PC Color Graphics Adapter.',
  colors: [
    {
      id: 'cga-p0-0',
      color: '#000000'
    },
    {
      id: 'cga-p0-1',
      color: '#00AA00'
    },
    {
      id: 'cga-p0-2',
      color: '#AA0000'
    },
    {
      id: 'cga-p0-3',
      color: '#AA5500'
    }
  ]
});
