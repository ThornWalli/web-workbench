import { ITEM_META } from '../../classes/FileSystem/Item';
import { SYMBOL } from '../../utils/symbols';

export default async ({ core }) => {
  const [
    Symbols
  ] = await Promise.all([
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
