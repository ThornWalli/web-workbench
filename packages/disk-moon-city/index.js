import { ITEM_META } from '@web-workbench/core/classes/FileSystem/Item';
import { SYMBOL } from '@web-workbench/core/utils/symbols';

export default async ({ core }) => {
  const [Demo] = await Promise.all([
    import('./components/App').then(module => module.default)
  ]);
  return {
    meta: [
      [ITEM_META.SYMBOL, SYMBOL.DISK_2],
      [ITEM_META.WINDOW_SYMBOL_REARRANGE, true],
      [ITEM_META.VISIBLE, true]
    ],
    name: 'Moon City',
    items: [
      {
        id: 'Moon City.app',
        action({ modules }) {
          modules.windows.addWindow(
            {
              title: 'Moon City',
              component: Demo,
              componentData: { core },
              options: {
                scaleX: true,
                scaleY: true,
                scrollX: true,
                scrollY: true,
                center: false,
                embed: false,
                borderless: true
              }
              // layout: {
              //   size: ipoint(540, 360)
              // }
            },
            {
              full: true
            }
          );
        }
      }
    ]
  };
};
