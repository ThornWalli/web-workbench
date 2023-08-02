import { ITEM_META } from '@web-workbench/core/classes/FileSystem/Item';
import { SYMBOL } from '@web-workbench/core/utils/symbols';

export default async ({ core }) => {
  const [
    Tests, Symbols
  ] = await Promise.all([
    import('./components/Tests').then(module => module.default),
    import('./components/Symbols').then(module => module.default)
  ]);

  return {
    meta: [
      [
        ITEM_META.SYMBOL, SYMBOL.DISK_2
      ],
      [
        ITEM_META.WINDOW_SYMBOL_REARRANGE, true
      ],
      [
        ITEM_META.VISIBLE, false
      ]
    ],
    name: 'Debug',
    items: [
      {
        id: 'Tests.info',
        action ({ modules }) {
          modules.windows.addWindow({
            title: 'Tests',
            component: Tests,
            componentData: { core },
            options: {
              scale: true,
              scrollX: false,
              scrollY: true
            }
          }, {
            full: true
          });
        }
      },
      {
        id: 'Symbols.info',
        action ({ modules }) {
          modules.windows.addWindow({
            title: 'Symbols',
            component: Symbols,
            componentData: { core },
            options: {
              scale: true,
              scrollX: false,
              scrollY: true
            }
          }, {
            full: true
          });
        }
      }
    ]
  };
};
