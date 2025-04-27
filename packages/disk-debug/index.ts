import { filter } from 'rxjs';
import { SYMBOL } from '@web-workbench/core/utils/symbols';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFloppyDisk } from '@web-workbench/core/classes/FileSystem/utils';

export default defineFloppyDisk(({ core }) => {
  return {
    meta: [
      [ITEM_META.SYMBOL, SYMBOL.DISK_2],
      [ITEM_META.WINDOW_SYMBOL_REARRANGE, true],
      [ITEM_META.VISIBLE, false]
    ],
    name: 'Debug',
    items: [
      {
        id: 'FormFields.info',
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
        id: 'Tests.info',
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
        id: 'Symbols.info',
        async action({ modules }) {
          const component = await import('./components/Symbols.vue').then(
            module => module.default
          );
          modules.windows?.addWindow(
            {
              component,
              componentData: { core },
              options: {
                title: 'Symbols',
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
      }
    ]
  };
});
