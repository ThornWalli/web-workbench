import WbDocumentReaderInfo from '@/components/disks/workbench13/documentReader/Info';

export default ({ core }) => {
  const { windows } = core.modules;
  return [
    {
      title: 'Document Reader',
      items: [
        {
          hotKey: 'I',
          keyCode: 73,
          title: 'Info',
          action () {
            windows.addWindow({
              title: 'Info',
              component: WbDocumentReaderInfo,
              componentData: {},
              options: {
                scale: false,
                prompt: false,
                scrollX: false,
                scrollY: false
              }
            });
          }
        }
      ]
    }
  ];
};
