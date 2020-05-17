
import { ipoint } from '@js-basics/vector';
import { ITEM_META } from '../../classes/FileSystem/Item';
import { SYMBOL } from '../../utils/symbols';
import { Theme } from '@/web-workbench/classes/Theme';

export default ({ core }) => {
  return {
    locked: true,
    meta: [
      [
        ITEM_META.SYMBOL, SYMBOL.DISK_1
      ],
      [
        ITEM_META.WINDOW_SIZE, ipoint(360, 200)
      ],
      [
        ITEM_META.SORT_SYMBOLS, true
      ]
    ],
    name: 'mooncity',
    items: [

      {
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.DISK_1
          ]
        ],
        id: 'MoonCity.app',
        name: 'Moon City',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: actionGame(core)
      }
    ]
  };

  function actionGame () {
    const windowsModule = core.modules.windows;

    const themeMoonCity = new Theme('mooncity', {
      colors: {
        screen: {
          background: '#000'
        },
        window: {
          background: '#000'
        }
      }
    });

    return async ({ modules }) => {
      const executionResolve = core.addExecution();
      const [
        WbComponentsGame
      ] = await Promise.all([
        import('@/components/disks/mooncity/Game').then(module => module.default)
      ]);

      const model = {
      };

      const window = windowsModule.addWindow({
        title: 'Moon City',
        component: WbComponentsGame,
        componentData: {
          model
        },
        options: {
          scale: false,
          scrollX: false,
          scrollY: false,
          embed: true,
          hideRootHeader: true,
          borderless: true
        }
      }, {
        full: true
      });

      core.modules.screen.setTheme(themeMoonCity);

      return new Promise((resolve) => {
        executionResolve();
        window.events.subscribe(({ name }) => {
          if (name === 'close') {
            core.modules.screen.setTheme(null);
            resolve();
          }
        });
      });
    };
  }
};

