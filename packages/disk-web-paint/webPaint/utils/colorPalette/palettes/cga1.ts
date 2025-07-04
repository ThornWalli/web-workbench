import Palette from '@web-workbench/disk-web-paint/webPaint/lib/classes/Palette';

export default new Palette({
  locked: true,
  name: 'CGA 1 (High Intensity)',
  description:
    'Another iconic 4-color palette of the CGA, often responsible for the cyan-magenta look.',
  colors: [
    {
      id: 'cga-p1-0',
      color: '#000000'
    },
    {
      id: 'cga-p1-1',
      color: '#00AAAA'
    },
    {
      id: 'cga-p1-2',
      color: '#AA00AA'
    },
    {
      id: 'cga-p1-3',
      color: '#AAAAAA'
    }
  ]
});
