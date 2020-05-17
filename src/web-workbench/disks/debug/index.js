import { ITEM_META } from '../../classes/FileSystem/Item';
import { SYMBOL } from '../../utils/symbols';

export default async ({ core }) => {
  const [
    Tests, Symbols
  ] = await Promise.all([
    import('@/components/disks/debug/Tests').then(module => module.default),
    import('@/components/disks/debug/Symbols').then(module => module.default)
  ]);

  return {
    meta: [
      [
        ITEM_META.SYMBOL, SYMBOL.DISK_2
      ],
      [
        ITEM_META.SORT_SYMBOLS, true
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
