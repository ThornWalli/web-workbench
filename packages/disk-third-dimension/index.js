import { ITEM_META } from '@web-workbench/core/classes/FileSystem/Item';
import { SYMBOL } from '@web-workbench/core/utils/symbols';

export default async ({ core }) => {
  const [Demo] = await Promise.all([
    import('./components/Demo').then(module => module.default)
  ]);
  return {
    meta: [
      [ITEM_META.SYMBOL, SYMBOL.DISK_2],
      [ITEM_META.WINDOW_SYMBOL_REARRANGE, true],
      [ITEM_META.VISIBLE, true]
    ],
    name: 'Third Dimension',
    items: [
      {
        id: 'Demo.app',
        action({ modules }) {
          modules.windows.addWindow(
            {
              title: 'Demo',
              component: Demo,
              componentData: { core },
              options: {
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
};
