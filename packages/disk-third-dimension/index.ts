import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFloppyDisk } from '@web-workbench/core/classes/FileSystem/utils';
import { SYMBOL } from '@web-workbench/core/utils/symbols';

export default defineFloppyDisk(({ core }) => {
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
        async action({ modules }) {
          modules.windows!.addWindow(
            {
              component: await import(
                './thirdDimension/components/Demo.vue'
              ).then(module => module.default),
              componentData: { core },
              options: {
                title: 'Demo',
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
