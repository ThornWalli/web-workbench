import WbClockInfo from './components/Info';

export default ({ core }) => {
  const { windows } = core.modules;
  return [
    {
      title: 'Clock',
      items: [
        {
          hotKey: 'I',
          keyCode: 73,
          title: 'Info',
          action () {
            windows.addWindow({
              title: 'Info',
              component: WbClockInfo,
              componentData: {},
              options: {
                scale: false,
                prompt: false,
                scrollX: false,
                scrollY: false
              }
            }, {
              group: 'workbench13Clock'
            });
          }
        }
      ]
    }
  ];
};
