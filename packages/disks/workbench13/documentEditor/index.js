import themeWhiteContrast from '@web-workbench/core/themes/whiteContrast';
import { WINDOW_POSITION } from '@web-workbench/core/classes/WindowWrapper';
import { markRaw } from 'vue';
import { ipoint } from '@js-basics/vector';
import { filter } from 'rxjs';

export default function documentEditor(core) {
  const windowsModule = core.modules.windows;
  return async ({ modules }, path) => {
    const executionResolve = core.addExecution();
    const [WbComponentsDocumentEditor, WbComponentsDocumentEditorPreview] =
      await Promise.all([
        import('./components/DocumentEditor').then(module => module.default),
        import('./components/Preview').then(module => module.default)
      ]);

    let model = {
      actions: {},
      value: getDefaultDocumentModel(),
      fsItem: null,
      [CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW]: core.config.get(
        CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW
      )
    };

    if (path) {
      const fsItem = markRaw(await modules.files.fs.get(path));
      const value = Object.assign(
        model.value,
        getDefaultDocumentModel(),
        fsItem.data
      );
      model = Object.assign(model, {
        fsItem,
        value
      });
    }

    const editorWindow = modules.windows.addWindow(
      {
        title: 'Document Editor',
        component: WbComponentsDocumentEditor,
        componentData: { model },
        options: {
          scaleX: false,
          scaleY: false,
          scrollX: true,
          scrollY: true,
          center: false,
          embed: true,
          borderless: true
        },
        layout: {
          size: ipoint(540, 360)
        }
      },
      {
        group: 'workbench13DocumentEditor',
        full: true
      }
    );

    Object.assign(model.actions, {
      close: () => {
        editorWindow.close();
      },
      focus: () => {
        editorWindow.focus();
      },
      reset: () => {
        model.value = getDefaultDocumentModel();
        model.fsItem = null;
      }
    });

    let previewWindow;
    model.actions.togglePreview = (toggle = true) => {
      if (toggle) {
        previewWindow = modules.windows.addWindow(
          {
            title: 'Preview - Document Editor',
            component: WbComponentsDocumentEditorPreview,
            componentData: { model },
            options: {
              scaleX: false,
              scaleY: false,
              scrollX: true,
              scrollY: true,
              center: false,
              close: false,
              embed: true,
              borderless: true
            },
            layout: {
              size: ipoint(540, 360)
            }
          },
          {
            group: 'workbench13DocumentEditor',
            active: false
          }
        );
        window.requestAnimationFrame(() => {
          windowsModule.contentWrapper.setWindowPositions(
            WINDOW_POSITION.SPLIT_HORIZONTAL,
            [editorWindow, previewWindow]
          );
        }, 0);
      } else if (previewWindow) {
        editorWindow.unfocus();
        previewWindow.close();
        window.requestAnimationFrame(() => {
          windowsModule.contentWrapper.setWindowPositions(
            WINDOW_POSITION.SPLIT_HORIZONTAL,
            [editorWindow]
          );
          editorWindow.focus();
        });
      }
    };

    core.modules.screen.setTheme(themeWhiteContrast);

    return new Promise(resolve => {
      executionResolve();
      editorWindow.events
        .pipe(filter(({ name }) => name === 'close'))
        .subscribe(() => {
          if (previewWindow) {
            previewWindow.close();
          }
          core.modules.screen.setTheme(null);
          resolve();
        });
    });
  };
}

export const CONFIG_NAMES = {
  DOCUMENT_EDITOR_SHOW_PREVIEW: 'workbench13_DOCUMENT_EDITOR_SHOW_PREVIEW'
};

export const CONFIG_DEFAULTS = {
  [CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW]: true
};

export const PROPERTY = {
  OUTPUT_TYPE: 'type',
  OPEN_MAXIMIZED: 'openMaximized',
  CONTENT: 'content',
  FONT_FAMILY: 'fontFamily',
  FONT_SIZE: 'fontSize'
};

export const FONT_TYPES = {
  BuiltIn: 'Built-In',
  Serif: 'Serif',
  SansSerif: 'Sans-Serif',
  Monospace: 'Monospace'
};
export const FONT_FAMILES = {
  BuiltIn: {
    'Amiga Topaz 13': '"Amiga Topaz 13"',
    'Amiga Topaz 13 Console':
      '"Amiga Topaz 13 Console", "Amiga Topaz 13", sans-serif'
  },
  Serif: {
    Georgia: 'Georgia, serif',
    'Palatino Linotype': '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    'Times New Roman': '"Times New Roman", Times, serif'
  },
  SansSerif: {
    Arial: 'Arial, Helvetica, sans-serif',
    'Arial Black': '"Arial Black", Gadget, sans-serif',
    'Comic Sans MS': '"Comic Sans MS", cursive, sans-serif',
    Impact: 'Impact, Charcoal, sans-serif',
    'Lucida Sans Unicode': '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
    Tahoma: 'Tahoma, Geneva, sans-serif',
    'Trebuchet MS': '"Trebuchet MS", Helvetica, sans-serif',
    Verdana: 'Verdana, Geneva, sans-serif'
  },
  Monospace: {
    'Courier New': '"Courier New", Courier, monospace',
    'Lucida Console': '"Lucida Console", Monaco, monospace'
  }
};

export const FONT_SIZES = [
  8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36
];

export const DEFAULT_FONT = FONT_FAMILES.BuiltIn['Amiga Topaz 13'];

export const DEFAULT_FONT_SIZE = 16;

export function getDefaultDocumentModel() {
  return {
    [PROPERTY.OPEN_MAXIMIZED]: false,
    [PROPERTY.OUTPUT_TYPE]: 'markdown',
    [PROPERTY.CONTENT]: '',
    [PROPERTY.FONT_FAMILY]: DEFAULT_FONT,
    [PROPERTY.FONT_SIZE]: DEFAULT_FONT_SIZE
  };
}
