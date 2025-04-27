import { filter } from 'rxjs';
import { ipoint } from '@js-basics/vector';

import { SYMBOL } from '@web-workbench/core/utils/symbols';

import clock from './clock';
import calculator from './calculator';
import cloud from './cloud';
import documentEditor from './documentEditor';
import documentReader from './documentReader';

import documentHelpContent from './document-help.md?raw';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFloppyDisk } from '@web-workbench/core/classes/FileSystem/utils';
import {
  DEFAULT_FONT_SIZE,
  FONT_FAMILES,
  getDefaultConfig as getDefaultDocumentEditorConfig
} from './documentEditor/utils';
import { FONT_TYPES } from './documentEditor/types';

export default defineFloppyDisk(async ({ core }) => {
  core.config.setDefaults(getDefaultDocumentEditorConfig());

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
        async action({ modules }) {
          const component = await import(
            '@web-workbench/core/components/Console.vue'
          ).then(module => module.default);
          const window = modules.windows?.addWindow(
            {
              component,
              componentData: {
                showIntroduction: true
              },
              options: {
                title: 'Shell',
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
            window?.events
              .pipe(filter(({ name }) => name === 'close'))
              .subscribe(() => {
                resolve(undefined);
              });
          });
        }
      },
      ...(await cloud({ core })),
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
      ...(await clock({ core })),
      ...(await calculator({ core })),
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
            async action({ modules }) {
              const component = await import(
                '@web-workbench/core/components/Console.vue'
              ).then(module => module.default);
              const window = modules.windows?.addWindow(
                {
                  component,
                  componentData: {
                    showIntroduction: true
                  },
                  options: {
                    title: 'Shell',
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
                  maximize: true
                }
              );
              return new Promise(resolve => {
                window?.events
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
      ...(await documentReader({ core })),
      ...(await documentEditor({ core })),
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
          fontFamily: FONT_FAMILES[FONT_TYPES.SansSerif]['Comic Sans MS'],
          fontSize: DEFAULT_FONT_SIZE
        }
      }
    ]
  };
});
