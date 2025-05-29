import { filter } from 'rxjs';
import { SYMBOL } from '@web-workbench/core/utils/symbols';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFloppyDisk } from '@web-workbench/core/classes/FileSystem/utils';

import symbols from './symbols';
import markdown from './markdown';

export default defineFloppyDisk(async ({ core }) => {
  return {
    meta: [
      [ITEM_META.SYMBOL, SYMBOL.DISK_2],
      [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
      [ITEM_META.WINDOW_SYMBOL_REARRANGE, true],
      [ITEM_META.VISIBLE, false]
    ],
    name: 'Debug',
    items: [
      ...(await markdown({ core })),
      {
        id: 'FormFields.app',
        name: 'Form Fields',
        async action({ modules }) {
          const component = await import('./components/FormFields.vue').then(
            module => module.default
          );
          const window = modules.windows?.addWindow(
            {
              component,
              componentData: { core },
              options: {
                title: 'Form Fields',
                scaleX: true,
                scaleY: true,
                scrollX: false,
                scrollY: true
              }
            },
            {
              full: true
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
      {
        id: 'Tests.app',
        name: 'Tests',
        async action({ modules }) {
          const component = await import('./components/Tests.vue').then(
            module => module.default
          );
          modules.windows?.addWindow(
            {
              component,
              componentData: { core },
              options: {
                title: 'Tests',
                scaleX: true,
                scaleY: true,
                scrollX: false,
                scrollY: true
              }
            },
            {
              full: true
            }
          );
        }
      },
      {
        id: 'Chars.app',
        name: 'Chars',
        async action({ modules }) {
          const component = await import('./components/Chars.vue').then(
            module => module.default
          );
          modules.windows?.addWindow(
            {
              component,
              componentData: { core },
              options: {
                title: 'Chars',
                scaleX: true,
                scaleY: true,
                scrollX: false,
                scrollY: true
              }
            },
            {
              full: true
            }
          );
        }
      },
      ...(await symbols({ core }))
    ]
  };
});
