import Info from './components/Info';

export default ({ core }) => {
  const { windows } = core.modules;
  return [
    {
      title: 'Base64 Converter',
      items: [
        {
          hotKey: 'I',
          keyCode: 73,
          title: 'Info',
          action() {
            windows.addWindow(
              {
                title: 'Info',
                component: Info,
                componentData: {},
                options: {
                  prompt: false,
                  scaleX: false,
                  scaleY: false,
                  scrollX: false,
                  scrollY: false
                }
              },
              {
                group: 'workbench13Extras13ToolsBase64Converter'
              }
            );
          }
        }
      ]
    }
  ];
};