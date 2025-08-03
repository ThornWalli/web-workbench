import Theme from '@web-workbench/core/classes/Theme';

export default new Theme({
  name: 'Black Contrast',
  colorOptions: {
    layout: {
      primary: '#aaa',
      secondary: '#fff',
      tertiary: '#aaa',
      quaternary: '#fff',
      invert: {
        primary: '#aaa',
        secondary: '#fff',
        tertiary: '#aaa',
        quaternary: '#fff'
      }
    },
    content: {
      primary: '#fff',
      secondary: '#aaa',
      tertiary: '#fff',
      quaternary: '#fff',
      invert: {
        primary: '#aaa',
        secondary: '#fff',
        tertiary: '#aaa',
        quaternary: '#aaa'
      }
    }
  }
});
