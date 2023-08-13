import WbModuleCoreInfo from '../../components/modules/core/Info';
export default ({ core }) => {
  const { windows } = core.modules;
  return [
    {
      order: 0,
      title: 'Web-Workbench',
      items: [
        {
          title: 'Settings',
          action() {
            return core.executeCommand('openSettings');
          }
        },
        {
          separator: true
        },
        {
          hotKey: 'I',
          keyCode: 73,
          title: 'Info',
          action() {
            windows.addWindow({
              title: 'Info',
              component: WbModuleCoreInfo,
              componentData: {},
              options: {
                scale: false,
                prompt: false,
                scrollX: false,
                scrollY: false
              }
            });
          }
        },
        {
          separator: true
        },
        {
          title: 'Imprint',
          action() {
            return core.executeCommand('execute "Imprint.md"');
          }
        },
        {
          title: 'Disclaimer',
          action() {
            return core.executeCommand('execute "Disclaimer.md"');
          }
        }
      ]
    }
  ];
};
