import WbModuleCoreSettings from '@/components/modules/core/Settings';
import WbModuleCoreInfo from '@/components/modules/core/Info';
export default ({ core }) => {
  const { windows } = core.modules;
  return [
    {
      order: 0,
      title: 'Web-Workbench',
      items: [
        //     {
        //     title: '${lang.applications.core.menuItems.impExpRuntime}',
        //     command: 'windowOpen --path="./ajax/applications/runtime_import_export.html"'
        // },
        {
          title: 'Settings',
          action () {
            windows.addWindow({
              title: 'Settings',
              component: WbModuleCoreSettings,
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
          hotKey: 'I',
          keyCode: 73,
          title: 'Info',
          action () {
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
          action () {
            return core.executeCommand('openPreview "Imprint.md"');
          }
        },
        {
          title: 'Disclaimer',
          action () {
            return core.executeCommand('openPreview "Disclaimer.md"');
          }
        }
      ]
    }
  ];
};
