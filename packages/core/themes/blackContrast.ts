import Theme from '../classes/Theme';

export default new Theme('Black Contrast', {
  colors: {
    screen: {
      background: '#000'
    },

    header: {
      background: '#000',
      coverBackground: '#000',
      coverTitle: '#fff',
      title: '#fff'
    },

    windowHeader: {
      background: '#000',
      stripes: '#fff',
      title: '#fff',
      buttonBackground: '#fff',
      buttonPrimary: '#000',
      buttonSecondary: '#fff',
      filled: {
        background: '#fff',
        stripes: '#000',
        title: '#000',
        buttonBackground: '#000',
        buttonPrimary: '#fff',
        buttonSecondary: '#000'
      }
    },

    contextMenu: {
      border: '#fff'
    },

    contextMenuItem: {
      background: '#000',
      label: '#fff',
      indicatorContext: '#fff',
      hotkey: '#fff'
    },

    contextMenuSeparator: {
      background: '#fff'
    },

    window: {
      text: '#fff',
      background: '#000',
      border: '#fff',
      borderScaling: '#fff',
      helper__scaleBackground: '#000',
      helper__scaleIcon: '#fff',
      helper__scaleIconActive: '#fff',
      filled: {
        text: '#000',
        background: '#fff',
        border: '#000'
      }
    },

    scrollContent: {
      scrollbarCorner: '#000',
      scrollbarSpacer: '#fff',
      scrollbarBackground: '#000',
      scrollbarHelperBackground: '#000',
      scrollbarHelper: '#fff',
      scrollbarHelperActive: '#fff',
      scrollbarRange: '#000'
    },

    symbolWrapperItem: {
      text: '#fff'
    },

    textfield: {
      text: '#fff',
      background: '#000',
      border: '#000',
      outline: '#fff',
      dialog: {
        text: '#fff',
        background: '#000',
        border: '#000',
        outline: '#fff'
      },
      disabledReadonlyText: '#AAA',
      disabledReadonlyBackground: '#000'
    },

    textarea: {
      text: '#fff',
      background: '#000',
      border: '#000',
      outline: '#fff',
      resizeBackground: '#fff',
      resizeIcon: '#000',
      filled: {
        text: '#000',
        background: '#fff',
        border: '#fff',
        outline: '#000',
        resizeBackground: '#000',
        resizeIcon: '#fff'
      }
    },

    itemSelect: {
      border: '#fff'
    },

    itemSelectItem: {
      border: '#fff',
      background: '#000',
      disabledLabelText: '#AAA',
      disabledLabelbackground: '#000'
    },

    button: {
      label: '#000',
      /* Primary Style */
      primary: {
        label: '#fff',
        background: '#000',
        border: '#AAA',
        outline: '#fff'
      },
      /* Secondary Style */
      secondary: {
        label: '#fff',
        background: '#000',
        border: '#fff'
      },
      /* Dialog Style */
      dialog: {
        label: '#fff',
        background: '#000',
        border: '#fff',
        outline: '#AAA'
      }
    },

    markdown: {
      typo: {
        selection: '#fff',
        headlinePrimary: '#fff',
        headlineSecondary: '#AAA',
        strong: '#AAA',
        strongEm: '#fff',
        link: '#AAA',
        linkHover: '#fff',
        del: '#fff',
        line: '#fff',
        blockquoteBackground: '#AAA',
        blockquoteText: '#fff',
        codeBackground: '#AAA',
        codeText: '#fff',
        codeSelection: '#fff'
      }
    },

    dialogContent: {
      backgroundPrimary: '#fff',
      backgroundSecondary: '#000',
      text: '#000'
    }
  }
});
