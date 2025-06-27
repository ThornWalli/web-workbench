import Theme, { getDefaultThemeColors } from '../classes/Theme';

export default new Theme('Pastel Beige', {
  colors: getDefaultThemeColors({
    layout: {
      primary: '#F5F5DC',
      secondary: '#000000',
      tertiary: '#D2B48C',
      quaternary: '#6B4226',
      invert: {
        primary: '#6B4226',
        secondary: '#D2B48C',
        tertiary: '#000000',
        quaternary: '#F5F5DC'
      }
    },
    content: {
      primary: '#F5F5DC',
      secondary: '#000000',
      tertiary: '#D2B48C',
      quaternary: '#6B4226',
      invert: {
        primary: '#F5F5DC',
        secondary: '#6B4226',
        tertiary: '#000000',
        quaternary: '#F5F5DC'
      }
    }
  })
});

// // export default new Theme('Pastel Beige', {
//   colors: {
//     screen: {
//       background: '#F5F5DC' // Heller Pastellbeige-Ton
//     },

//     header: {
//       background: '#F5F5DC',
//       coverBackground: '#F5F5DC',
//       coverTitle: '#6B4226', // Dunklerer Braunton für besseren Kontrast
//       title: '#6B4226'
//     },

//     windowHeader: {
//       background: '#F5F5DC',
//       stripes: '#D2B48C', // Mittelheller Beige-Ton
//       title: '#6B4226',
//       buttonBackground: '#D2B48C',
//       buttonPrimary: '#6B4226',
//       buttonSecondary: '#D2B48C',
//       filled: {
//         background: '#6B4226',
//         stripes: '#F5F5DC',
//         title: '#F5F5DC',
//         buttonBackground: '#F5F5DC',
//         buttonPrimary: '#6B4226',
//         buttonSecondary: '#F5F5DC'
//       }
//     },

//     contextMenu: {
//       border: '#D2B48C'
//     },

//     contextMenuItem: {
//       background: '#F5F5DC',
//       label: '#6B4226',
//       indicatorContext: '#6B4226',
//       hotkey: '#6B4226'
//     },

//     contextMenuSeparator: {
//       background: '#D2B48C'
//     },

//     window: {
//       text: '#6B4226',
//       background: '#F5F5DC',
//       border: '#D2B48C',
//       borderScaling: '#D2B48C',
//       helper__scaleBackground: '#F5F5DC',
//       helper__scaleIcon: '#6B4226',
//       helper__scaleIconActive: '#6B4226',
//       filled: {
//         text: '#F5F5DC',
//         background: '#6B4226',
//         border: '#F5F5DC'
//       }
//     },

//     scrollContent: {
//       scrollbarCorner: '#F5F5DC',
//       scrollbarSpacer: '#D2B48C',
//       scrollbarBackground: '#F5F5DC',
//       scrollbarHelperBackground: '#F5F5DC',
//       scrollbarHelper: '#6B4226',
//       scrollbarHelperActive: '#6B4226',
//       scrollbarRange: '#F5F5DC',
//       filled: {
//         scrollbarCorner: '#6B4226',
//         scrollbarSpacer: '#F5F5DC',
//         scrollbarBackground: '#6B4226',
//         scrollbarHelperBackground: '#6B4226',
//         scrollbarHelper: '#F5F5DC',
//         scrollbarHelperActive: '#F5F5DC',
//         scrollbarRange: '#6B4226'
//       }
//     },

//     symbolWrapperItem: {
//       text: '#6B4226'
//     },

//     textfield: {
//       text: '#6B4226',
//       background: '#F5F5DC',
//       border: '#D2B48C',
//       outline: '#6B4226',
//       dialog: {
//         text: '#6B4226',
//         background: '#F5F5DC',
//         border: '#D2B48C',
//         outline: '#6B4226'
//       },
//       disabledReadonlyText: '#A9A9A9', // Etwas dunklerer Grauton
//       disabledReadonlyBackground: '#F5F5DC'
//     },

//     textarea: {
//       text: '#6B4226',
//       background: '#F5F5DC',
//       border: '#D2B48C',
//       outline: '#6B4226',
//       resizeBackground: '#D2B48C',
//       resizeIcon: '#6B4226',
//       filled: {
//         text: '#F5F5DC',
//         background: '#6B4226',
//         border: '#6B4226',
//         outline: '#F5F5DC',
//         resizeBackground: '#F5F5DC',
//         resizeIcon: '#6B4226'
//       }
//     },

//     itemSelect: {
//       border: '#D2B48C'
//     },

//     itemSelectItem: {
//       border: '#D2B48C',
//       background: '#F5F5DC',
//       disabledLabelText: '#A9A9A9',
//       disabledLabelbackground: '#F5F5DC'
//     },

//     button: {
//       label: '#6B4226',
//       /* Primary Style */
//       primary: {
//         label: '#F5F5DC',
//         background: '#6B4226',
//         border: '#A9A9A9',
//         outline: '#F5F5DC'
//       },
//       /* Secondary Style */
//       secondary: {
//         label: '#F5F5DC',
//         background: '#6B4226',
//         border: '#D2B48C'
//       },
//       /* Dialog Style */
//       dialog: {
//         label: '#F5F5DC',
//         background: '#6B4226',
//         border: '#D2B48C',
//         outline: '#A9A9A9'
//       },
//       filled: {
//         label: '#F5F5DC',
//         /* Primary Style */
//         primary: {
//           label: '#6B4226',
//           background: '#F5F5DC',
//           border: '#6B4226',
//           outline: '#6B4226'
//         },
//         /* Secondary Style */
//         secondary: {
//           label: '#6B4226',
//           background: '#F5F5DC',
//           border: '#6B4226'
//         },
//         /* Dialog Style */
//         dialog: {
//           label: '#6B4226',
//           background: '#F5F5DC',
//           border: '#6B4226',
//           outline: '#6B4226'
//         }
//       }
//     },

//     markdown: {
//       typo: {
//         selection: '#D2B48C',
//         headlinePrimary: '#6B4226',
//         headlineSecondary: '#A9A9A9',
//         strong: '#A9A9A9',
//         strongEm: '#6B4226',
//         link: '#A9A9A9',
//         linkHover: '#6B4226',
//         del: '#6B4226',
//         line: '#D2B48C',
//         blockquoteBackground: '#A9A9A9',
//         blockquoteText: '#F5F5DC',
//         codeBackground: '#A9A9A9',
//         codeText: '#F5F5DC',
//         codeSelection: '#F5F5DC',
//         filled: {
//           selection: '#6B4226',
//           headlinePrimary: '#F5F5DC',
//           headlineSecondary: '#A9A9A9',
//           strong: '#A9A9A9',
//           strongEm: '#F5F5DC',
//           link: '#A9A9A9',
//           linkHover: '#F5F5DC',
//           del: '#F5F5DC',
//           line: '#F5F5DC',
//           blockquoteBackground: '#A9A9A9',
//           blockquoteText: '#6B4226',
//           codeBackground: '#A9A9A9',
//           codeText: '#6B4226',
//           codeSelection: '#6B4226'
//         }
//       }
//     },

//     dialogContent: {
//       backgroundPrimary: '#D2B48C',
//       backgroundSecondary: '#F5F5DC',
//       text: '#6B4226'
//     }
//   }
// });
