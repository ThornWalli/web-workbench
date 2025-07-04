import Theme from '../classes/Theme';

export default new Theme({
  name: 'White Contrast',
  colorOptions: {
    layout: {
      primary: '#fff',
      secondary: '#000',
      tertiary: '#fff',
      quaternary: '#000',
      invert: {
        primary: '#000',
        secondary: '#fff',
        tertiary: '#000',
        quaternary: '#fff'
      }
    },
    content: {
      primary: '#000',
      secondary: '#fff',
      tertiary: '#000',
      quaternary: '#000',
      invert: {
        primary: '#fff',
        secondary: '#000',
        tertiary: '#fff',
        quaternary: '#fff'
      }
    }
  }
});
