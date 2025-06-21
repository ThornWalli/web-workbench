import Theme, { getDefaultThemeColors } from '../classes/Theme';

export default new Theme('Black Contrast', {
  colors: getDefaultThemeColors(['#000', '#fff', '#fff', '#fff'])
});

// export default new Theme('Black Contrast', {
//   colors: {
//     screen: {
//       background: '#000'
//     },

//     header: {
//       background: '#000',
//       coverBackground: '#000',
//       coverTitle: '#fff',
//       title: '#fff'
//     },

//     windowHeader: {
//       background: '#000',
//       stripes: '#fff',
//       title: '#fff',
//       buttonBackground: '#fff',
//       buttonPrimary: '#000',
//       buttonSecondary: '#fff',
//       filled: {
//         background: '#fff',
//         stripes: '#000',
//         title: '#000',
//         buttonBackground: '#000',
//         buttonPrimary: '#fff',
//         buttonSecondary: '#000'
//       }
//     },

//     contextMenu: {
//       border: '#fff'
//     },

//     contextMenuItem: {
//       background: '#000',
//       label: '#fff',
//       indicatorContext: '#fff',
//       hotkey: '#fff'
//     },

//     contextMenuSeparator: {
//       background: '#fff'
//     },

//     window: {
//       text: '#fff',
//       background: '#000',
//       border: '#fff',
//       borderScaling: '#fff',
//       helper__scaleBackground: '#000',
//       helper__scaleIcon: '#fff',
//       helper__scaleIconActive: '#fff',
//       filled: {
//         text: '#000',
//         background: '#fff',
//         border: '#000'
//       }
//     },

//     scrollContent: {
//       scrollbarCorner: '#000',
//       scrollbarSpacer: '#fff',
//       scrollbarBackground: '#000',
//       scrollbarHelperBackground: '#000',
//       scrollbarHelper: '#fff',
//       scrollbarHelperActive: '#fff',
//       scrollbarRange: '#000',
//       filled: {
//         scrollbarCorner: '#fff',
//         scrollbarSpacer: '#000',
//         scrollbarBackground: '#fff',
//         scrollbarHelperBackground: '#fff',
//         scrollbarHelper: '#000',
//         scrollbarHelperActive: '#000',
//         scrollbarRange: '#fff'
//       }
//     },

//     symbolWrapperItem: {
//       text: '#fff'
//     },

//     textfield: {
//       text: '#fff',
//       background: '#000',
//       border: '#000',
//       outline: '#fff',
//       dialog: {
//         text: '#fff',
//         background: '#000',
//         border: '#000',
//         outline: '#fff'
//       },
//       disabledReadonlyText: '#AAA',
//       disabledReadonlyBackground: '#000'
//     },

//     textarea: {
//       text: '#fff',
//       background: '#000',
//       border: '#000',
//       outline: '#fff',
//       resizeBackground: '#fff',
//       resizeIcon: '#000',
//       filled: {
//         text: '#000',
//         background: '#fff',
//         border: '#fff',
//         outline: '#000',
//         resizeBackground: '#000',
//         resizeIcon: '#fff'
//       }
//     },

//     itemSelect: {
//       border: '#fff'
//     },

//     itemSelectItem: {
//       border: '#fff',
//       background: '#000',
//       disabledLabelText: '#AAA',
//       disabledLabelbackground: '#000'
//     },

//     button: {
//       label: '#000',
//       /* Primary Style */
//       primary: {
//         label: '#fff',
//         background: '#000',
//         border: '#AAA',
//         outline: '#fff'
//       },
//       /* Secondary Style */
//       secondary: {
//         label: '#fff',
//         background: '#000',
//         border: '#fff'
//       },
//       /* Dialog Style */
//       dialog: {
//         label: '#fff',
//         background: '#000',
//         border: '#fff',
//         outline: '#AAA'
//       },
//       filled: {
//         label: '#fff',
//         /* Primary Style */
//         primary: {
//           label: '#000',
//           background: '#fff',
//           border: '#000',
//           outline: '#000'
//         },
//         /* Secondary Style */
//         secondary: {
//           label: '#000',
//           background: '#fff',
//           border: '#000'
//         },
//         /* Dialog Style */
//         dialog: {
//           label: '#000',
//           background: '#fff',
//           border: '#000',
//           outline: '#000'
//         }
//       }
//     },

//     markdown: {
//       typo: {
//         selection: '#fff',
//         headlinePrimary: '#fff',
//         headlineSecondary: '#AAA',
//         strong: '#AAA',
//         strongEm: '#fff',
//         link: '#AAA',
//         linkHover: '#fff',
//         del: '#fff',
//         line: '#fff',
//         blockquoteBackground: '#AAA',
//         blockquoteText: '#fff',
//         codeBackground: '#AAA',
//         codeText: '#fff',
//         codeSelection: '#fff',
//         filled: {
//           selection: '#000',
//           headlinePrimary: '#000',
//           headlineSecondary: '#aaa',
//           strong: '#aaa',
//           strongEm: '#000',
//           link: '#aaa',
//           linkHover: '#000',
//           del: '#000',
//           line: '#000',
//           blockquoteBackground: '#aaa',
//           blockquoteText: '#000',
//           codeBackground: '#aaa',
//           codeText: '#000',
//           codeSelection: '#000'
//         }
//       }
//     },

//     dialogContent: {
//       backgroundPrimary: '#fff',
//       backgroundSecondary: '#000',
//       text: '#000'
//     }
//   }
// });
