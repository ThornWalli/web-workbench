import Theme from '../classes/Theme';

export default new Theme('White Contrast', {
  colors: {
    screen: {
      background: '#fff'
    },

    header: {
      background: '#fff',
      coverBackground: '#fff',
      coverTitle: '#000',
      title: '#000'
    },

    windowHeader: {
      background: '#fff',
      stripes: '#000',
      title: '#000',
      buttonBackground: '#000',
      buttonPrimary: '#fff',
      buttonSecondary: '#000',
      filled: {
        background: '#000',
        stripes: '#fff',
        title: '#fff',
        buttonBackground: '#fff',
        buttonPrimary: '#000',
        buttonSecondary: '#fff'
      }
    },

    contextMenu: {
      border: '#000'
    },

    contextMenuItem: {
      background: '#fff',
      label: '#000',
      indicatorContext: '#000',
      hotkey: '#000'
    },

    contextMenuSeparator: {
      background: '#000'
    },

    window: {
      text: '#000',
      background: '#fff',
      border: '#000',
      borderScaling: '#000',
      helper__scaleBackground: '#fff',
      helper__scaleIcon: '#000',
      helper__scaleIconActive: '#000',
      filled: {
        text: '#fff',
        background: '#000',
        border: '#fff'
      }
    },

    scrollContent: {
      scrollbarCorner: '#fff',
      scrollbarSpacer: '#000',
      scrollbarBackground: '#fff',
      scrollbarHelperBackground: '#fff',
      scrollbarHelper: '#000',
      scrollbarHelperActive: '#000',
      scrollbarRange: '#fff',
      filled: {
        scrollbarCorner: '#000',
        scrollbarSpacer: '#fff',
        scrollbarBackground: '#000',
        scrollbarHelperBackground: '#000',
        scrollbarHelper: '#fff',
        scrollbarHelperActive: '#fff',
        scrollbarRange: '#000'
      }
    },

    symbolWrapperItem: {
      text: '#000'
    },

    textfield: {
      text: '#000',
      background: '#fff',
      border: '#fff',
      outline: '#000',
      dialog: {
        text: '#000',
        background: '#fff',
        border: '#fff',
        outline: '#000'
      },
      disabledReadonlyText: '#AAA',
      disabledReadonlyBackground: '#fff'
    },

    textarea: {
      text: '#000',
      background: '#fff',
      border: '#fff',
      outline: '#000',
      resizeBackground: '#000',
      resizeIcon: '#fff',
      filled: {
        text: '#fff',
        background: '#000',
        border: '#fff',
        outline: '#fff',
        resizeBackground: '#fff',
        resizeIcon: '#000'
      }
    },

    itemSelect: {
      border: '#000'
    },

    itemSelectItem: {
      border: '#000',
      background: '#fff',
      disabledLabelText: '#AAA',
      disabledLabelbackground: '#fff'
    },

    button: {
      label: '#fff',
      /* Primary Style */
      primary: {
        label: '#000',
        background: '#fff',
        border: '#AAA',
        outline: '#000'
      },
      /* Secondary Style */
      secondary: {
        label: '#000',
        background: '#fff',
        border: '#000'
      },
      /* Dialog Style */
      dialog: {
        label: '#000',
        background: '#fff',
        border: '#000',
        outline: '#AAA'
      },
      filled: {
        label: '#000',
        /* Primary Style */
        primary: {
          label: '#fff',
          background: '#000',
          border: '#fff',
          outline: '#000'
        },
        /* Secondary Style */
        secondary: {
          label: '#fff',
          background: '#000',
          border: '#000'
        },
        /* Dialog Style */
        dialog: {
          label: '#fff',
          background: '#000',
          border: '#000',
          outline: '#fff'
        }
      }
    },

    markdown: {
      typo: {
        selection: '#000',
        headlinePrimary: '#000',
        headlineSecondary: '#AAA',
        strong: '#AAA',
        strongEm: '#000',
        link: '#AAA',
        linkHover: '#000',
        del: '#000',
        line: '#000',
        blockquoteBackground: '#AAA',
        blockquoteText: '#000',
        codeBackground: '#AAA',
        codeText: '#000',
        codeSelection: '#000',
        filled: {
          selection: '#fff',
          headlinePrimary: '#fff',
          headlineSecondary: '#aaa',
          strong: '#aaa',
          strongEm: '#fff',
          link: '#aaa',
          linkHover: '#fff',
          del: '#fff',
          line: '#fff',
          blockquoteBackground: '#aaa',
          blockquoteText: '#fff',
          codeBackground: '#aaa',
          codeText: '#fff',
          codeSelection: '#fff'
        }
      }
    },

    dialogContent: {
      backgroundPrimary: '#000',
      backgroundSecondary: '#fff',
      text: '#fff'
    }
  }
});
