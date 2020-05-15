import WbDocumentReaderInfo from '@/components/disks/workbench13/documentReader/Info';

export default ({ core, model }) => {
  const { windows } = core.modules;
  return [
    {
      title: 'Document Reader',
      items: [
        {
          title: 'Open…',
          hotKey: 'O',
          keyCode: 79,
          action () {
            return open(core, model);
          }
        },
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

async function open (core, model) {
  const data = await core.executeCommand('openFileDialog');
  if (data) {
    if ('content' in data.value) {
      model.fsItem = data.fsItem;
      model.value = data.value;
    } else {
      throw new Error('Can\'t read file content');
    }
  }
}
