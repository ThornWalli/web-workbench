import { filter } from 'rxjs';
import { ipoint } from '@js-basics/vector';

import { SYMBOL as SYMBOL_CORE } from '@web-workbench/core/utils/symbols';

import clock from './clock';
import say from './say';
import calculator from './calculator';
import cloud from './cloud';
import documentEditor from './documentEditor';
import documentReader from './documentReader';
import screenDiagnose from './screenDiagnose';

import documentHelpContent from './document-help.md?raw';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFloppyDisk } from '@web-workbench/core/classes/FileSystem/utils';
import {
  DEFAULT_FONT_SIZE,
  FONT_FAMILES,
  getDefaultConfig as getDefaultDocumentEditorConfig
} from './documentEditor/utils';
import { FONT_TYPES } from './documentEditor/types';
import { SYMBOL } from './types';
import './style.pcss';

export default defineFloppyDisk(async ({ core }) => {
  core.config.setDefaults(getDefaultDocumentEditorConfig());

  core.modules.symbols?.addSymbols(
    [
      {
        key: SYMBOL.CALCULATOR,
        component: await import(
          './assets/symbols/calculator.svg?component'
        ).then(module => module.default),
        group: 'disk_workbench13'
      },
      {
        key: SYMBOL.CLOCK,
        component: await import('./assets/symbols/clock.svg?component').then(
          module => module.default
        ),
        group: 'disk_workbench13'
      },
      {
        key: SYMBOL.CLOUD,
        component: await import('./assets/symbols/cloud.svg?component').then(
          module => module.default
        ),
        group: 'disk_workbench13'
      },
      {
        key: SYMBOL.COLORS,
        component: await import('./assets/symbols/colors.svg?component').then(
          module => module.default
        ),
        group: 'disk_workbench13'
      },
      {
        key: SYMBOL.CONSOLE,
        component: await import('./assets/symbols/console.svg?component').then(
          module => module.default
        ),
        group: 'disk_workbench13'
      },
      {
        key: SYMBOL.DISK_WORKBENCH13,
        component: await import(
          './assets/symbols/disk_workbench13.svg?component'
        ).then(module => module.default),
        group: 'disk_workbench13'
      },
      {
        key: SYMBOL.DOCUMENT_EDITOR,
        component: await import(
          './assets/symbols/document_editor.svg?component'
        ).then(module => module.default),
        group: 'disk_workbench13'
      },
      {
        key: SYMBOL.DOCUMENT_READER,
        component: await import(
          './assets/symbols/document_reader.svg?component'
        ).then(module => module.default),
        group: 'disk_workbench13'
      },
      {
        key: SYMBOL.SETTINGS,
        component: await import('./assets/symbols/settings.svg?component').then(
          module => module.default
        ),
        group: 'disk_workbench13'
      },
      {
        key: SYMBOL.PALETTE,
        component: await import('./assets/symbols/palette.svg?component').then(
          module => module.default
        ),
        group: 'disk_workbench13'
      },
      {
        key: SYMBOL.FULLSCREEN,
        component: await import(
          './assets/symbols/fullscreen.svg?component'
        ).then(module => module.default),
        group: 'disk_workbench13'
      },
      {
        key: SYMBOL.SAY,
        component: await import('./assets/symbols/say.svg?component').then(
          module => module.default
        ),
        group: 'disk_workbench13'
      },
      {
        key: SYMBOL.SCREEN_DIAGNOSE,
        component: await import(
          './assets/symbols/screen_diagnose.svg?component'
        ).then(module => module.default),
        group: 'disk_workbench13'
      }
    ]
    // {
    // [SYMBOL.CALCULATOR]: await import(
    //   './assets/symbols/calculator.svg?component'
    // ).then(module => module.default),
    // [SYMBOL.CLOCK]: await import('./assets/symbols/clock.svg?component').then(
    //   module => module.default
    // ),
    // [SYMBOL.CLOUD]: await import('./assets/symbols/cloud.svg?component').then(
    //   module => module.default
    // ),
    // [SYMBOL.COLORS]: await import('./assets/symbols/colors.svg?component').then(
    //   module => module.default
    // ),
    // [SYMBOL.CONSOLE]: await import(
    //   './assets/symbols/console.svg?component'
    // ).then(module => module.default),
    // [SYMBOL.DISK_WORKBENCH13]: await import(
    //   './assets/symbols/disk_workbench13.svg?component'
    // ).then(module => module.default),
    // [SYMBOL.DOCUMENT_EDITOR]: await import(
    //   './assets/symbols/document_editor.svg?component'
    // ).then(module => module.default),
    // [SYMBOL.DOCUMENT_READER]: await import(
    //   './assets/symbols/document_reader.svg?component'
    // ).then(module => module.default),
    // [SYMBOL.SETTINGS]: await import(
    //   './assets/symbols/settings.svg?component'
    // ).then(module => module.default),
    // [SYMBOL.PALETTE]: await import(
    //   './assets/symbols/palette.svg?component'
    // ).then(module => module.default),
    // [SYMBOL.FULLSCREEN]: await import(
    //   './assets/symbols/fullscreen.svg?component'
    // ).then(module => module.default)
    // }
  );

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
      ...(await say({ core })),
      {
        id: 'Others',
        name: 'Others',
        meta: [
          [ITEM_META.WINDOW_SIZE, ipoint(280, 120)],
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
          },
          ...(await screenDiagnose({ core }))
        ]
      },
      {
        id: 'Prefs',
        name: 'Prefs',
        createdDate: new Date(2020, 4, 16).getTime(),
        editedDate: new Date(2020, 4, 17).getTime(),
        meta: [
          [ITEM_META.SYMBOL, SYMBOL_CORE.DIRECTORY_PREFS],
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
        meta: [[ITEM_META.SYMBOL, SYMBOL_CORE.LARGE_NOTE_RICH]],
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
