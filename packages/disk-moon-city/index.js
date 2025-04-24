import { ITEM_META } from '@web-workbench/core/classes/FileSystem/Item';
import { SYMBOL } from '@web-workbench/core/utils/symbols';
import themeBlackContrast from '@web-workbench/core/themes/blackContrast';
import { filter } from 'rxjs';

export default async ({ core }) => {
  const [Demo, readmeContent] = (
    await Promise.all([
      import('./components/AppWrapper'),
      import('./README.md?raw')
    ])
  ).map(module => module.default || module);

  console.log({ readmeContent });

  // return Promise.all(
  //   files.map(({ id, name, content, position, fontFamily, fontSize }) => {
  //     return fs.createRootFile(
  //       id,
  //       name,
  //       {
  //         openMaximized: true,
  //         type: 'markdown',
  //         content,
  //         fontFamily: fontFamily || FONT_FAMILES.SansSerif.Arial,
  //         fontSize: fontSize || DEFAULT_FONT_SIZE
  //       },
  //       {
  //         meta: [
  //           [ITEM_META.POSITION, position],
  //           [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
  //           [ITEM_META.SYMBOL, SYMBOL.LARGE_NOTE_RICH]
  //         ]
  //       }
  //     );
  //   })
  // ).catch(err => {
  //   throw new Error(err);
  // });

  return {
    meta: [
      [ITEM_META.SYMBOL, SYMBOL.DISK_2],
      // [ITEM_META.WINDOW_SYMBOL_REARRANGE, true],
      [ITEM_META.VISIBLE, true]
    ],
    name: 'Moon City',
    items: [
      {
        id: 'Readme.md',
        name: 'Readme',
        data: {
          type: 'markdown',
          content: readmeContent,
          position: { x: 50, y: 0 },
          fontSize: 16
        },
        meta: [
          [ITEM_META.POSITION, { x: 70, y: 5 }],
          [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
          [ITEM_META.SYMBOL, SYMBOL.LARGE_NOTE_RICH]
        ]
      },
      {
        id: 'Mooncity.app',
        name: 'Moon City',
        meta: [
          [ITEM_META.POSITION, { x: 0, y: 5 }],
          [ITEM_META.IGNORE_SYMBOL_REARRANGE, true]
        ],
        action({ modules }) {
          const windowApp = modules.windows.addWindow(
            {
              component: Demo,
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

          core.modules.screen.setTheme(themeBlackContrast);

          const { promise, resolve } = Promise.withResolvers();

          windowApp.events
            .pipe(filter(({ name }) => name === 'close'))
            .subscribe(() => {
              core.modules.screen.setTheme(null);
              resolve();
            });
          return promise;
        }
      }
    ]
  };
};
