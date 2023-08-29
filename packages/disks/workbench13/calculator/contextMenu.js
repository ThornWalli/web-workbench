import WbCalculatorInfo from './components/Info';

export default ({ core }) => {
  const { windows } = core.modules;
  return [
    {
      title: 'Calculator',
      items: [
        {
          hotKey: 'I',
          keyCode: 73,
          title: 'Info',
          action() {
            windows.addWindow(
              {
                title: 'Info',
                component: WbCalculatorInfo,
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
                group: 'workbench13Calculator'
              }
            );
          }
        }
      ]
    }
  ];
};
