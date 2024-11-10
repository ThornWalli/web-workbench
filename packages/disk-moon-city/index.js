import { ITEM_META } from '@web-workbench/core/classes/FileSystem/Item';
import { SYMBOL } from '@web-workbench/core/utils/symbols';
import themeBlackContrast from '@web-workbench/core/themes/blackContrast';
import { filter } from 'rxjs';

export default async ({ core }) => {
  const [Demo] = await Promise.all([
    import('./components/AppWrapper').then(module => module.default)
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
        id: 'mooncity.app',
        action({ modules }) {
          const windowApp = modules.windows.addWindow(
            {
              title: 'Moon City',
              component: Demo,
              componentData: { core },
              options: {
                scaleX: false,
                scaleY: false,
                scrollX: false,
                scrollY: false,
                center: false,
                embed: true,
                borderless: true,
                hideRootHeader: true
              }
              // layout: {
              //   size: ipoint(540, 360)
              // }
            },
            {
              full: true
            }
          );

          core.modules.screen.setTheme(themeBlackContrast);

          return new Promise(resolve => {
            windowApp.events
              .pipe(filter(({ name }) => name === 'close'))
              .subscribe(() => {
                core.modules.screen.setTheme(null);
                resolve();
              });
          });
        }
      }
    ]
  };
};
