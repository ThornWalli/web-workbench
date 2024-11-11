import { filter } from 'rxjs';
import { ipoint } from '@js-basics/vector';

import WbComponentsConsole from '@web-workbench/core/components/Console';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/Item';
import { SYMBOL } from '@web-workbench/core/utils/symbols';

import clockAction from './clock';
import calculatorAction from './calculator';
import cloudAction from './cloud';
import documentEditorAction, {
  DEFAULT_FONT_SIZE,
  FONT_FAMILES,
  CONFIG_DEFAULTS as CONFIG_DEFAULTS_DOCUMENT_EDITOR
} from './documentEditor';
import documentReaderAction from './documentReader';

import documentHelpContent from './document-help.md?raw';

export default ({ core }) => {
  core.config.setDefaults(CONFIG_DEFAULTS_DOCUMENT_EDITOR);

  return {
    locked: true,
    meta: [
      [ITEM_META.SYMBOL, SYMBOL.DISK_WORKBENCH13],
      [ITEM_META.WINDOW_SIZE, ipoint(400, 290)],
      [ITEM_META.WINDOW_POSITION, ipoint(40, 90)],
      [ITEM_META.WINDOW_SYMBOL_REARRANGE, true]
    ],
    name: 'Workbench 1.3',
    items: [
      {
        meta: [
          [ITEM_META.SYMBOL, SYMBOL.CONSOLE],
          [ITEM_META.WINDOW_SIZE, ipoint(360, 200)]
        ],
        id: 'Shell.app',
        name: 'Shell',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action({ modules }) {
          const window = modules.windows.addWindow(
            {
              title: 'Shell',
              component: WbComponentsConsole,
              componentData: {
                showIntroduction: true
              },
              options: {
                scaleX: true,
                scaleY: true,
                scrollX: true,
                scrollY: true
              },
              layout: {
                size: ipoint(540, 360)
              }
            },
            {
              group: 'workbench13Shell'
            }
          );
          return new Promise(resolve => {
            window.events
              .pipe(filter(({ name }) => name === 'close'))
              .subscribe(() => {
                resolve();
              });
          });
        }
      },
      {
        meta: [[ITEM_META.SYMBOL, SYMBOL.CLOUD_DISK]],
        id: 'Cloud.app',
        name: 'Cloud',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: cloudAction(core)
      },
      {
        meta: [[ITEM_META.SYMBOL, SYMBOL.FULLSCREEN]],
        id: 'Fullscreen.app',
        name: 'Fullscreen',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action() {
          return core.executeCommand('fullscreen -toggle');
        }
      },
      {
        meta: [[ITEM_META.SYMBOL, SYMBOL.CLOCK]],
        id: 'Clock.app',
        name: 'Clock',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: clockAction(core)
      },
      {
        meta: [[ITEM_META.SYMBOL, SYMBOL.CALCULATOR]],
        id: 'Calculator.app',
        name: 'Calculator',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: calculatorAction(core)
      },
      {
        id: 'Others',
        name: 'Others',
        meta: [
          [ITEM_META.WINDOW_SIZE, ipoint(160, 120)],
          [ITEM_META.WINDOW_SYMBOL_REARRANGE, true]
        ],
        createdDate: new Date(2020, 4, 16).getTime(),
        editedDate: new Date(2020, 4, 17).getTime(),
        items: [
          {
            meta: [
              [ITEM_META.SYMBOL, SYMBOL.CONSOLE],
              [ITEM_META.WINDOW_SIZE, ipoint(360, 200)]
            ],
            id: 'Shell_Fullscreen.app',
            name: 'Shell Fullscreen',
            createdDate: new Date(2017, 7, 5).getTime(),
            editedDate: new Date(2020, 3, 14).getTime(),
            action({ modules }) {
              const window = modules.windows.addWindow(
                {
                  title: 'Shell',
                  component: WbComponentsConsole,
                  componentData: {
                    showIntroduction: true
                  },
                  options: {
                    scaleX: true,
                    scaleY: true,
                    scrollX: true,
                    scrollY: true
                  },
                  layout: {
                    size: ipoint(540, 360)
                  }
                },
                {
                  group: 'workbench13Shell',
                  full: true
                }
              );
              return new Promise(resolve => {
                window.events
                  .pipe(filter(({ name }) => name === 'close'))
                  .subscribe(() => {
                    resolve();
                  });
              });
            }
          }
        ]
      },

      {
        id: 'Prefs',
        name: 'Prefs',
        createdDate: new Date(2020, 4, 16).getTime(),
        editedDate: new Date(2020, 4, 17).getTime(),
        meta: [
          [ITEM_META.SYMBOL, SYMBOL.DIRECTORY_PREFS],
          [ITEM_META.WINDOW_SIZE, ipoint(160, 200)],
          [ITEM_META.WINDOW_SYMBOL_REARRANGE, true]
        ],
        items: [
          {
            meta: [
              [ITEM_META.SYMBOL, SYMBOL.SETTINGS],
              [ITEM_META.WINDOW_SIZE, ipoint(360, 200)]
            ],
            id: 'Settings.ref',
            name: 'Settings',
            createdDate: new Date(2017, 7, 5).getTime(),
            editedDate: new Date(2020, 3, 14).getTime(),
            action() {
              return core.executeCommand('openSettings');
            }
          },
          {
            meta: [
              [ITEM_META.SYMBOL, SYMBOL.PALETTE],
              [ITEM_META.WINDOW_SIZE, ipoint(360, 200)]
            ],
            id: 'ColorSettings.app',
            name: 'Color Settings',
            createdDate: new Date(2017, 7, 5).getTime(),
            editedDate: new Date(2020, 3, 14).getTime(),
            action() {
              return core.executeCommand('openColorSettings');
            }
          }
        ]
      },
      {
        meta: [
          [ITEM_META.SYMBOL, SYMBOL.DOCUMENT_READER],
          [ITEM_META.WINDOW_SIZE, ipoint(360, 200)]
        ],
        id: 'DocumentReader.app',
        name: 'Document Reader',
        createdDate: new Date(2020, 4, 16).getTime(),
        editedDate: new Date(2020, 4, 17).getTime(),
        action: documentReaderAction(core)
      },
      {
        meta: [
          [ITEM_META.SYMBOL, SYMBOL.DOCUMENT_EDITOR],
          [ITEM_META.WINDOW_SIZE, ipoint(360, 200)]
        ],
        id: 'DocumentEditor.app',
        name: 'Document Editor',
        createdDate: new Date(2020, 4, 16).getTime(),
        editedDate: new Date(2020, 4, 17).getTime(),
        action: documentEditorAction(core)
      },
      {
        meta: [[ITEM_META.SYMBOL, SYMBOL.LARGE_NOTE_RICH]],
        id: 'Document_Help.md',
        name: 'Document Help',
        createdDate: new Date(2020, 4, 16).getTime(),
        editedDate: new Date(2020, 4, 17).getTime(),
        data: {
          openMaximized: true,
          type: 'markdown',
          content: documentHelpContent,
          fontFamily: FONT_FAMILES.SansSerif['Comic Sans MS'],
          fontSize: DEFAULT_FONT_SIZE
        }
      }
    ]
  };
};
