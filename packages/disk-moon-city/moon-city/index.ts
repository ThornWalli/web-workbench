import themeBlackContrast from '@web-workbench/core/themes/blackContrast';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { filter } from 'rxjs';

export default defineFileItems(({ core }) => {
  return [
    {
      id: 'Mooncity.app',
      name: 'Moon City',
      meta: [
        [ITEM_META.POSITION, { x: 0, y: 5 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true]
      ],
      async action() {
        const component = await import('./components/AppWrapper.vue').then(
          module => module.default
        );

        const windowApp = core.modules.windows?.addWindow(
          {
            component,
            componentData: { core },
            options: {
              title: 'Moon City',
              scaleX: false,
              scaleY: false,
              scrollX: false,
              scrollY: false,
              center: false,
              embed: true,
              borderless: true,
              hideRootHeader: true
            }
          },
          {
            full: true
          }
        );

        core.modules.screen?.setTheme(themeBlackContrast);

        const { promise, resolve } = Promise.withResolvers<undefined>();

        windowApp?.events
          .pipe(filter(({ name }) => name === 'close'))
          .subscribe(() => {
            core.modules.screen?.setTheme(undefined);
            resolve(undefined);
          });

        return promise;
      }
    }
  ];
});
